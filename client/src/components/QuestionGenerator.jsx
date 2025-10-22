import { useState, useEffect } from 'react'

const QuestionGenerator = ({ extractedText, onQuestionsGenerated, canGenerateQuiz, onUpgradeClick }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentChunk, setCurrentChunk] = useState(0)
  const [totalChunks, setTotalChunks] = useState(0)
  const [error, setError] = useState(null)
  const [estimatedQuestions, setEstimatedQuestions] = useState(0)

  // Calculate estimated number of questions based on text length
  const calculateEstimatedQuestions = (text) => {
    const wordCount = text.split(/\s+/).filter(Boolean).length
    if (wordCount < 200) return '5-8'
    if (wordCount < 500) return '8-12'
    if (wordCount < 1000) return '12-18'
    return '18-25'
  }

  const generateQuestions = async () => {
    if (!extractedText) {
      setError('No text available for question generation')
      return
    }

    if (!canGenerateQuiz) {
      setError('You have reached your daily quiz limit. Upgrade to Pro for unlimited quizzes!')
      return
    }

    setIsGenerating(true)
    setError(null)
    setProgress(0)
    setEstimatedQuestions(calculateEstimatedQuestions(extractedText))

    try {
      // Try OpenAI first, fallback to local generator
      // Smart API URL detection
      const getApiUrl = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        }
        // For production, assume backend is on same domain with different port
        return `${window.location.protocol}//${window.location.hostname}:3001`
      }

      const response = await fetch(`${getApiUrl()}/api/generate-questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chunk: extractedText 
        }),
      })

      const result = await response.json()

      if (response.ok && result.questions) {
        setProgress(100)
        setTotalChunks(1)
        setCurrentChunk(1)
        
        // Pass the generated questions to the parent component
        onQuestionsGenerated(result.questions)
      } else {
        // Any error from OpenAI - automatically fallback to local generator
        console.log('OpenAI not available, automatically using local quiz generator...')
        const localResponse = await fetch('http://localhost:3001/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: extractedText,
            maxWords: 700
          }),
        })

        const localResult = await localResponse.json()

        if (localResponse.ok && localResult.success && localResult.questions) {
          setProgress(100)
          setTotalChunks(1)
          setCurrentChunk(1)
          
          // Pass the locally generated questions to the parent component
          onQuestionsGenerated(localResult.questions)
        } else {
          throw new Error(localResult.message || 'Failed to generate questions with local generator')
        }
      }

    } catch (err) {
      console.error('Question generation error:', err)
      
      // If OpenAI fails completely, try local generator as final fallback
      try {
        console.log('Final fallback: using local quiz generator...')
        const localResponse = await fetch('http://localhost:3001/api/generate-quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            text: extractedText,
            maxWords: 700
          }),
        })

        const localResult = await localResponse.json()

        if (localResponse.ok && localResult.success && localResult.questions) {
          setProgress(100)
          setTotalChunks(1)
          setCurrentChunk(1)
          
          // Pass the locally generated questions to the parent component
          onQuestionsGenerated(localResult.questions)
        } else {
          setError('Failed to generate questions: ' + (localResult.message || err.message))
        }
      } catch (localErr) {
        setError('Failed to generate questions: ' + err.message)
      }
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">
        Generate Comprehensive Quiz
      </h2>
      
      {extractedText && (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-600">
              Text ready for quiz generation ({extractedText.split(/\s+/).filter(Boolean).length} words)
            </p>
            <p className="text-sm font-medium text-blue-600">
              Estimated: {estimatedQuestions} questions
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-xs text-gray-700">
              {extractedText.substring(0, 200)}...
            </p>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Analyzing text and generating comprehensive questions...
            </span>
            <span className="text-sm text-gray-500">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Creating questions to cover all topics in your study material
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

              {!canGenerateQuiz ? (
                <div className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600 font-semibold mb-2">
                      🚫 Daily Quiz Limit Reached
                    </p>
                    <p className="text-red-600 text-sm">
                      You've used all 3 free quizzes for today. Upgrade to Pro for unlimited quizzes!
                    </p>
                  </div>
                  <button
                    onClick={onUpgradeClick}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
                  >
                    👑 Upgrade to Pro - Unlimited Quizzes
                  </button>
                </div>
              ) : (
                <button
                  onClick={generateQuestions}
                  disabled={!extractedText || isGenerating}
                  className={`w-full px-6 py-3 rounded-lg font-medium transition-colors ${
                    !extractedText || isGenerating
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                  }`}
                >
                  {isGenerating ? 'Generating Comprehensive Questions...' : 'Generate Complete Quiz'}
                </button>
              )}

      {!extractedText && (
        <p className="text-sm text-gray-500 mt-2 text-center">
          Upload a file first to generate quiz questions
        </p>
      )}

      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-700">
          <strong>📚 Complete Coverage:</strong> Questions will be generated to cover every major topic, concept, and detail in your study material.
        </p>
        <p className="text-xs text-blue-600 mt-1">
          <strong>💡 Note:</strong> If OpenAI quota is exceeded, StudySnap will automatically use the local generator to create comprehensive questions.
        </p>
        <p className="text-xs text-green-600 mt-1">
          <strong>✅ Smart Fallback:</strong> Automatically uses local generator when OpenAI quota is exceeded - seamless experience!
        </p>
      </div>
    </div>
  )
}

export default QuestionGenerator
