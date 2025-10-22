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

// Master prompt for quiz generation
const MASTER_PROMPT = `You are an educational assistant. Given the passage below, generate a comprehensive set of multiple-choice questions that thoroughly cover ALL topics and concepts in the text.

IMPORTANT: Determine the optimal number of questions based on the text content:
- For short texts (under 200 words): Generate 5-8 questions
- For medium texts (200-500 words): Generate 8-12 questions  
- For long texts (500-1000 words): Generate 12-18 questions
- For very long texts (1000+ words): Generate 18-25 questions

Ensure complete coverage by including questions about:
- All key definitions and concepts
- Important examples and applications
- Relationships between different topics
- Practical implications and use cases
- Specific details and facts mentioned
- Cause-and-effect relationships
- Comparisons and contrasts
- Step-by-step processes or procedures

For each question, provide:
- id: unique number
- question: detailed and specific question that tests deep understanding
- options: array of 4 answer choices with detailed explanations
- answer_index: index (0-3) of the correct answer
- rationale: comprehensive explanation of why the correct answer is right and why others are wrong

Guidelines:
- Cover EVERY major topic and subtopic mentioned in the text
- Make questions test deep understanding, not just memorization
- Use specific vocabulary and terminology from the passage
- Make distractors plausible but clearly distinguishable from the correct answer
- Ensure questions progress from basic concepts to more complex applications
- Make each question comprehensive enough to test thorough understanding
- Include questions about both explicit and implicit information in the text

Passage:
"""<INSERT_CHUNK_TEXT_HERE>"""

Return ONLY valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "What is the detailed definition of...?",
      "options": ["Detailed option A with specific details", "Detailed option B with specific details", "Detailed option C with specific details", "Detailed option D with specific details"],
      "answer_index": 0,
      "rationale": "Comprehensive explanation of why this is correct, including why other options are incorrect and how this relates to the broader concepts in the text"
    }
  ]
}`;

// POST /api/generate-questions endpoint
router.post('/generate-questions', async (req, res) => {
  try {
    const { chunk } = req.body;

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

    // Replace placeholder in master prompt with actual chunk text
    const prompt = MASTER_PROMPT.replace('<INSERT_CHUNK_TEXT_HERE>', chunk.trim());

    console.log('Generating questions with OpenAI for chunk:', chunk.substring(0, 100) + '...');

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content generator. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
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

    // Validate each question
    const validQuestions = questionsData.questions.filter(question => {
      return question.id && 
             question.question && 
             Array.isArray(question.options) && 
             question.options.length === 4 &&
             typeof question.answer_index === 'number' &&
             question.answer_index >= 0 && 
             question.answer_index <= 3 &&
             question.rationale;
    });

    if (validQuestions.length === 0) {
      throw new Error('No valid questions found in OpenAI response');
    }

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
