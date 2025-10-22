# 📸 StudySnap - AI Study Assistant

![StudySnap Logo](https://img.shields.io/badge/StudySnap-AI%20Study%20Assistant-purple?style=for-the-badge&logo=book)

A modern, AI-powered study assistant that transforms your study materials into interactive quizzes. Upload PDFs, text files, or images, and get comprehensive multiple-choice questions covering all topics in your material.

## ✨ Features

- **📁 Multi-Format Support**: Upload PDFs, TXT files, PNG, JPG images
- **🧠 AI-Powered Quiz Generation**: Uses OpenAI API for intelligent question creation
- **🔄 Smart Fallback**: Automatically uses local generator when OpenAI quota is exceeded
- **📊 Progress Tracking**: Detailed statistics and performance analytics
- **💡 Study Tips**: Evidence-based learning techniques and tips
- **🎯 Comprehensive Coverage**: 7-15 questions covering all topics in your material
- **🎨 Modern UI**: Beautiful, responsive design with Tailwind CSS
- **👑 Pro Features**: Upgrade system with unlimited quizzes and advanced features

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key (optional - app works with local fallback)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/zionj007/studysnapapp.git
   cd studysnapapp
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   ```bash
   # Copy the example environment file
   cp server/env.example server/.env
   
   # Edit server/.env and add your OpenAI API key
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

## 📁 Project Structure

```
studysnapapp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── UploadBox.jsx
│   │   │   ├── QuestionGenerator.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── QuizStats.jsx
│   │   │   ├── StudyTips.jsx
│   │   │   ├── FilePreview.jsx
│   │   │   ├── LoadingAnimation.jsx
│   │   │   ├── WelcomeScreen.jsx
│   │   │   └── ProUpgrade.jsx
│   │   ├── contexts/      # React Context for state management
│   │   └── App.jsx        # Main app component
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   │   ├── upload.js      # File upload & text extraction
│   │   ├── quiz.js        # Local quiz generation
│   │   └── openaiQuiz.js  # OpenAI-powered generation
│   ├── utils/             # Utility functions
│   │   ├── textChunker.js # Text splitting logic
│   │   └── quizGenerator.js # Local question generation
│   └── server.js          # Express server
└── package.json           # Root package config
```

## 🔧 Available Scripts

- `npm run dev` - Start both client and server in development mode
- `npm run dev:client` - Start only the React frontend
- `npm run dev:server` - Start only the Node.js backend
- `npm run build` - Build the React app for production
- `npm run install:all` - Install dependencies for both client and server

## 🌐 Deployment

### Frontend (Vercel)
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `client`
4. Add Environment Variable: `VITE_API_URL` = your backend URL
5. Deploy!

### Backend (Render/Railway)
1. Go to [render.com](https://render.com) or [railway.app](https://railway.app)
2. Import your GitHub repository
3. Set **Root Directory** to `server`
4. Add Environment Variables:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `NODE_ENV` = `production`
   - `CORS_ORIGIN` = your frontend URL
5. Deploy!

## 🔑 Environment Variables

### Frontend
- `VITE_API_URL` - Backend API URL

### Backend
- `OPENAI_API_KEY` - OpenAI API key (optional)
- `NODE_ENV` - Environment (development/production)
- `CORS_ORIGIN` - Frontend URL for CORS
- `PORT` - Server port (default: 3001)

## 🎯 How It Works

1. **Upload**: Users upload study materials (PDF, TXT, images)
2. **Extract**: AI extracts text from uploaded files
3. **Generate**: Creates comprehensive quiz questions covering all topics
4. **Quiz**: Interactive quiz with detailed explanations
5. **Track**: Progress tracking and performance analytics

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **AI**: OpenAI API (with local fallback)
- **File Processing**: pdf-parse, tesseract.js
- **Deployment**: Vercel, Render, Railway

## 📊 Features in Detail

### Quiz Generation
- **OpenAI Integration**: Uses GPT-3.5-turbo for intelligent question creation
- **Local Fallback**: Sophisticated local generator when OpenAI is unavailable
- **Comprehensive Coverage**: Questions cover all major topics and concepts
- **Randomized Answers**: Prevents pattern recognition in answer choices

### User Experience
- **Welcome Screen**: Interactive tutorial for new users
- **Study Tips**: Evidence-based learning techniques
- **Progress Tracking**: Detailed statistics and performance metrics
- **Pro Features**: Upgrade system with unlimited quizzes

### File Support
- **PDF**: Text extraction using pdf-parse
- **Images**: OCR using tesseract.js
- **Text Files**: Direct text processing
- **Multiple Formats**: PNG, JPG, TXT, PDF support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenAI for providing the AI API
- React and Vite teams for the amazing frontend tools
- Express.js for the robust backend framework
- Tailwind CSS for the beautiful styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/zionj007/studysnapapp/issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Made with ❤️ for students everywhere. Happy studying! 📚✨**