/**
 * Chunks text into smaller pieces without breaking sentences when possible
 * @param {string} text - The text to chunk
 * @param {number} maxWords - Maximum words per chunk (default: 700)
 * @returns {Array} Array of chunk objects with id, chunkText, and wordCount
 */
function chunkText(text, maxWords = 700) {
  if (!text || typeof text !== 'string') {
    return [];
  }

  // Clean and normalize the text
  const cleanText = text.trim().replace(/\s+/g, ' ');
  
  if (cleanText.length === 0) {
    return [];
  }

  // Split text into sentences using common sentence endings
  const sentences = cleanText.split(/(?<=[.!?])\s+/).filter(sentence => sentence.trim().length > 0);
  
  const chunks = [];
  let currentChunk = '';
  let currentWordCount = 0;
  let chunkId = 1;

  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i].trim();
    const sentenceWordCount = sentence.split(/\s+/).length;
    
    // If adding this sentence would exceed maxWords, finalize current chunk
    if (currentWordCount + sentenceWordCount > maxWords && currentChunk.length > 0) {
      chunks.push({
        id: chunkId++,
        chunkText: currentChunk.trim(),
        wordCount: currentWordCount
      });
      
      currentChunk = sentence;
      currentWordCount = sentenceWordCount;
    } else {
      // Add sentence to current chunk
      if (currentChunk.length > 0) {
        currentChunk += ' ' + sentence;
      } else {
        currentChunk = sentence;
      }
      currentWordCount += sentenceWordCount;
    }
  }

  // Add the last chunk if it has content
  if (currentChunk.length > 0) {
    chunks.push({
      id: chunkId,
      chunkText: currentChunk.trim(),
      wordCount: currentWordCount
    });
  }

  // Handle edge case: if a single sentence exceeds maxWords, split by words
  const finalChunks = [];
  for (const chunk of chunks) {
    if (chunk.wordCount <= maxWords) {
      finalChunks.push(chunk);
    } else {
      // Split oversized chunk by words
      const words = chunk.chunkText.split(/\s+/);
      let wordChunk = '';
      let wordChunkCount = 0;
      let wordChunkId = chunk.id;

      for (const word of words) {
        if (wordChunkCount + 1 > maxWords && wordChunk.length > 0) {
          finalChunks.push({
            id: wordChunkId++,
            chunkText: wordChunk.trim(),
            wordCount: wordChunkCount
          });
          wordChunk = word;
          wordChunkCount = 1;
        } else {
          if (wordChunk.length > 0) {
            wordChunk += ' ' + word;
          } else {
            wordChunk = word;
          }
          wordChunkCount++;
        }
      }

      // Add the last word chunk
      if (wordChunk.length > 0) {
        finalChunks.push({
          id: wordChunkId,
          chunkText: wordChunk.trim(),
          wordCount: wordChunkCount
        });
      }
    }
  }

  return finalChunks;
}

module.exports = chunkText;
