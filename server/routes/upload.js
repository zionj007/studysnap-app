const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');

// Import pdf-parse with error handling
let pdfParse;
try {
  const pdfParseModule = require('pdf-parse');
  pdfParse = pdfParseModule.PDFParse || pdfParseModule.default || pdfParseModule;
} catch (error) {
  console.warn('pdf-parse not available:', error.message);
  pdfParse = null;
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + extension);
  }
});

// File filter to only allow specific file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',           // PDF
    'text/plain',               // TXT
    'image/png',                // PNG
    'image/jpeg',               // JPG/JPEG
    'image/jpg'                 // JPG
  ];
  
  const allowedExtensions = ['.pdf', '.txt', '.png', '.jpg', '.jpeg'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  
  if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, TXT, PNG, JPG files are allowed.'), false);
  }
};

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: fileFilter
});

// Text extraction functions
const extractTextFromTxt = async (filePath) => {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return text.trim();
  } catch (error) {
    throw new Error(`Failed to read text file: ${error.message}`);
  }
};

const extractTextFromPdf = async (filePath) => {
  try {
    if (!pdfParse) {
      console.warn('pdf-parse not available, returning empty text');
      return '';
    }
    
    const dataBuffer = fs.readFileSync(filePath);
    const data = await new pdfParse(dataBuffer);
    return data.text.trim();
  } catch (error) {
    console.error('PDF parsing error:', error);
    // Return empty string instead of throwing error to allow upload to succeed
    return '';
  }
};

const extractTextFromImage = async (filePath) => {
  try {
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m) // Optional: log OCR progress
    });
    return text.trim();
  } catch (error) {
    throw new Error(`Failed to extract text from image: ${error.message}`);
  }
};

const extractTextFromFile = async (filePath, originalName) => {
  const extension = path.extname(originalName).toLowerCase();
  
  switch (extension) {
    case '.txt':
      return await extractTextFromTxt(filePath);
    case '.pdf':
      return await extractTextFromPdf(filePath);
    case '.png':
    case '.jpg':
    case '.jpeg':
      return await extractTextFromImage(filePath);
    default:
      throw new Error(`Unsupported file type for text extraction: ${extension}`);
  }
};

// POST /api/upload endpoint
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    // Check usage limits before processing upload
    const userId = req.body.userId || 'anonymous';
    
    // Import usage tracking functions
    const { canPerformAction, incrementUsage, getUserUsage } = require('../utils/usageTracker');
    
    if (!canPerformAction(userId, 'upload')) {
      const usage = getUserUsage(userId);
      return res.status(403).json({
        success: false,
        message: `Upload limit exceeded. ${usage.plan} plan allows ${usage.plan === 'FREE' ? '2' : 'unlimited'} uploads per week.`,
        upgradeRequired: true,
        currentPlan: usage.plan
      });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Get the file path relative to the server root
    const serverPath = path.join('uploads', req.file.filename);
    const fullFilePath = path.join(__dirname, '..', serverPath);
    
    // Extract text from the uploaded file
    let extractedText = '';
    try {
      extractedText = await extractTextFromFile(fullFilePath, req.file.originalname);
    } catch (extractionError) {
      console.error('Text extraction error:', extractionError);
      // Still return success but with empty text
      extractedText = '';
    }
    
    // Track successful upload
    incrementUsage(userId, 'upload');
    
    // Return success response with extracted text
    res.json({
      success: true,
      path: serverPath,
      originalName: req.file.originalname,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype,
      text: extractedText
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Upload failed'
    });
  }
});

// Error handling middleware for multer errors
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected field name. Use "file" as the field name.'
      });
    }
  }
  
  // Handle file filter errors
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  res.status(500).json({
    success: false,
    message: error.message || 'Server error'
  });
});

module.exports = router;
