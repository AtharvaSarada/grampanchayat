/**
 * Simple TF-IDF based similarity service for RAG
 * This provides a reliable fallback when external embedding APIs are unavailable
 */

/**
 * Create a simple TF-IDF vector for text
 * @param {string} text - Input text
 * @param {string[]} vocabulary - Global vocabulary for consistent dimensions
 * @returns {number[]} - TF-IDF vector
 */
function createTFIDFVector(text, vocabulary) {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2);
  
  const wordCount = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  const totalWords = words.length;
  const vector = new Array(vocabulary.length).fill(0);
  
  vocabulary.forEach((vocabWord, index) => {
    const tf = (wordCount[vocabWord] || 0) / totalWords;
    // Simple TF score (we'll skip IDF for simplicity)
    vector[index] = tf;
  });
  
  return vector;
}

/**
 * Build vocabulary from all service texts
 * @param {string[]} texts - Array of all searchable texts
 * @returns {string[]} - Global vocabulary
 */
function buildVocabulary(texts) {
  const wordSet = new Set();
  
  texts.forEach(text => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);
    
    words.forEach(word => wordSet.add(word));
  });
  
  return Array.from(wordSet).sort();
}

/**
 * Calculate cosine similarity between two vectors
 * @param {number[]} a - First vector
 * @param {number[]} b - Second vector
 * @returns {number} - Cosine similarity score (0-1)
 */
function cosineSimilarity(a, b) {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (normA * normB);
}

/**
 * Generate simple embeddings for texts
 * @param {string|string[]} texts - Text or array of texts
 * @param {string[]} vocabulary - Global vocabulary (optional)
 * @returns {Promise<number[]|number[][]>} - Vector(s)
 */
async function generateSimpleEmbeddings(texts, vocabulary = null) {
  const isArray = Array.isArray(texts);
  const textArray = isArray ? texts : [texts];
  
  // If no vocabulary provided, build it from the input texts
  const vocab = vocabulary || buildVocabulary(textArray);
  
  const embeddings = textArray.map(text => createTFIDFVector(text, vocab));
  
  return isArray ? embeddings : embeddings[0];
}

/**
 * Find most relevant services using simple similarity
 * @param {string} query - User query
 * @param {Object[]} services - Array of services with searchable_text
 * @param {number} topK - Number of top results
 * @param {number} threshold - Minimum similarity threshold
 * @returns {Object[]} - Sorted array of relevant services with similarity scores
 */
function findRelevantServicesSimple(query, services, topK = 3, threshold = 0.1) {
  // Build vocabulary from all service texts + query
  const allTexts = [query, ...services.map(s => s.searchable_text || s.description)];
  const vocabulary = buildVocabulary(allTexts);
  
  // Generate embeddings
  const queryVector = createTFIDFVector(query, vocabulary);
  
  const results = services.map(service => {
    const serviceText = service.searchable_text || service.description || '';
    const serviceVector = createTFIDFVector(serviceText, vocabulary);
    const similarity = cosineSimilarity(queryVector, serviceVector);
    
    return {
      ...service,
      similarity
    };
  })
  .filter(result => result.similarity >= threshold)
  .sort((a, b) => b.similarity - a.similarity)
  .slice(0, topK);

  return results;
}

/**
 * Create searchable text for a service
 * @param {Object} service - Service object
 * @returns {string} - Combined searchable text
 */
function createSearchableText(service) {
  const searchFields = [
    service.service_name,
    service.description,
    service.category,
    service.documents_required?.join(' '),
    service.eligibility
  ];

  return searchFields
    .filter(Boolean)
    .join(' ')
    .toLowerCase();
}

module.exports = {
  generateSimpleEmbeddings,
  findRelevantServicesSimple,
  createSearchableText,
  cosineSimilarity,
  buildVocabulary
};
