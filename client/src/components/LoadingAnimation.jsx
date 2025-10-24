import { useState, useEffect } from 'react'

const LoadingAnimation = ({ message = "Loading...", showProgress = false, progress = 0 }) => {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.')
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center">
          {/* Spinning Icon */}
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 border-4 border-purple-200 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
            <div className="absolute inset-2 flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
          </div>

          {/* Message */}
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {message}{dots}
          </h3>

          {/* Progress Bar */}
          {showProgress && (
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          )}

          {/* Subtitle */}
          <p className="text-sm text-gray-600">
            {message.includes('Generating') ? 'Creating comprehensive questions...' : 
             message.includes('Uploading') ? 'Processing your file...' :
             'Please wait a moment'}
          </p>

          {/* Animated dots */}
          <div className="flex justify-center space-x-1 mt-4">
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingAnimation



