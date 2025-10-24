const generateQuizQuestions = require('./utils/quizGenerator');

// Test with sample AI text
const sampleText = `
Artificial intelligence (AI) is intelligence demonstrated by machines, in contrast to the natural intelligence displayed by humans and animals. Leading AI textbooks define the field as the study of "intelligent agents": any device that perceives its environment and takes actions that maximize its chance of successfully achieving its goals. Machine learning is a method of data analysis that automates analytical model building. It is a branch of artificial intelligence based on the idea that systems can learn from data, identify patterns and make decisions with minimal human intervention. Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning. Neural networks are computing systems inspired by biological neural networks. These systems learn to perform tasks by considering examples, generally without being programmed with any task-specific rules. An artificial neural network is based on a collection of connected units or nodes called artificial neurons, which loosely model the neurons in a biological brain. Each connection, like the synapses in a biological brain, can transmit a signal to other neurons. Convolutional neural networks (CNNs) are a class of deep neural networks, most commonly applied to analyzing visual imagery. They are also known as shift invariant or space invariant artificial neural networks, based on their shared-weights architecture and translation invariance characteristics.
`;

console.log('=== Quiz Generation Test ===\n');

try {
  const result = generateQuizQuestions(sampleText);
  
  console.log(`Generated ${result.questions.length} questions:\n`);
  
  result.questions.forEach((question, index) => {
    console.log(`Question ${question.id}:`);
    console.log(`Q: ${question.question}`);
    console.log('Options:');
    question.options.forEach((option, optIndex) => {
      const marker = optIndex === question.answer_index ? '✓' : ' ';
      console.log(`  ${marker} ${optIndex + 1}. ${option}`);
    });
    console.log(`Rationale: ${question.rationale}`);
    console.log('---\n');
  });
  
} catch (error) {
  console.error('Error generating quiz:', error);
}



