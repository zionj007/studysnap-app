import { useState } from 'react'

const WelcomeScreen = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      title: "Welcome to StudySnap! 📸",
      content: "Transform your study materials into interactive quizzes with AI-powered question generation.",
      icon: "🎯"
    },
    {
      title: "Upload Any File 📁",
      content: "Support for PDFs, text files, and images. Our AI extracts text and creates comprehensive questions.",
      icon: "📄"
    },
    {
      title: "Smart Quiz Generation 🧠",
      content: "Get 7-15 questions covering all topics in your material. Questions are randomized for better learning.",
      icon: "⚡"
    },
    {
      title: "Learn from Mistakes 💡",
      content: "When you get an answer wrong, see the correct answer highlighted and detailed explanations.",
      icon: "🎓"
    },
    {
      title: "Track Your Progress 📊",
      content: "View detailed statistics, retake quizzes, and improve your understanding with each attempt.",
      icon: "📈"
    }
  ]

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onClose()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const skipTutorial = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Getting Started</h2>
            <button
              onClick={skipTutorial}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-2">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 flex-1 rounded ${
                    index <= currentStep ? 'bg-white' : 'bg-white bg-opacity-30'
                  }`}
                />
              ))}
            </div>
            <p className="text-purple-100 text-sm mt-2">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">{steps[currentStep].icon}</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              {steps[currentStep].title}
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed">
              {steps[currentStep].content}
            </p>
          </div>

          {/* Features List for Step 1 */}
          {currentStep === 0 && (
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">✨ Key Features</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• AI-powered question generation</li>
                  <li>• Multiple file format support</li>
                  <li>• Comprehensive quiz coverage</li>
                  <li>• Detailed explanations</li>
                </ul>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🚀 Pro Features</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Unlimited quiz generation</li>
                  <li>• Advanced AI question types</li>
                  <li>• Export capabilities</li>
                  <li>• Detailed analytics</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>
            
            <button
              onClick={nextStep}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              {currentStep === steps.length - 1 ? 'Get Started! 🎉' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WelcomeScreen
