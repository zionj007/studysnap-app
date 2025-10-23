import { useState, useEffect } from 'react'
import FilePreview from './FilePreview'
import LoadingAnimation from './LoadingAnimation'

const UploadBox = ({ onUploadSuccess, onUpgradeClick }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [error, setError] = useState(null)
  const [usage, setUsage] = useState(null)
  const [userId] = useState(() => localStorage.getItem('studysnap_userId') || `user_${Date.now()}`)

  // Fetch usage on component mount
  useEffect(() => {
    fetchUsage()
  }, [])

  const fetchUsage = async () => {
    try {
      const getApiUrl = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        }
        return 'https://studysnap-app.onrender.com'
      }

      const response = await fetch(`${getApiUrl()}/api/usage?userId=${userId}`)
      const data = await response.json()
      
      if (data.success) {
        setUsage(data.usage)
      }
    } catch (error) {
      console.error('Failed to fetch usage:', error)
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file type
      const allowedTypes = ['application/pdf', 'text/plain', 'image/png', 'image/jpeg']
      const allowedExtensions = ['.pdf', '.txt', '.png', '.jpg', '.jpeg']
      
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase()
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension)) {
        setError('Please select a valid file type (.pdf, .txt, .png, .jpg)')
        setSelectedFile(null)
        return
      }
      
      setSelectedFile(file)
      setError(null)
      setUploadResult(null)
    }
  }

  const handleSubmit = async () => {
    if (!selectedFile) {
      setError('Please select a file first')
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('userId', userId) // Add userId for usage tracking

      // Smart API URL detection
      const getApiUrl = () => {
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
          return 'http://localhost:3001'
        }
        // For production, use the deployed backend URL
        return 'https://studysnap-app.onrender.com'
      }

      const response = await fetch(`${getApiUrl()}/api/upload`, {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        setUploadResult(result)
        setSelectedFile(null)
        // Reset file input
        const fileInput = document.getElementById('file-input')
        if (fileInput) fileInput.value = ''
        
        // Refresh usage after successful upload
        await fetchUsage()
        
        // Notify parent component
        onUploadSuccess(result)
      } else {
        // Handle usage limit errors
        if (result.upgradeRequired) {
          setError(result.message)
          if (onUpgradeClick) {
            onUpgradeClick()
          }
        } else {
          setError(result.message || 'Upload failed')
        }
      }
    } catch (err) {
      setError('Network error: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        📁 Upload Study Material
      </h2>

      {/* Usage Display */}
      {usage && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <span className="font-medium text-blue-800">
                {usage.plan === 'FREE' ? '🆓 Free Plan' : '⭐ Pro Plan'}
              </span>
            </div>
            <div className="text-blue-600">
              <div>Uploads: {usage.uploads}/{usage.limits.uploadsPerWeek === -1 ? '∞' : usage.limits.uploadsPerWeek}</div>
              <div>Generations: {usage.generations}/{usage.limits.generationsPerWeek === -1 ? '∞' : usage.limits.generationsPerWeek}</div>
            </div>
          </div>
          {usage.plan === 'FREE' && !usage.canUpload && (
            <div className="mt-2 text-xs text-orange-600">
              ⚠️ Upload limit reached. Upgrade to Pro for unlimited uploads!
            </div>
          )}
        </div>
      )}

      {/* File Input Area */}
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center cursor-pointer hover:border-gray-400 transition-colors touch-manipulation"
        onClick={() => document.getElementById('file-input').click()}
      >
        <input
          type="file"
          id="file-input"
          className="hidden"
          onChange={handleFileChange}
          accept=".pdf,.txt,.png,.jpg,.jpeg"
          capture="environment"
        />
        <div className="text-3xl sm:text-4xl mb-2">📄</div>
        <p className="text-gray-500 text-sm sm:text-base">Tap to upload files</p>
        <p className="text-xs text-gray-400 mt-1">
          Supported: PDF, TXT, PNG, JPG (Max 10MB)
        </p>
        <p className="text-xs text-blue-500 mt-2">
          📱 Mobile: Tap to take photo or select from gallery
        </p>
      </div>

      {/* Selected File Preview */}
      {selectedFile && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">
              {selectedFile.name}
            </span>
            <span className="text-xs text-gray-500">
              ({formatFileSize(selectedFile.size)})
            </span>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              !isUploading
                ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isUploading ? 'Uploading...' : 'Upload File'}
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {uploadResult && (
        <div className="mt-4 space-y-3">
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-600 font-medium">✅ Upload successful!</p>
            <p className="text-xs text-green-500 mt-1">
              File: {uploadResult.originalName}
            </p>
          </div>
          
          {/* Extracted Text Display */}
          {uploadResult.text && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-sm font-medium text-blue-800 mb-2">📝 Extracted Text:</h3>
              <div className="max-h-32 overflow-y-auto">
                <p className="text-xs text-blue-700 whitespace-pre-wrap">
                  {uploadResult.text.substring(0, 300)}
                  {uploadResult.text.length > 300 && '...'}
                </p>
              </div>
            </div>
          )}
          
          {!uploadResult.text && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-600">
                ⚠️ No text could be extracted from this file.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UploadBox