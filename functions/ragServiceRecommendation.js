const admin = require('firebase-admin');
const functions = require('firebase-functions');
// OLD: Replaced with Gemini Pro intelligent chat
// const { generateEmbeddings, findRelevantServices } = require('./embeddingService');

/**
 * Generate contextual response using RAG context
 * @param {string} query - User query
 * @param {Object[]} relevantServices - Retrieved services from RAG
 * @returns {Promise<Object>} - Structured JSON response
 */
async function generateContextualResponse(query, relevantServices) {
  // If no relevant services found, return off-topic response
  if (!relevantServices || relevantServices.length === 0) {
    return {
      error: true,
      message: "I can only answer questions about Gram Panchayat services. Please ask something related to our available services like birth certificates, water connections, trade licenses, etc."
    };
  }

  // Take the most relevant service (highest similarity)
  const topService = relevantServices[0];
  
  // If similarity is too low, it's likely off-topic
  if (topService.similarity < 0.35) {
    return {
      error: true,
      message: "I can only answer questions about Gram Panchayat services. Please ask something related to our available services like birth certificates, water connections, trade licenses, etc."
    };
  }

  // Return structured service data
  return {
    service_name: topService.service_name,
    description: topService.description,
    documents_required: topService.documents_required,
    eligibility: topService.eligibility,
    application_link: topService.application_link,
    processing_time: topService.processing_time,
    fee: topService.fee,
    category: topService.category
  };
}

/**
 * DEPRECATED: Old RAG function - now redirects to Gemini Pro intelligent chat
 * This function is kept for backward compatibility but now uses the new system
 */
exports.ragServiceRecommendation = async (req, res) => {
  // Import the new Gemini service
  const { intelligentChat } = require('./geminiIntelligentChat');
  
  console.log('RAG endpoint called - redirecting to Gemini Pro intelligent chat');
  
  // Forward the request to the new Gemini Pro system
  return intelligentChat(req, res);
};
