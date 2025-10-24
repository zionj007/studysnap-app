import { useState, useEffect } from 'react'
import Navigation from './components/Navigation'
import UploadBox from './components/UploadBox'
import QuestionGenerator from './components/QuestionGenerator'
import Quiz from './components/Quiz'
import Dashboard from './components/Dashboard'
import ProUpgrade from './components/ProUpgrade'
import StudyTips from './components/StudyTips'
import WelcomeScreen from './components/WelcomeScreen'
import Login from './components/Login'
import Register from './components/Register'
import AdminPanel from './components/AdminPanel'
import { UserProvider, useUser } from './contexts/UserContext'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import './App.css'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('upload')
  const [uploadResult, setUploadResult] = useState(null)
  const [questions, setQuestions] = useState(null)
  const [quizHistory, setQuizHistory] = useState([])
  const [showProUpgrade, setShowProUpgrade] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  
  const { user, incrementQuizUsage, canGenerateQuiz, getRemainingQuizzes, upgradeToPro } = useUser()
  const { isAuthenticated, isAdmin, isPro, logout } = useAuth()

  // Load quiz history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('quizHistory')
    if (savedHistory) {
      setQuizHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Save quiz history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('quizHistory', JSON.stringify(quizHistory))
  }, [quizHistory])

  const handleUploadSuccess = (result) => {
    setUploadResult(result)
    setQuestions(null) // Reset questions when new file is uploaded
  }

  const handleQuestionsGenerated = (generatedQuestions) => {
    setQuestions(generatedQuestions)
    setCurrentPage('quiz') // Automatically navigate to quiz
    incrementQuizUsage() // Track usage for Pro limits
  }

  const handleQuizComplete = (quizResult) => {
    const newQuizEntry = {
      ...quizResult,
      timestamp: new Date().toISOString(),
      topic: uploadResult?.originalName || 'General'
    }
    
    setQuizHistory(prev => [newQuizEntry, ...prev])
    setCurrentPage('dashboard') // Navigate to dashboard to see results
  }

  const resetApp = () => {
    setUploadResult(null)
    setQuestions(null)
    setCurrentPage('upload')
  }

  // Authentication handlers
  const handleLogin = (userData, userToken) => {
    console.log('Login successful:', userData)
    setShowLogin(false)
    // Update user context with auth data
    upgradeToPro(userData.isPro ? 'PRO' : 'FREE')
  }

  const handleRegister = (userData, userToken) => {
    console.log('Register successful:', userData)
    setShowRegister(false)
    // Update user context with auth data
    upgradeToPro(userData.isPro ? 'PRO' : 'FREE')
  }

  const handleLogout = () => {
    console.log('Logging out...')
    logout()
    setShowAdminPanel(false)
  }

  const handleShowLogin = () => {
    console.log('Opening login modal...')
    setShowLogin(true)
  }

  const handleShowRegister = () => {
    console.log('Opening register modal...')
    setShowRegister(true)
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'upload':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                📸 StudySnap
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Upload your study materials and turn them into interactive quizzes
              </p>
              
              {/* Authentication Status Banner */}
              {!isAuthenticated() ? (
                <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold">🔐</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Create an account for better experience
                        </p>
                        <p className="text-sm text-gray-600">
                          Login to save your progress and access premium features
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleShowLogin}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
                      >
                        Login
                      </button>
                      <button
                        onClick={handleShowRegister}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 transition-all"
                      >
                        Sign Up
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-green-50 to-purple-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 font-bold">✅</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          Welcome back, {user?.name || 'User'}!
                        </p>
                        <p className="text-sm text-gray-600">
                          {isPro() ? '⭐ Pro Plan Active' : `${getRemainingQuizzes()} generations remaining this week`}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {isAdmin() && (
                        <button
                          onClick={() => setShowAdminPanel(true)}
                          className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-all"
                        >
                          👑 Admin Panel
                        </button>
                      )}
                      {!isPro() && (
                        <button
                          onClick={() => setShowProUpgrade(true)}
                          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                        >
                          Upgrade to Pro
                        </button>
                      )}
                      <button
                        onClick={handleLogout}
                        className="bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-700 transition-all"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Pro Status Banner for non-authenticated users */}
              {!isAuthenticated() && !user.isPro && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-purple-600 font-bold">👑</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {getRemainingQuizzes()} generations remaining this week
                        </p>
                        <p className="text-sm text-gray-600">
                          Upgrade to Pro for unlimited uploads and generations with enhanced AI
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowProUpgrade(true)}
                      className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                    >
                      Upgrade to Pro
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-center">
              <UploadBox 
                onUploadSuccess={handleUploadSuccess}
                onUpgradeClick={() => setShowProUpgrade(true)}
              />
            </div>

            {uploadResult && (
              <div className="flex justify-center">
                <QuestionGenerator 
                  extractedText={uploadResult.text}
                  onQuestionsGenerated={handleQuestionsGenerated}
                  canGenerateQuiz={canGenerateQuiz()}
                  onUpgradeClick={() => setShowProUpgrade(true)}
                />
              </div>
            )}

            {/* Study Tips Section */}
            <div className="mt-12">
              <StudyTips />
            </div>
          </div>
        )

      case 'quiz':
        if (!questions || questions.length === 0) {
          return (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">No Quiz Available</h2>
              <p className="text-gray-600 mb-6">Please upload a file and generate questions first.</p>
              <button
                onClick={() => setCurrentPage('upload')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Upload
              </button>
            </div>
          )
        }

        return (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <button
                onClick={resetApp}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Upload New File
              </button>
            </div>
            <Quiz 
              questions={questions}
              onQuizComplete={handleQuizComplete}
            />
          </div>
        )

      case 'dashboard':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <button
                onClick={resetApp}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                ← Upload New File
              </button>
            </div>
            <Dashboard />
          </div>
        )

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <button
              onClick={() => setCurrentPage('upload')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {renderCurrentPage()}
      </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">📸 StudySnap - Turn your study materials into interactive quizzes</p>
            <p className="text-sm">
              Built with React, Node.js, and OpenAI • 
              <span className="text-blue-600 ml-1">Pro features available!</span>
        </p>
      </div>
        </div>
      </footer>

      {/* Pro Upgrade Modal */}
      {showProUpgrade && (
        <ProUpgrade 
          onClose={() => setShowProUpgrade(false)}
          onUpgrade={(plan) => {
            setShowProUpgrade(false)
            upgradeToPro(plan)
            // In a real app, this would handle Stripe payment
            console.log(`Upgraded to ${plan}`)
          }}
        />
      )}

      {/* Welcome Screen */}
      {showWelcome && (
        <WelcomeScreen 
          onClose={() => setShowWelcome(false)}
        />
      )}

      {/* Authentication Modals */}
      {showLogin && (
        <Login 
          onLogin={handleLogin}
          onSwitchToRegister={() => {
            setShowLogin(false)
            setShowRegister(true)
          }}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showRegister && (
        <Register 
          onRegister={handleRegister}
          onSwitchToLogin={() => {
            setShowRegister(false)
            setShowLogin(true)
          }}
          onClose={() => setShowRegister(false)}
        />
      )}

      {/* Admin Panel */}
      {showAdminPanel && (
        <AdminPanel 
          user={user}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </AuthProvider>
  )
}

export default App