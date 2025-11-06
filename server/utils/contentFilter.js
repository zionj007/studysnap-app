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
  filteredText = filteredText.replace(/^\s*(?:chapter|section|part)\s+\d+[.:]\s*[^\n]*(?:\s+\.{3,}\s*\d+)?\s*$/gmi, '');
  filteredText = filteredText.replace(/^\s*\d+[.)]\s+[^\n]*(?:\s+\.{3,}\s*\d+)?\s*$/gmi, '');
  
  // Remove lines that are just numbers or page references (e.g., "... 5" or "... 10")
  filteredText = filteredText.replace(/^\s*\.{2,}\s*\d+\s*$/gmi, '');
  
  // Remove topic-only lines (lines that are just headings without content)
  // This matches lines that are standalone and look like headings
  const lines = filteredText.split('\n');
  const filteredLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const nextLine = i < lines.length - 1 ? lines[i + 1].trim() : '';
    const prevLine = i > 0 ? lines[i - 1].trim() : '';
    
    // Skip empty lines
    if (line.length === 0) {
      filteredLines.push(lines[i]);
      continue;
    }
    
    // Skip table of contents entries (lines with dots leading to page numbers)
    if (line.match(/\.{3,}\s*\d+$/)) {
      continue;
    }
    
    // Skip lines that are just numbers, roman numerals, or single words (likely topic headings)
    // But keep them if they're followed by substantial content
    if (isLikelyTopicHeading(line)) {
      // Check if next line has substantial content (more than 30 characters and not another heading)
      if (nextLine.length > 30 && !isLikelyTopicHeading(nextLine)) {
        // Keep the heading if it's followed by content
        filteredLines.push(lines[i]);
      } else {
        // Check if this is part of a topic list (multiple topic headings in a row)
        // If previous line was also a topic heading, skip this one
        if (isLikelyTopicHeading(prevLine)) {
          continue;
        }
        // If next line is also a topic heading, skip this one (it's a topic list)
        if (isLikelyTopicHeading(nextLine)) {
          continue;
        }
        // Otherwise, it might be a standalone heading - skip it if no content follows
        continue;
      }
      continue;
    }
    
    // Keep all other lines
    filteredLines.push(lines[i]);
  }
  
  filteredText = filteredLines.join('\n');
  
  // Remove excessive whitespace
  filteredText = filteredText.replace(/\n{3,}/g, '\n\n');
  filteredText = filteredText.trim();
  
  return filteredText;
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
  if (line.match(/^(?:[ivxlcdm]+|[0-9]+)[.)]\s+[^\n]{0,50}$/i) && wordCount <= 6) {
    return true;
  }
  
  // Lines that are very short (3 words or less) and don't end with punctuation
  if (wordCount <= 3 && !line.match(/[.!?]$/)) {
    return true;
  }
  
  // Lines that are all caps and short (likely headings)
  if (line === line.toUpperCase() && wordCount <= 5 && line.length < 50) {
    return true;
  }
  
  // Lines that look like topic lists (short lines without punctuation)
  if (wordCount <= 4 && !line.match(/[.!?:]$/) && line.length < 60) {
    // Check if it's not a complete sentence
    if (!line.match(/^(the|a|an|this|that|these|those)\s+/i) || wordCount <= 2) {
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

module.exports = {
  filterContentForQuiz,
  removeTableOfContents,
  isLikelyTopicHeading
};

