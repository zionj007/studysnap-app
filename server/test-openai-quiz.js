const OpenAI = require('openai');

// Test the OpenAI quiz generation functionality
async function testOpenAIQuizGeneration() {
  // Check if API key is set
  if (!process.env.OPENAI_API_KEY) {
    console.log('❌ OPENAI_API_KEY not set. Please set it first:');
    console.log('   Windows: $env:OPENAI_API_KEY="your_api_key_here"');
    console.log('   Linux/Mac: export OPENAI_API_KEY="your_api_key_here"');
    console.log('   Or create a .env file in the server directory');
    return;
  }

  console.log('✅ OPENAI_API_KEY is configured');
  
  // Initialize OpenAI client
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const testChunk = `
Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention.
`;

  const masterPrompt = `You are an educational content generator. Given the following passage, generate 5 multiple-choice questions that help a student study the key ideas. For each question, provide:
- id (unique),
- question (clear and concise),
- options: an array of 4 answer options,
- answer_index: index (0-3) for the correct option,
- rationale: a 1-2 sentence explanation why the correct option is right.

Important rules:
- Avoid trick questions; make distractors plausible but clearly wrong when the student knows the material.
- Use vocabulary from the passage.
- Keep questions at a moderate difficulty for a student who read the chunk.

Passage:
"""${testChunk.trim()}"""

Output ONLY valid JSON: { "questions": [ {id, question, options, answer_index, rationale}, ... ] }`;

  try {
    console.log('🤖 Calling OpenAI API...');
    
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert educational content generator. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: masterPrompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const responseText = completion.choices[0]?.message?.content;
    
    if (!responseText) {
      throw new Error('No response received from OpenAI');
    }

    console.log('📝 Raw OpenAI response:');
    console.log(responseText);
    console.log('\n' + '='.repeat(50) + '\n');

    // Parse the JSON response
    let questionsData;
    try {
      questionsData = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Failed to parse as JSON:', parseError.message);
      
      // Try to extract JSON from markdown
      const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || 
                       responseText.match(/```\s*([\s\S]*?)\s*```/) ||
                       responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        console.log('🔍 Attempting to extract JSON from markdown...');
        questionsData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
      } else {
        throw new Error('No valid JSON found in response');
      }
    }

    console.log('✅ Successfully parsed questions:');
    console.log(JSON.stringify(questionsData, null, 2));

    if (questionsData.questions && Array.isArray(questionsData.questions)) {
      console.log(`\n📊 Generated ${questionsData.questions.length} questions:`);
      
      questionsData.questions.forEach((question, index) => {
        console.log(`\nQuestion ${index + 1}:`);
        console.log(`Q: ${question.question}`);
        console.log('Options:');
        question.options.forEach((option, optIndex) => {
          const marker = optIndex === question.answer_index ? '✓' : ' ';
          console.log(`  ${marker} ${optIndex + 1}. ${option}`);
        });
        console.log(`Rationale: ${question.rationale}`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'insufficient_quota') {
      console.log('💳 OpenAI API quota exceeded. Please check your billing.');
    } else if (error.code === 'invalid_api_key') {
      console.log('🔑 Invalid OpenAI API key. Please check your OPENAI_API_KEY.');
    }
  }
}

// Run the test
testOpenAIQuizGeneration();
