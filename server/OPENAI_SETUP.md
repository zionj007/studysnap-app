# OpenAI API Configuration Guide

## Setting up OpenAI API Key

1. **Get your OpenAI API key:**
   - Go to https://platform.openai.com/api-keys
   - Sign in or create an account
   - Click "Create new secret key"
   - Copy the generated key (starts with `sk-`)

2. **Set environment variable:**
   
   **Option A: Create .env file in server directory**
   ```bash
   # Create .env file
   echo "OPENAI_API_KEY=your_actual_api_key_here" > server/.env
   ```
   
   **Option B: Set system environment variable**
   ```bash
   # Windows PowerShell
   $env:OPENAI_API_KEY="your_actual_api_key_here"
   
   # Windows Command Prompt
   set OPENAI_API_KEY=your_actual_api_key_here
   
   # Linux/Mac
   export OPENAI_API_KEY="your_actual_api_key_here"
   ```

3. **Verify configuration:**
   ```bash
   # Test the endpoint
   curl -X POST http://localhost:3001/api/generate-questions \
     -H "Content-Type: application/json" \
     -d '{"chunk": "Artificial intelligence is intelligence demonstrated by machines."}'
   ```

## API Usage

The `/api/generate-questions` endpoint accepts:
```json
{
  "chunk": "Your text content here..."
}
```

And returns:
```json
{
  "success": true,
  "questions": [
    {
      "id": 1,
      "question": "What is artificial intelligence?",
      "options": ["Intelligence by machines", "Human intelligence", "Animal intelligence", "Natural intelligence"],
      "answer_index": 0,
      "rationale": "The passage defines AI as intelligence demonstrated by machines."
    }
  ],
  "totalQuestions": 5,
  "source": "openai"
}
```

## Error Handling

- **401**: Invalid API key
- **402**: Quota exceeded
- **400**: Missing or invalid chunk text
- **500**: Server error or OpenAI API error



