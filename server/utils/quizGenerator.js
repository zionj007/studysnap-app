/**
 * Educational content generator that creates multiple-choice questions from text passages
 * @param {string} passage - The text passage to generate questions from
 * @returns {Object} JSON object with questions array
 */
function generateQuizQuestions(passage) {
  if (!passage || typeof passage !== 'string' || passage.trim().length === 0) {
    return { questions: [] };
  }

  const questions = [];
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Extract key concepts and facts from the passage
  const keyConcepts = extractKeyConcepts(passage);
  const facts = extractFacts(passage);
  
  // Generate different types of questions for comprehensive coverage
  const questionTypes = [
    () => generateDefinitionQuestion(keyConcepts, passage),
    () => generateFactualQuestion(facts, passage),
    () => generateApplicationQuestion(passage),
    () => generateProcessQuestion(passage),
    () => generateComparisonQuestion(passage),
    () => generateCauseEffectQuestion(passage),
    () => generateExampleQuestion(passage),
    () => generateAdvantageQuestion(passage),
    () => generateDisadvantageQuestion(passage),
    () => generateMethodQuestion(passage),
    () => generatePurposeQuestion(passage),
    () => generateCharacteristicQuestion(passage),
    () => generateRequirementQuestion(passage),
    () => generateOutcomeQuestion(passage),
    () => generateSignificanceQuestion(passage)
  ];

  let questionId = 1;
  const usedQuestions = new Set();

  // Helper function to randomize answer positions
  const randomizeAnswers = (question) => {
    if (!question || !question.options || question.options.length !== 4) {
      return question;
    }

    const correctAnswer = question.options[question.answer_index];
    const incorrectAnswers = question.options.filter((_, index) => index !== question.answer_index);
    
    // Shuffle all answers
    const allAnswers = [correctAnswer, ...incorrectAnswers];
    for (let i = allAnswers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
    }
    
    // Find new position of correct answer
    const newCorrectIndex = allAnswers.indexOf(correctAnswer);
    
    return {
      ...question,
      options: allAnswers,
      answer_index: newCorrectIndex
    };
  };

  // Generate up to 15 questions for comprehensive coverage
  for (let i = 0; i < Math.min(15, questionTypes.length); i++) {
    try {
      const question = questionTypes[i]();
      if (question && !usedQuestions.has(question.question)) {
        question.id = questionId++;
        // Randomize the answer positions
        const randomizedQuestion = randomizeAnswers(question);
        questions.push(randomizedQuestion);
        usedQuestions.add(question.question);
      }
    } catch (error) {
      console.error(`Error generating question ${i + 1}:`, error);
    }
  }

  return { questions };
}

/**
 * Extract key concepts from the passage
 */
function extractKeyConcepts(passage) {
  const concepts = [];
  const words = passage.toLowerCase().split(/\s+/);
  const wordCount = {};
  
  // Count word frequency
  words.forEach(word => {
    const cleanWord = word.replace(/[^\w]/g, '');
    if (cleanWord.length > 4) { // Focus on longer, more meaningful words
      wordCount[cleanWord] = (wordCount[cleanWord] || 0) + 1;
    }
  });
  
  // Get most frequent meaningful words
  const sortedWords = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return sortedWords;
}

/**
 * Extract factual statements from the passage
 */
function extractFacts(passage) {
  const facts = [];
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  sentences.forEach(sentence => {
    const trimmed = sentence.trim();
    if (trimmed.length > 20 && trimmed.length < 150) {
      facts.push(trimmed);
    }
  });
  
  return facts;
}

/**
 * Generate a definition question
 */
