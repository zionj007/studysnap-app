# StudySnap Setup Guide

## 🚀 Quick Start (No API Key Required)

Your StudySnap app is ready to use! The app will automatically use a local quiz generator when OpenAI API key is not configured.

### Option 1: Use Without OpenAI API Key (Recommended for Testing)

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Access StudySnap:**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001

3. **Upload and test:**
   - Upload any PDF or text file
   - Generate quiz questions (will use local generator)
   - Take the quiz!

### Option 2: Add OpenAI API Key for Enhanced Questions

1. **Get OpenAI API Key:**
   - Visit: https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-`)

2. **Configure the API Key:**
   - Open `server/.env` file
   - Replace `your_openai_api_key_here` with your actual API key:
   ```
   OPENAI_API_KEY=sk-your_actual_api_key_here
   ```

3. **Restart the server:**
   ```bash
   # Stop current server (Ctrl+C)
   cd server
   node server.js
   ```

## 🎯 Features Available

### With Local Generator (No API Key):
- ✅ File upload (PDF, TXT, PNG, JPG)
- ✅ Text extraction
- ✅ 5-20 locally generated questions
- ✅ Complete quiz experience
- ✅ Progress tracking

### With OpenAI API Key:
- ✅ All local features PLUS
- ✅ Dynamic question count (5-25 questions)
- ✅ More sophisticated questions
- ✅ Better topic coverage
- ✅ Enhanced explanations

## 🧪 Test Your Setup

1. **Create a test file:**
   ```bash
   echo "Artificial intelligence is a branch of computer science that aims to create machines capable of intelligent behavior. Machine learning is a subset of AI that enables computers to learn and improve from experience without being explicitly programmed. Deep learning uses neural networks with multiple layers to process data and make decisions." > test.txt
   ```

2. **Upload the file in StudySnap**
3. **Generate quiz questions**
4. **Take the quiz!**

## 🔧 Troubleshooting

### If you get "OpenAI API key not configured":
- This is normal! The app will automatically use the local generator
- You can still generate and take quizzes

### If questions aren't generating:
- Check that the server is running on port 3001
- Verify your text file has content
- Check the browser console for errors

### If PDF upload isn't working:
- Make sure the PDF file isn't corrupted
- Try with a simple text file first
- Check server logs for PDF parsing errors

## 📚 Next Steps

1. **Test with your own study materials**
2. **Add OpenAI API key for enhanced questions** (optional)
3. **Customize the quiz generation** (advanced)
4. **Deploy to production** (when ready)

---

**StudySnap is ready to help you study! 📸✨**



