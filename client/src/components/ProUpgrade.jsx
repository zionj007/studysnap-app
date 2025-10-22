import { useState } from 'react'

const ProUpgrade = ({ onClose, onUpgrade }) => {
  const [selectedPlan, setSelectedPlan] = useState('monthly')

  const plans = {
    monthly: {
      name: 'Pro Monthly',
      price: '$9.99',
      period: 'per month',
      features: [
        'Unlimited quiz generations',
        'Advanced AI question types',
        'Priority OpenAI API access',
        'Export quizzes to PDF',
        'Detailed analytics',
        'Custom quiz themes',
        'Bulk file processing',
        'API access for developers'
      ]
    },
    yearly: {
      name: 'Pro Yearly',
      price: '$99.99',
      period: 'per year',
      savings: 'Save 17%',
      features: [
        'Everything in Pro Monthly',
        'Advanced study analytics',
        'Custom question templates',
        'Team collaboration features',
        'Priority support',
        'Early access to new features',
        'White-label options',
        'Advanced integrations'
      ]
    }
  }

  const currentPlan = plans[selectedPlan]

  const handleUpgrade = () => {
    // In a real app, this would integrate with Stripe
    console.log(`Upgrading to ${currentPlan.name}`)
    onUpgrade(selectedPlan)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-2xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">🚀 Upgrade to StudySnap Pro</h2>
              <p className="text-purple-100 text-lg">
                Unlock unlimited potential with advanced AI-powered study features
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-purple-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Monthly Plan */}
            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${
                selectedPlan === 'monthly' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedPlan('monthly')}
            >
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pro Monthly</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">$9.99</div>
                <p className="text-gray-500">per month</p>
                {selectedPlan === 'monthly' && (
                  <div className="mt-3">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Yearly Plan */}
            <div 
              className={`border-2 rounded-xl p-6 cursor-pointer transition-all relative ${
                selectedPlan === 'yearly' 
                  ? 'border-purple-500 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => setSelectedPlan('yearly')}
            >
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Save 17%
                </span>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Pro Yearly</h3>
                <div className="text-3xl font-bold text-purple-600 mb-1">$99.99</div>
                <p className="text-gray-500">per year</p>
                {selectedPlan === 'yearly' && (
                  <div className="mt-3">
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Selected
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              What's included in {currentPlan.name}:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Free vs Pro Comparison</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Feature</th>
                    <th className="text-center py-2">Free</th>
                    <th className="text-center py-2">Pro</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <tr className="border-b">
                    <td className="py-2">Quiz generations per day</td>
                    <td className="text-center py-2">3</td>
                    <td className="text-center py-2 text-green-600 font-semibold">Unlimited</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Question types</td>
                    <td className="text-center py-2">Basic</td>
                    <td className="text-center py-2 text-green-600 font-semibold">Advanced AI</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">File size limit</td>
                    <td className="text-center py-2">5MB</td>
                    <td className="text-center py-2 text-green-600 font-semibold">50MB</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Export options</td>
                    <td className="text-center py-2">None</td>
                    <td className="text-center py-2 text-green-600 font-semibold">PDF, CSV</td>
                  </tr>
                  <tr>
                    <td className="py-2">Analytics</td>
                    <td className="text-center py-2">Basic</td>
                    <td className="text-center py-2 text-green-600 font-semibold">Advanced</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleUpgrade}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-4 px-8 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105"
            >
              Upgrade to {currentPlan.name} - {currentPlan.price}/{currentPlan.period}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Maybe Later
            </button>
          </div>

          {/* Trust indicators */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>🔒 Secure payment powered by Stripe</p>
            <p>💳 Cancel anytime • 30-day money-back guarantee</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProUpgrade
