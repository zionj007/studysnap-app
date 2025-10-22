import { useState, useEffect } from 'react'
import QuizStats from './QuizStats'

const Quiz = ({ questions, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [score, setScore] = useState(0)
  const [quizResults, setQuizResults] = useState([]) // Stores results for each question
  const [isQuizComplete, setIsQuizComplete] = useState(false)

  useEffect(() => {
    if (!questions || questions.length === 0) {
      // Handle case where no questions are provided
      onQuizComplete({ score: 0, total: 0, results: [] });
    }
  }, [questions, onQuizComplete]);

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600">No questions available for this quiz.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  const handleOptionSelect = (index) => {
    if (!isAnswered) {
      setSelectedOption(index)
    }
  }

  const handleSubmitAnswer = () => {
    if (selectedOption === null) {
      return // Don't submit if no option is selected
    }
    setIsAnswered(true)

    const isCorrect = selectedOption === currentQuestion.answer_index
    if (isCorrect) {
      setScore(prev => prev + 1)
    }

    setQuizResults(prev => [
      ...prev,
      {
        question: currentQuestion.question,
        selectedOption: selectedOption,
        correctOption: currentQuestion.answer_index,
        isCorrect: isCorrect,
        options: currentQuestion.options,
        rationale: currentQuestion.rationale,
      }
    ])
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      // Quiz is complete
      setIsQuizComplete(true)
      onQuizComplete({ score, total: totalQuestions, results: quizResults })
    }
  }

  const handleSkipQuestion = () => {
    // Skip current question without answering
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedOption(null)
      setIsAnswered(false)
    } else {
      // Quiz is complete
      onQuizComplete({ score, total: totalQuestions, results: quizResults })
    }
  }

  const getOptionClass = (index) => {
    if (!isAnswered) {
      return selectedOption === index
        ? 'bg-blue-100 border-blue-500'
        : 'hover:bg-gray-100 border-gray-300'
    }

    // If answered, show correct/incorrect with enhanced visibility
    if (index === currentQuestion.answer_index) {
      return 'bg-green-200 border-green-600 text-green-900 font-bold text-lg' // Correct answer - more prominent
    }
    if (index === selectedOption && selectedOption !== currentQuestion.answer_index) {
      return 'bg-red-200 border-red-600 text-red-900 font-bold' // Wrong selected answer
    }
    return 'bg-gray-100 border-gray-300 text-gray-600' // Unselected incorrect
  }

  // Show quiz completion screen
  if (isQuizComplete) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-3xl text-white">🎉</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">Great job completing your study quiz</p>
        </div>

        <QuizStats 
          quizResults={quizResults}
          totalQuestions={totalQuestions}
          score={score}
        />

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => {
              setIsQuizComplete(false)
              setCurrentQuestionIndex(0)
              setScore(0)
              setQuizResults([])
              setSelectedOption(null)
              setIsAnswered(false)
            }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Retake Quiz
          </button>
          <button
            onClick={() => onQuizComplete({ score, total: totalQuestions, results: quizResults })}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Finish & View Results
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-4 sm:p-8 rounded-lg shadow-xl max-w-4xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Comprehensive Study Quiz</h2>
        <p className="text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </p>
        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div 
            className="bg-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / totalQuestions) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Covering all {totalQuestions} concepts from your study material
        </p>
      </div>

      <div className="mb-8">
        <p className="text-xl font-semibold text-gray-800 mb-6 leading-relaxed">
          {currentQuestion.question}
        </p>
                <div className="space-y-3 sm:space-y-4">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionSelect(index)}
                      disabled={isAnswered}
                      className={`w-full text-left p-3 sm:p-4 border-2 rounded-lg transition-all duration-200 touch-manipulation ${getOptionClass(index)}`}
                    >
              <div className="flex items-start">
                <span className="font-bold mr-3 mt-1 text-lg">{String.fromCharCode(65 + index)}.</span>
                <span className="text-base leading-relaxed flex-1">{option}</span>
                {isAnswered && index === currentQuestion.answer_index && (
                  <div className="ml-2 mt-1">
                    <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                {isAnswered && index === selectedOption && selectedOption !== currentQuestion.answer_index && (
                  <div className="ml-2 mt-1">
                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {!isAnswered && (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            onClick={handleSubmitAnswer}
            disabled={selectedOption === null}
            className={`px-6 sm:px-8 py-3 rounded-lg text-base sm:text-lg font-semibold transition-colors touch-manipulation ${
              selectedOption !== null
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </button>
          <button
            onClick={handleSkipQuestion}
            className="px-6 sm:px-8 py-3 bg-gray-500 text-white rounded-lg text-base sm:text-lg font-semibold hover:bg-gray-600 transition-colors touch-manipulation"
          >
            Skip Question
          </button>
        </div>
      )}

      {isAnswered && (
        <div className="mt-6">
          <div className={`p-6 rounded-lg border-2 ${
            selectedOption === currentQuestion.answer_index 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center space-x-3 mb-4">
              {selectedOption === currentQuestion.answer_index ? (
                <>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-green-700">✅ Correct! Great job!</p>
                </>
              ) : (
                <>
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-xl font-bold text-red-700">❌ Incorrect. Let's learn!</p>
                </>
              )}
            </div>
            
            {selectedOption !== currentQuestion.answer_index && (
              <div className="mb-4 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                <p className="text-sm font-bold text-green-800 mb-2 flex items-center">
                  <span className="mr-2">🎯</span>
                  The correct answer is:
                </p>
                <p className="text-lg font-bold text-green-900">
                  {String.fromCharCode(65 + currentQuestion.answer_index)}. {currentQuestion.options[currentQuestion.answer_index]}
                </p>
              </div>
            )}
            
            <div className="text-gray-700">
              <p className="font-semibold mb-2 flex items-center">
                <span className="mr-2">💡</span>
                Explanation:
              </p>
              <p className="text-base leading-relaxed">{currentQuestion.rationale}</p>
            </div>
          </div>
          <button
            onClick={handleNextQuestion}
            className="w-full mt-6 py-4 px-6 bg-purple-600 text-white rounded-lg text-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            {currentQuestionIndex < totalQuestions - 1 ? 'Next Question →' : 'Finish Quiz 🎉'}
          </button>
        </div>
      )}

      {/* Progress Summary */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center text-sm text-gray-600">
          <span>Questions Answered: {quizResults.length}</span>
          <span>Correct Answers: {score}</span>
          <span>Remaining: {totalQuestions - currentQuestionIndex - 1}</span>
        </div>
      </div>
    </div>
  )
}

export default Quiz