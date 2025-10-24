import { useState, useEffect } from 'react'

const Dashboard = () => {
  const [quizHistory, setQuizHistory] = useState([])
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    averageScore: 0,
    totalTimeSpent: 0,
    weakTopics: []
  })

  useEffect(() => {
    // Load quiz history from localStorage
    const savedHistory = localStorage.getItem('quizHistory')
    if (savedHistory) {
      const history = JSON.parse(savedHistory)
      setQuizHistory(history)
      calculateStats(history)
    }
  }, [])

  const calculateStats = (history) => {
    if (history.length === 0) return

    const totalQuizzes = history.length
    const totalScore = history.reduce((sum, quiz) => sum + quiz.score, 0)
    const averageScore = Math.round(totalScore / totalQuizzes)
    const totalTimeSpent = history.reduce((sum, quiz) => sum + quiz.timeSpent, 0)

    // Calculate weak topics (scores below 70%)
    const weakTopics = history
      .filter(quiz => quiz.score < 70)
      .map(quiz => quiz.topic || 'General')
      .reduce((acc, topic) => {
        acc[topic] = (acc[topic] || 0) + 1
        return acc
      }, {})

    setStats({
      totalQuizzes,
      averageScore,
      totalTimeSpent,
      weakTopics: Object.entries(weakTopics).map(([topic, count]) => ({ topic, count }))
    })
  }

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${mins}m ${secs}s`
    } else if (mins > 0) {
      return `${mins}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const clearHistory = () => {
    localStorage.removeItem('quizHistory')
    setQuizHistory([])
    setStats({
      totalQuizzes: 0,
      averageScore: 0,
      totalTimeSpent: 0,
      weakTopics: []
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Study Dashboard</h1>
        <p className="text-gray-600">Track your learning progress and identify areas for improvement</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalQuizzes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageScore}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900">{formatTime(stats.totalTimeSpent)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Weak Topics */}
      {stats.weakTopics.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Areas for Improvement</h2>
          <div className="space-y-3">
            {stats.weakTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="text-red-800 font-medium">{topic.topic}</span>
                <span className="text-red-600 text-sm">{topic.count} quiz{topic.count > 1 ? 'es' : ''} below 70%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Quiz History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Recent Quizzes</h2>
          {quizHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-sm text-red-600 hover:text-red-800 transition-colors"
            >
              Clear History
            </button>
          )}
        </div>

        {quizHistory.length === 0 ? (
          <div className="text-center py-8">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-500">No quiz history yet. Complete some quizzes to see your progress!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {quizHistory.slice(0, 10).map((quiz, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    quiz.score >= 80 ? 'bg-green-500' : 
                    quiz.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Quiz #{quizHistory.length - index}
                    </p>
                    <p className="text-sm text-gray-600">
                      {quiz.totalQuestions} questions • {formatTime(quiz.timeSpent)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${
                    quiz.score >= 80 ? 'text-green-600' : 
                    quiz.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {quiz.score}%
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(quiz.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Monetization Placeholder */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">🚀 Upgrade to Pro</h3>
        <p className="text-blue-100 mb-4">
          Unlock unlimited uploads, advanced analytics, and personalized study plans.
        </p>
        <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
          Coming Soon - Upgrade to Pro
        </button>
      </div>
    </div>
  )
}

export default Dashboard



