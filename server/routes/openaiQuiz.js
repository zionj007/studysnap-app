const express = require('express');

const router = express.Router();

// Initialize OpenAI client only when API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  const OpenAI = require('openai');
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}

// Enhanced Master prompt for intelligent quiz generation
const MASTER_PROMPT = `You are an expert educational content analyst and quiz generator. Your task is to deeply analyze the provided text and create intelligent, context-aware quiz questions that demonstrate true understanding of the content.

CRITICAL FILTERING RULES - MUST FOLLOW ABSOLUTELY:
1. IGNORE and DO NOT generate questions from:
   - Table of contents (TOC) sections - COMPLETELY IGNORE
   - Topic headings or section titles that appear alone without content - COMPLETELY IGNORE
   - Lines that are just numbers, roman numerals, or single words - COMPLETELY IGNORE
   - Structural elements like "Chapter 1", "Section 2", "Part 3", etc. - COMPLETELY IGNORE
   - Page references (e.g., "... 5" or "... 10") - COMPLETELY IGNORE
   - Any line that is purely organizational/navigational - COMPLETELY IGNORE
   - Topic lists (e.g., "1. Topic A", "2. Topic B") - COMPLETELY IGNORE
   - Chapter titles without explanations - COMPLETELY IGNORE

2. ONLY generate questions from:
   - Substantive content with actual explanations, descriptions, or information
   - Paragraphs that contain full sentences and meaningful content (at least 2-3 sentences)
   - Content that explains concepts, processes, or ideas in detail
   - Text that provides context, examples, or detailed information
   - Content that has verbs, complete thoughts, and explanations

3. QUESTION VALIDATION - DO NOT CREATE:
   - Questions asking "What is Chapter X?" or "What is Topic Y?"
   - Questions asking to identify topics from a list
   - Questions about table of contents structure
   - Questions that are just asking for topic names without context
   - Questions that test memorization of topic/chapter names

ANALYSIS REQUIREMENTS:
1. First, identify the MAIN TOPIC and SUBTOPICS in the text (but don't use topic names as questions)
2. Extract KEY CONCEPTS, DEFINITIONS, and TERMINOLOGY from substantive content
3. Identify RELATIONSHIPS between different ideas
4. Note PRACTICAL APPLICATIONS and EXAMPLES
5. Recognize CAUSE-EFFECT relationships and PROCESSES
6. Identify COMPARISONS, CONTRASTS, and CATEGORIZATIONS

QUESTION GENERATION STRATEGY:
- NEVER use headings, titles, section names, table of contents, or topic lists as questions
- NEVER generate questions from standalone topic headings without content
- ONLY generate questions from paragraphs and sentences that contain actual explanations or information
- Focus on UNDERSTANDING rather than memorization
- Create questions that test COMPREHENSION and APPLICATION
- Ensure questions reflect DEEP CONTEXTUAL UNDERSTANDING
- Make questions PROGRESSIVE (basic → intermediate → advanced)

QUESTION DISTRIBUTION (based on text length):
- Short texts (under 200 words): 5-8 questions
- Medium texts (200-500 words): 8-12 questions  
- Long texts (500-1000 words): 12-18 questions
- Very long texts (1000+ words): 18-25 questions

QUESTION TYPES TO INCLUDE:
1. CONCEPTUAL UNDERSTANDING: "What does [concept] mean in the context of..."
2. APPLICATION QUESTIONS: "How would [concept] apply to..."
3. RELATIONSHIP QUESTIONS: "What is the relationship between [A] and [B]..."
4. PROCESS QUESTIONS: "What happens when/if [condition]..."
5. ANALYSIS QUESTIONS: "Why does [phenomenon] occur..."
6. SYNTHESIS QUESTIONS: "What would happen if [scenario]..."

QUALITY STANDARDS:
- Each question must demonstrate understanding of the text's core meaning
- Avoid trivial or surface-level questions
- Ensure questions test analytical thinking
- Make distractors plausible but clearly wrong
- Use precise language from the text
- Create questions that require connecting multiple concepts

Passage to analyze:
"""<INSERT_CHUNK_TEXT_HERE>"""

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "Based on the text's analysis of [topic], what would be the most likely outcome if [specific scenario]?",
      "options": [
        "Detailed option A that demonstrates understanding of the concept",
        "Detailed option B that shows application of the principle", 
        "Detailed option C that reflects the text's specific context",
        "Detailed option D that connects multiple concepts from the text"
      ],
      "answer_index": 0,
      "rationale": "Comprehensive explanation that shows deep understanding of the text's concepts, why the correct answer is right, why others are wrong, and how this relates to the broader themes and applications discussed in the passage"
    }
  ]
}`;

// POST /api/generate-questions endpoint
router.post('/generate-questions', async (req, res) => {
  try {
    const { chunk } = req.body;

    // Get user ID from token or fallback to anonymous
    let userId = 'anonymous';
    const authHeader = req.headers['authorization'];
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const jwt = require('jsonwebtoken');
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'studysnap-secret-key-2024');
        userId = decoded.userId;
      } catch (error) {
        // Token invalid, continue as anonymous
        console.log('Invalid token, using anonymous user');
      }
    }

    // Check usage limits before processing
    const { canPerformAction, incrementUsage, getUserUsage } = require('../utils/usageTracker');
    
    if (!canPerformAction(userId, 'generate')) {
      const usage = getUserUsage(userId);
      return res.status(403).json({
        success: false,
        message: `Generation limit exceeded. ${usage.plan} plan allows ${usage.plan === 'FREE' ? '2' : 'unlimited'} generations per week.`,
        upgradeRequired: true,
        currentPlan: usage.plan
      });
    }

    // Validate input
    if (!chunk || typeof chunk !== 'string' || chunk.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Chunk text is required for question generation'
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.'
      });
    }

    // Filter out table of contents, topic headings, and structural elements
    const { filterContentForQuiz } = require('../utils/contentFilter');
    const filteredChunk = filterContentForQuiz(chunk.trim());
    
    // Check if filtered chunk has sufficient content
    if (!filteredChunk || filteredChunk.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient substantive content after filtering. The text appears to contain only table of contents, headings, or structural elements without actual content.'
      });
    }
    
    // Check if filtered content has enough sentences (at least 2-3 sentences)
    const sentences = filteredChunk.match(/[.!?]+/g);
    const sentenceCount = sentences ? sentences.length : 0;
    const wordCount = filteredChunk.split(/\s+/).filter(w => w.length > 0).length;
    
    if (sentenceCount < 2 || wordCount < 30) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient substantive content. The text needs at least 2-3 complete sentences with explanations or information, not just topic headings or structural elements.'
      });
    }

    // Replace placeholder in master prompt with filtered chunk text
    const prompt = MASTER_PROMPT.replace('<INSERT_CHUNK_TEXT_HERE>', filteredChunk);

    console.log('Generating questions with OpenAI for chunk:', filteredChunk.substring(0, 100) + '...');
    console.log('Original chunk length:', chunk.length, 'Filtered chunk length:', filteredChunk.length);

    // Call OpenAI API with enhanced parameters for better intelligence
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // Using GPT-4 for better understanding and analysis
      messages: [
        {
          role: "system",
          content: "You are an expert educational content analyst and quiz generator. You excel at deep content analysis and creating intelligent, context-aware questions that test true understanding. CRITICAL RULES: 1) COMPLETELY IGNORE table of contents, topic headings, chapter titles, and structural elements. 2) ONLY generate questions from substantive content with actual explanations, descriptions, and information (at least 2-3 sentences). 3) NEVER create questions asking 'What is Chapter X?' or 'What is Topic Y?' - these will be automatically rejected. 4) ONLY create questions from paragraphs that explain concepts, processes, or ideas in detail. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 3000, // Increased for more detailed questions
      temperature: 0.3, // Lower temperature for more focused, consistent responses
      top_p: 0.9,
      frequency_penalty: 0.1,
      presence_penalty: 0.1
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response received from OpenAI');
    }

    console.log('OpenAI response:', responseText.substring(0, 200) + '...');

    // Parse the JSON response
    let questionsData;
    try {
      questionsData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Raw response:', responseText);
      
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        try {
          questionsData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (secondParseError) {
          throw new Error('Failed to parse JSON from OpenAI response');
        }
      } else {
        throw new Error('No valid JSON found in OpenAI response');
      }
    }

    // Validate the response structure
    if (!questionsData.questions || !Array.isArray(questionsData.questions)) {
      throw new Error('Invalid response structure: questions array not found');
    }

    // Validate each question structure
    const structurallyValidQuestions = questionsData.questions.filter(question => {
      return question.id && 
             question.question && 
             Array.isArray(question.options) && 
             question.options.length === 4 &&
             typeof question.answer_index === 'number' &&
             question.answer_index >= 0 && 
             question.answer_index <= 3 &&
             question.rationale;
    });

    if (structurallyValidQuestions.length === 0) {
      throw new Error('No valid questions found in OpenAI response');
    }

    // Filter out questions about topics, TOC, or chapters
    const { filterQuestionsAboutTopics } = require('../utils/contentFilter');
    const validQuestions = filterQuestionsAboutTopics(structurallyValidQuestions);

    if (validQuestions.length === 0) {
      throw new Error('All generated questions were about topics, table of contents, or chapters. Please ensure the content contains substantive explanations and information, not just topic lists or structural elements.');
    }

    // Log if questions were filtered
    if (validQuestions.length < structurallyValidQuestions.length) {
      console.log(`Filtered out ${structurallyValidQuestions.length - validQuestions.length} questions about topics/TOC/chapters`);
    }

    // Track successful generation
    incrementUsage(userId, 'generate');
    
    res.json({
      success: true,
      questions: validQuestions,
      totalQuestions: validQuestions.length,
      source: 'openai'
    });

  } catch (error) {
    console.error('OpenAI quiz generation error:', error);
    
    // Handle specific OpenAI errors
    if (error.code === 'insufficient_quota') {
      return res.status(402).json({
        success: false,
        message: 'OpenAI API quota exceeded. Please check your billing.'
      });
    }
    
    if (error.code === 'invalid_api_key') {
      return res.status(401).json({
        success: false,
        message: 'Invalid OpenAI API key. Please check your OPENAI_API_KEY environment variable.'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Question generation failed'
    });
  }
});

module.exports = router;
