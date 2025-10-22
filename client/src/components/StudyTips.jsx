import { useState } from 'react'

const StudyTips = () => {
  const [currentTip, setCurrentTip] = useState(0)
  
  const tips = [
    {
      title: "🎯 Active Recall",
      description: "Test yourself frequently instead of just re-reading. This strengthens memory pathways.",
      detail: "Try to recall information from memory before looking at your notes."
    },
    {
      title: "⏰ Spaced Repetition", 
      description: "Review material at increasing intervals to improve long-term retention.",
      detail: "Review after 1 day, 3 days, 1 week, then 1 month."
    },
    {
      title: "🧠 Elaborative Interrogation",
      description: "Ask 'why' and 'how' questions about the material you're studying.",
      detail: "Instead of memorizing facts, understand the reasoning behind them."
    },
    {
      title: "📝 Practice Testing",
      description: "Take practice quizzes regularly to identify knowledge gaps.",
      detail: "Use StudySnap to create quizzes from your materials!"
    },
    {
      title: "🔗 Interleaving",
      description: "Mix different topics or types of problems during study sessions.",
      detail: "Don't study one topic for hours - switch between related topics."
    },
    {
      title: "💡 Dual Coding",
      description: "Combine verbal and visual information to enhance learning.",
      detail: "Create diagrams, mind maps, or visual representations of concepts."
    }
  ]

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">💡 Study Tips</h3>
        <div className="flex space-x-2">
          <button
            onClick={prevTip}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            ←
          </button>
          <button
            onClick={nextTip}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            →
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-purple-600 mb-2">
          {tips[currentTip].title}
        </h4>
        <p className="text-gray-700 mb-3">
          {tips[currentTip].description}
        </p>
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Pro Tip:</strong> {tips[currentTip].detail}
          </p>
        </div>
      </div>

      <div className="flex justify-center space-x-1">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentTip(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentTip ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

export default StudyTips