function generateDefinitionQuestion(keyConcepts, passage) {
  if (keyConcepts.length === 0) return null;
  
  const concept = keyConcepts[0];
  const conceptPattern = new RegExp(`\\b${concept}\\b[^.!?]*[.!?]`, 'gi');
  const matches = passage.match(conceptPattern);
  
  if (!matches || matches.length === 0) return null;
  
  const definitionSentence = matches[0].trim();
  
  return {
    question: `What is the definition of "${concept}" based on the passage?`,
    options: [
      definitionSentence,
      generateDistractor(definitionSentence, 'different'),
      generateDistractor(definitionSentence, 'opposite'),
      generateDistractor(definitionSentence, 'unrelated')
    ],
    answer_index: 0,
    rationale: `The passage directly defines "${concept}" in the context provided.`
  };
}

/**
 * Generate a factual question
 */
function generateFactualQuestion(facts, passage) {
  if (facts.length === 0) return null;
  
  const fact = facts[0];
  const words = fact.split(' ');
  
  if (words.length < 5) return null;
  
  // Create a question by replacing a key word with a blank
  const keyWordIndex = Math.floor(words.length / 2);
  const keyWord = words[keyWordIndex];
  const questionText = fact.replace(keyWord, '_____');
  
  return {
    question: `Complete this statement: "${questionText}"`,
    options: [
      keyWord,
      generateSimilarWord(keyWord),
      generateOppositeWord(keyWord),
      generateRandomWord(keyWord)
    ],
    answer_index: 0,
    rationale: `The passage explicitly states this fact, making "${keyWord}" the correct answer.`
  };
}

/**
 * Generate an application question
 */
function generateApplicationQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  if (sentences.length < 2) return null;
  
  const firstSentence = sentences[0].trim();
  const keyWords = firstSentence.split(' ').filter(word => word.length > 4);
  
  if (keyWords.length === 0) return null;
  
  const mainConcept = keyWords[0];
  
  return {
    question: `According to the passage, what is a key characteristic of ${mainConcept}?`,
    options: [
      extractCharacteristic(firstSentence),
      generateDistractor(firstSentence, 'different'),
      generateDistractor(firstSentence, 'opposite'),
      generateDistractor(firstSentence, 'unrelated')
    ],
    answer_index: 0,
    rationale: `The passage describes this characteristic in relation to ${mainConcept}.`
  };
}

/**
 * Generate a process question
 */
function generateProcessQuestion(passage) {
  const processWords = ['process', 'method', 'approach', 'technique', 'system', 'way'];
  const processSentence = passage.split(/[.!?]+/)
    .find(sentence => processWords.some(word => sentence.toLowerCase().includes(word)));
  
  if (!processSentence) return null;
  
  return {
    question: `What does the passage describe as a key process or method?`,
    options: [
      extractProcessDescription(processSentence),
      generateDistractor(processSentence, 'different'),
      generateDistractor(processSentence, 'opposite'),
      generateDistractor(processSentence, 'unrelated')
    ],
    answer_index: 0,
    rationale: `The passage specifically describes this process or method.`
  };
}

/**
 * Generate a comparison question
 */
function generateComparisonQuestion(passage) {
  const comparisonWords = ['compared to', 'versus', 'different from', 'similar to', 'unlike', 'like'];
  const comparisonSentence = passage.split(/[.!?]+/)
    .find(sentence => comparisonWords.some(word => sentence.toLowerCase().includes(word)));
  
  if (!comparisonSentence) return null;
  
  return {
    question: `What comparison does the passage make?`,
    options: [
      extractComparison(comparisonSentence),
      generateDistractor(comparisonSentence, 'different'),
      generateDistractor(comparisonSentence, 'opposite'),
      generateDistractor(comparisonSentence, 'unrelated')
    ],
    answer_index: 0,
    rationale: `The passage explicitly makes this comparison.`
  };
}

/**
 * Helper functions for generating distractors and extracting information
 */
function generateDistractor(original, type) {
  const words = original.split(' ');
  const randomIndex = Math.floor(Math.random() * words.length);
  const originalWord = words[randomIndex];
  
  let distractorWord;
  switch (type) {
    case 'different':
      distractorWord = generateSimilarWord(originalWord);
      break;
    case 'opposite':
      distractorWord = generateOppositeWord(originalWord);
      break;
    case 'unrelated':
      distractorWord = generateRandomWord(originalWord);
      break;
    default:
      distractorWord = generateSimilarWord(originalWord);
  }
  
  words[randomIndex] = distractorWord;
  return words.join(' ');
}

function generateSimilarWord(word) {
  const similarWords = {
    'artificial': 'synthetic',
    'intelligence': 'smartness',
    'machine': 'device',
    'learning': 'training',
    'network': 'system',
    'neural': 'brain-like',
    'deep': 'advanced',
    'algorithm': 'method',
    'data': 'information',
    'model': 'framework'
  };
  
  const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
  return similarWords[cleanWord] || cleanWord + 's';
}

function generateOppositeWord(word) {
  const opposites = {
    'artificial': 'natural',
    'intelligent': 'unintelligent',
    'learning': 'forgetting',
    'deep': 'shallow',
    'advanced': 'basic',
    'complex': 'simple',
    'automatic': 'manual',
    'efficient': 'inefficient',
    'accurate': 'inaccurate',
    'fast': 'slow'
  };
  
  const cleanWord = word.toLowerCase().replace(/[^\w]/g, '');
  return opposites[cleanWord] || 'not-' + cleanWord;
}

function generateRandomWord(word) {
  const randomWords = ['system', 'process', 'method', 'approach', 'technique', 'way', 'means', 'tool'];
  return randomWords[Math.floor(Math.random() * randomWords.length)];
}

function extractCharacteristic(sentence) {
  const words = sentence.split(' ');
  const characteristic = words.slice(0, Math.min(6, words.length)).join(' ');
  return characteristic;
}

function extractProcessDescription(sentence) {
  const words = sentence.split(' ');
  const description = words.slice(0, Math.min(8, words.length)).join(' ');
  return description;
}

function extractComparison(sentence) {
  const words = sentence.split(' ');
  const comparison = words.slice(0, Math.min(10, words.length)).join(' ');
  return comparison;
}

function generateCauseEffectQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const causeWords = ['because', 'due to', 'caused by', 'leads to', 'results in', 'enables', 'allows'];
  
  for (const sentence of sentences) {
    if (causeWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is the primary cause or effect related to ${concept}?`,
          options: [
            `${concept} improves efficiency`,
            `${concept} reduces complexity`,
            `${concept} increases accuracy`,
            `${concept} enhances performance`
          ],
          answer_index: 0,
          rationale: `The passage explains how ${concept} functions and its impact on the overall system or process.`
        };
      }
    }
  }
  
  return null;
}

function generateExampleQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const exampleWords = ['for example', 'such as', 'including', 'like', 'instance'];
  
  for (const sentence of sentences) {
    if (exampleWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `Which of the following is an example of ${concept}?`,
          options: [
            `A specific application of ${concept}`,
            `A related concept to ${concept}`,
            `A different approach to ${concept}`,
            `An alternative to ${concept}`
          ],
          answer_index: 0,
          rationale: `The passage provides examples and applications of ${concept} to illustrate its practical use.`
        };
      }
    }
  }
  
  return null;
}

function generateAdvantageQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const advantageWords = ['advantage', 'benefit', 'strength', 'pros', 'positive', 'improves', 'enhances'];
  
  for (const sentence of sentences) {
    if (advantageWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is a key advantage of ${concept}?`,
          options: [
            `It provides better performance`,
            `It reduces costs`,
            `It increases flexibility`,
            `It improves reliability`
          ],
          answer_index: 0,
          rationale: `The passage highlights the benefits and advantages of ${concept} in practical applications.`
        };
      }
    }
  }
  
  return null;
}

function generateDisadvantageQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const disadvantageWords = ['disadvantage', 'limitation', 'weakness', 'cons', 'negative', 'challenge', 'problem'];
  
  for (const sentence of sentences) {
    if (disadvantageWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is a potential limitation of ${concept}?`,
          options: [
            `It may require more resources`,
            `It could be less efficient`,
            `It might have compatibility issues`,
            `It may need additional training`
          ],
          answer_index: 0,
          rationale: `The passage discusses the challenges and limitations associated with ${concept}.`
        };
      }
    }
  }
  
  return null;
}

function generateMethodQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const methodWords = ['method', 'approach', 'technique', 'process', 'procedure', 'way', 'how'];
  
  for (const sentence of sentences) {
    if (methodWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is the primary method used for ${concept}?`,
          options: [
            `A systematic approach to ${concept}`,
            `An automated process for ${concept}`,
            `A manual technique for ${concept}`,
            `A hybrid method for ${concept}`
          ],
          answer_index: 0,
          rationale: `The passage describes the methodology and approach used in ${concept}.`
        };
      }
    }
  }
  
  return null;
}

function generatePurposeQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const purposeWords = ['purpose', 'goal', 'objective', 'aim', 'intention', 'designed to', 'meant to'];
  
  for (const sentence of sentences) {
    if (purposeWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is the main purpose of ${concept}?`,
          options: [
            `To improve efficiency and performance`,
            `To reduce complexity and costs`,
            `To enhance accuracy and reliability`,
            `To increase flexibility and adaptability`
          ],
          answer_index: 0,
          rationale: `The passage explains the purpose and objectives of ${concept} in the overall system.`
        };
      }
    }
  }
  
  return null;
}

function generateCharacteristicQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const characteristicWords = ['characteristic', 'feature', 'property', 'attribute', 'quality', 'trait'];
  
  for (const sentence of sentences) {
    if (characteristicWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is a key characteristic of ${concept}?`,
          options: [
            `It has unique properties`,
            `It demonstrates specific behaviors`,
            `It shows particular patterns`,
            `It exhibits distinct features`
          ],
          answer_index: 0,
          rationale: `The passage describes the characteristics and properties that define ${concept}.`
        };
      }
    }
  }
  
  return null;
}

function generateRequirementQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const requirementWords = ['requirement', 'needs', 'requires', 'necessary', 'essential', 'prerequisite'];
  
  for (const sentence of sentences) {
    if (requirementWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is required for ${concept} to function properly?`,
          options: [
            `Specific conditions and resources`,
            `Proper setup and configuration`,
            `Adequate training and knowledge`,
            `Sufficient time and effort`
          ],
          answer_index: 0,
          rationale: `The passage outlines the requirements and prerequisites needed for ${concept} to work effectively.`
        };
      }
    }
  }
  
  return null;
}

function generateOutcomeQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const outcomeWords = ['outcome', 'result', 'consequence', 'effect', 'impact', 'achievement'];
  
  for (const sentence of sentences) {
    if (outcomeWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `What is the expected outcome of ${concept}?`,
          options: [
            `Improved performance and efficiency`,
            `Reduced costs and complexity`,
            `Enhanced accuracy and reliability`,
            `Increased flexibility and adaptability`
          ],
          answer_index: 0,
          rationale: `The passage describes the expected results and outcomes of implementing ${concept}.`
        };
      }
    }
  }
  
  return null;
}

function generateSignificanceQuestion(passage) {
  const sentences = passage.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const significanceWords = ['important', 'significant', 'crucial', 'vital', 'essential', 'critical'];
  
  for (const sentence of sentences) {
    if (significanceWords.some(word => sentence.toLowerCase().includes(word))) {
      const concepts = extractKeyConcepts(sentence);
      if (concepts.length >= 1) {
        const concept = concepts[0];
        
        return {
          question: `Why is ${concept} significant?`,
          options: [
            `It plays a crucial role in the system`,
            `It provides essential functionality`,
            `It enables important capabilities`,
            `It contributes to overall success`
          ],
          answer_index: 0,
          rationale: `The passage explains the importance and significance of ${concept} in the broader context.`
        };
      }
    }
  }
  
  return null;
}

module.exports = generateQuizQuestions;
