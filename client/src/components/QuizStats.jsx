import { useState, useEffect } from 'react'

const QuizStats = ({ quizResults, totalQuestions, score }) => {
  const [showStats, setShowStats] = useState(false)
  
  const accuracy = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0
  const timeSpent = quizResults.length > 0 ? '2-5 min' : '0 min' // Estimated
  
  const getPerformanceMessage = () => {
    if (accuracy >= 90) return { message: "Outstanding! 🌟", color: "text-green-600" }
    if (accuracy >= 80) return { message: "Great job! 🎉", color: "text-blue-600" }
    if (accuracy >= 70) return { message: "Good work! 👍", color: "text-yellow-600" }
    if (accuracy >= 60) return { message: "Keep practicing! 📚", color: "text-orange-600" }
    return { message: "Review and try again! 💪", color: "text-red-600" }
  }

  const performance = getPerformanceMessage()

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">📊 Quiz Results</h3>
        <button
          onClick={() => setShowStats(!showStats)}
          className="text-purple-600 hover:text-purple-800 transition-colors"
        >
          {showStats ? 'Hide Details' : 'Show Details'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{score}</div>
          <div className="text-sm text-gray-600">Correct</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{totalQuestions - score}</div>
          <div className="text-sm text-gray-600">Incorrect</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{timeSpent}</div>
          <div className="text-sm text-gray-600">Time Spent</div>
        </div>
      </div>

      <div className={`text-center p-3 rounded-lg ${performance.color} bg-white`}>
        <p className="font-semibold">{performance.message}</p>
      </div>

      {showStats && (
        <div className="mt-4 space-y-2">
          <h4 className="font-semibold text-gray-700">Question Breakdown:</h4>
          {quizResults.map((result, index) => (
            <div key={index} className={`p-2 rounded text-sm ${
              result.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              Q{index + 1}: {result.isCorrect ? '✅ Correct' : '❌ Incorrect'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuizStats



