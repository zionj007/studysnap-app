/**
 * Filters out table of contents, topic headings, and structural elements
 * that should not be used for quiz generation
 * @param {string} text - The text to filter
 * @returns {string} Filtered text with only substantive content
 */
function filterContentForQuiz(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  // First, remove table of contents sections
  let filteredText = removeTableOfContents(text);

  // Remove table of contents patterns more aggressively
  // Matches patterns like "1. Topic Name ... 5" or "Chapter 1: Title ... 10"
  filteredText = filteredText.replace(/^(?:table\s+of\s+contents?|contents?|toc)\s*:?\s*$/gmi, '');
  
  // Remove ALL chapter/section/part patterns (even without page numbers)
  filteredText = filteredText.replace(/^\s*(?:chapter|section|part|unit|module)\s+\d+[.:\s]*[^\n]*$/gmi, '');
  filteredText = filteredText.replace(/^\s*(?:chapter|section|part|unit|module)\s+[ivxlcdm]+[.:\s]*[^\n]*$/gmi, '');
  
  // Remove numbered lists that look like TOC (e.g., "1. Topic Name" or "1) Topic Name")
  filteredText = filteredText.replace(/^\s*\d+[.)]\s+[^\n]{0,60}(?:\s+\.{2,}\s*\d+)?\s*$/gm, '');
  
  // Remove roman numeral lists that look like TOC
  filteredText = filteredText.replace(/^\s*[ivxlcdm]+[.)]\s+[^\n]{0,60}(?:\s+\.{2,}\s*\d+)?\s*$/gmi, '');
  
  // Remove lines that are just numbers or page references (e.g., "... 5" or "... 10")
  filteredText = filteredText.replace(/^\s*\.{2,}\s*\d+\s*$/gmi, '');
  
  // Remove topic-only lines (lines that are just headings without content)
  // This matches lines that are standalone and look like headings
  const lines = filteredText.split('\n');
  const filteredLines = [];
  let consecutiveHeadings = 0;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    const nextNextLine = i < lines.length - 2 ? lines[i + 2].trim() : '';
    
    // Skip empty lines
    if (line.length === 0) {
      consecutiveHeadings = 0;
      filteredLines.push(lines[i]);
      continue;
    }
    
    // Skip table of contents entries (lines with dots leading to page numbers)
    if (line.match(/\.{3,}\s*\d+$/)) {
      consecutiveHeadings++;
      continue;
    }
    
    // Skip lines that match chapter/section patterns
    if (line.match(/^(?:chapter|section|part|unit|module)\s+\d+/i)) {
      consecutiveHeadings++;
      continue;
    }
    
    // Skip numbered topic lists (e.g., "1. Topic", "2. Topic")
    if (line.match(/^\s*\d+[.)]\s+[^\n]{0,60}$/) && wordCount(line) <= 8) {
      consecutiveHeadings++;
      continue;
    }
    
    // Skip lines that are just numbers, roman numerals, or single words (likely topic headings)
    if (isLikelyTopicHeading(line)) {
      consecutiveHeadings++;
      
      // If we have multiple consecutive headings, this is likely a topic list - skip all
      if (consecutiveHeadings >= 2 || isLikelyTopicHeading(nextLine)) {
        continue;
      }
      
      // Check if next line has substantial content (more than 50 characters and not another heading)
      if (nextLine.length > 50 && !isLikelyTopicHeading(nextLine) && !isLikelyTopicHeading(nextNextLine)) {
        // Keep the heading if it's followed by substantial content
        consecutiveHeadings = 0;
        filteredLines.push(lines[i]);
      } else {
        // Skip standalone headings without content
        continue;
      }
      continue;
    }
    
    // Reset consecutive headings counter when we find real content
    consecutiveHeadings = 0;
    
    // Keep all other lines
    filteredLines.push(lines[i]);
  }
  
  filteredText = filteredLines.join('\n');
  
  // Remove excessive whitespace
  filteredText = filteredText.replace(/\n{3,}/g, '\n\n');
  filteredText = filteredText.trim();
  
  // Final pass: Remove any remaining TOC-like patterns
  filteredText = filteredText.replace(/^\s*\d+[.)]\s+[^\n]{0,50}\s*$/gm, '');
  filteredText = filteredText.replace(/^\s*[ivxlcdm]+[.)]\s+[^\n]{0,50}\s*$/gmi, '');
  
  return filteredText;
}

/**
 * Helper function to count words in a line
 */
function wordCount(line) {
  return line.split(/\s+/).filter(w => w.length > 0).length;
}

/**
 * Checks if a line is likely a topic heading (not substantive content)
 * @param {string} line - The line to check
 * @returns {boolean} True if likely a topic heading
 */
function isLikelyTopicHeading(line) {
  // Lines that are very short (less than 5 words) and don't end with punctuation
  const wordCount = line.split(/\s+/).filter(w => w.length > 0).length;
  
  // Lines that are just numbers or roman numerals
  if (line.match(/^(?:[ivxlcdm]+|[0-9]+)[.)]?\s*$/i)) {
    return true;
  }
  
  // Lines that start with numbers/roman numerals followed by a topic (e.g., "1. Topic Name")
  if (line.match(/^(?:[ivxlcdm]+|[0-9]+)[.)]\s+[^\n]{0,60}$/i) && wordCount <= 8) {
    return true;
  }
  
  // Lines that match chapter/section patterns
  if (line.match(/^(?:chapter|section|part|unit|module)\s+\d+/i)) {
    return true;
  }
  
  // Lines that are very short (4 words or less) and don't end with punctuation
  if (wordCount <= 4 && !line.match(/[.!?]$/)) {
    // But allow if it's a complete sentence starting with common words
    if (!line.match(/^(the|a|an|this|that|these|those|what|how|why|when|where|who)\s+/i)) {
      return true;
    }
  }
  
  // Lines that are all caps and short (likely headings)
  if (line === line.toUpperCase() && wordCount <= 6 && line.length < 60) {
    return true;
  }
  
  // Lines that look like topic lists (short lines without punctuation)
  if (wordCount <= 5 && !line.match(/[.!?:]$/) && line.length < 70) {
    // Check if it's not a complete sentence
    if (!line.match(/^(the|a|an|this|that|these|those|what|how|why|when|where|who|in|on|at|for|with|by)\s+/i) || wordCount <= 3) {
      return true;
    }
  }
  
  // Lines that are just topic names (no verbs, no complete thoughts)
  if (wordCount <= 6 && !line.match(/\b(is|are|was|were|has|have|had|do|does|did|can|could|will|would|should|may|might)\b/i)) {
    if (!line.match(/[.!?]$/) && line.length < 80) {
      return true;
    }
  }
  
  return false;
}

/**
 * Removes table of contents sections from text
 * @param {string} text - The text to process
 * @returns {string} Text with table of contents removed
 */
function removeTableOfContents(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  let cleanedText = text;
  
  // Pattern to match "Table of Contents" or "Contents" section
  const tocPatterns = [
    /^table\s+of\s+contents?[:\s]*$/gmi,
    /^contents?[:\s]*$/gmi,
    /^toc[:\s]*$/gmi
  ];
  
  // Find and remove TOC sections
  const lines = cleanedText.split('\n');
  const filteredLines = [];
  let inTOCSection = false;
  let tocEnded = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if this line starts a TOC section
    if (!tocEnded && tocPatterns.some(pattern => pattern.test(line))) {
      inTOCSection = true;
      continue; // Skip the TOC header
    }
    
    // If we're in a TOC section, check for TOC entry patterns
    if (inTOCSection) {
      // TOC entries typically have: "1. Title ... 5" or "Chapter 1 ... 10"
      const isTOCEntry = line.match(/^\s*(?:chapter|section|part)?\s*\d+[.)]?\s+[^\n]*(?:\.{3,}\s*\d+)?\s*$/i) ||
                        line.match(/^\s*\d+[.)]\s+[^\n]*(?:\.{3,}\s*\d+)?\s*$/) ||
                        line.match(/^\.{2,}\s*\d+\s*$/);
      
      if (isTOCEntry) {
        continue; // Skip TOC entries
      }
      
      // If we hit a line that's not a TOC entry and has substantial content, TOC section ended
      if (line.length > 30 && !line.match(/^\.{2,}\s*\d+$/)) {
        inTOCSection = false;
        tocEnded = true;
        filteredLines.push(lines[i]);
      }
    } else {
      // Not in TOC section, keep the line
      filteredLines.push(lines[i]);
    }
  }
  
  return filteredLines.join('\n');
}

/**
 * Validates if a question is about topics, TOC, or chapters (should be rejected)
 * @param {Object} question - The question object to validate
 * @returns {boolean} True if question should be rejected (is about topic/TOC)
 */
function isQuestionAboutTopicOrTOC(question) {
  if (!question || !question.question) {
    return false;
  }
  
  const questionText = question.question.toLowerCase();
  const rationale = (question.rationale || '').toLowerCase();
  const combinedText = questionText + ' ' + rationale;
  
  // Check if question mentions table of contents
  if (combinedText.match(/\b(table\s+of\s+contents?|contents?|toc)\b/)) {
    return true;
  }
  
  // Check if question is asking about chapter/section numbers
  if (combinedText.match(/\b(chapter|section|part|unit|module)\s+\d+\b/)) {
    return true;
  }
  
  // Check if question is asking "what is chapter X" or "what is topic X"
  if (questionText.match(/\b(what\s+is|what\s+are|which\s+is|which\s+are)\s+(chapter|section|part|topic|heading)\b/)) {
    return true;
  }
  
  // Check if question is asking about topic names without context
  if (questionText.match(/\b(what\s+is|what\s+are|which\s+is|which\s+are|name|list)\s+[^?]{0,30}\?$/)) {
    // If it's a very short question asking "what is X?" where X is likely a topic name
    const questionWords = questionText.split(/\s+/).length;
    if (questionWords <= 8) {
      // Check if it's asking about a topic name (not a concept)
      if (!questionText.match(/\b(concept|idea|principle|theory|process|method|technique|approach|definition|meaning)\b/)) {
        return true;
      }
    }
  }
  
  // Check if question is just asking to identify a topic from a list
  if (questionText.match(/\b(which\s+of\s+the\s+following|identify|select)\s+[^?]{0,30}(topic|chapter|section|heading)\b/)) {
    return true;
  }
  
  return false;
}

/**
 * Filters out questions that are about topics, TOC, or chapters
 * @param {Array} questions - Array of question objects
 * @returns {Array} Filtered array with only substantive questions
 */
function filterQuestionsAboutTopics(questions) {
  if (!Array.isArray(questions)) {
    return [];
  }
  
  return questions.filter(question => {
    return !isQuestionAboutTopicOrTOC(question);
  });
}

module.exports = {
  filterContentForQuiz,
  removeTableOfContents,
  isLikelyTopicHeading,
  isQuestionAboutTopicOrTOC,
  filterQuestionsAboutTopics
};

