import { useState } from 'react'

const FilePreview = ({ file, extractedText }) => {
  const [showPreview, setShowPreview] = useState(false)
  
  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    switch (ext) {
      case 'pdf': return '📄'
      case 'txt': return '📝'
      case 'png':
      case 'jpg':
      case 'jpeg': return '🖼️'
      default: return '📁'
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getWordCount = (text) => {
    return text ? text.split(/\s+/).filter(Boolean).length : 0
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getFileIcon(file.name)}</span>
          <div>
            <h4 className="font-semibold text-gray-800">{file.name}</h4>
            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="px-3 py-1 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors text-sm"
        >
          {showPreview ? 'Hide' : 'Preview'}
        </button>
      </div>

      {showPreview && extractedText && (
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <h5 className="font-medium text-gray-700">Extracted Text Preview</h5>
            <span className="text-sm text-gray-500">{getWordCount(extractedText)} words</span>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg max-h-32 overflow-y-auto">
            <p className="text-sm text-gray-700 leading-relaxed">
              {extractedText.substring(0, 300)}
              {extractedText.length > 300 && '...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FilePreview
