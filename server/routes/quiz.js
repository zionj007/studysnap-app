const express = require('express');
const chunkText = require('../utils/textChunker');
const generateQuizQuestions = require('../utils/quizGenerator');

const router = express.Router();

// POST /api/generate-quiz endpoint
router.post('/generate-quiz', async (req, res) => {
  try {
    const { text, maxWords = 700 } = req.body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Text is required for quiz generation'
      });
    }

    // Chunk the text into manageable pieces
    const chunks = chunkText(text, maxWords);
    
    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid text chunks could be created'
      });
    }

    // Generate questions for each chunk
    const allQuestions = [];
    chunks.forEach((chunk, index) => {
      const quizData = generateQuizQuestions(chunk.chunkText);
      if (quizData.questions && quizData.questions.length > 0) {
        // Add chunk information to each question
        quizData.questions.forEach(question => {
          question.chunkId = chunk.id;
          question.chunkText = chunk.chunkText.substring(0, 100) + '...';
        });
        allQuestions.push(...quizData.questions);
      }
    });

    if (allQuestions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No questions could be generated from the provided text'
      });
    }

    // Limit to maximum 20 questions
    const limitedQuestions = allQuestions.slice(0, 20);

    res.json({
      success: true,
      questions: limitedQuestions,
      totalChunks: chunks.length,
      totalQuestions: limitedQuestions.length
    });

  } catch (error) {
    console.error('Quiz generation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Quiz generation failed'
    });
  }
});

module.exports = router;
