const admin = require('firebase-admin');
const { findRelevantServicesSimple } = require('./simpleEmbeddingService');

/**
 * Generate contextual response using simple similarity matching
 * @param {string} query - User query
 * @param {Object[]} relevantServices - Retrieved services from simple RAG
 * @returns {Promise<Object>} - Structured JSON response
 */
async function generateSimpleResponse(query, relevantServices) {
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
  if (topService.similarity < 0.15) {
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
 * Main simple RAG-powered service recommendation function
 */
exports.simpleRagRecommendation = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: true,
        message: 'Please provide a question about the service you need.'
      });
    }

    const cleanQuery = query.trim();
    console.log('Processing simple RAG query:', cleanQuery);

    // Step 1: Get all services from Firestore
    const db = admin.firestore();
    const servicesCollection = db.collection('services');
    const snapshot = await servicesCollection.get();
    
    const services = [];
    snapshot.forEach(doc => {
      services.push(doc.data());
    });

    if (services.length === 0) {
      return res.status(500).json({
        error: true,
        message: 'Services database is not properly configured. Please contact support.'
      });
    }

    console.log(`Found ${services.length} services`);

    // Step 2: Find most relevant services using TF-IDF similarity
    const relevantServices = findRelevantServicesSimple(cleanQuery, services, 3, 0.01);
    console.log(`Found ${relevantServices.length} relevant services:`, 
      relevantServices.map(s => ({ name: s.service_name, similarity: s.similarity.toFixed(3) })));

    // Step 3: Generate contextual response
    const response = await generateSimpleResponse(cleanQuery, relevantServices);

    // Step 4: Log query for analytics
    await db.collection('chatbot_queries').add({
      query: cleanQuery,
      recommended_service: response.service_name || null,
      similarity_score: relevantServices.length > 0 ? relevantServices[0].similarity : 0,
      method: 'simple_rag_tfidf',
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      relevant_services_count: relevantServices.length
    });

    // Step 5: Return structured response
    if (response.error) {
      res.json({
        success: false,
        error: true,
        message: response.message,
        query: cleanQuery
      });
    } else {
      res.json({
        success: true,
        query: cleanQuery,
        recommendation: response,
        similarity_score: relevantServices[0]?.similarity || 0,
        method: 'simple_rag_tfidf'
      });
    }

  } catch (error) {
    console.error('Simple RAG service recommendation error:', error);
    
    // Log error query for debugging
    try {
      await admin.firestore().collection('chatbot_errors').add({
        query: req.body.query,
        error: error.message,
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
    res.status(500).json({
      success: false,
      error: true,
      message: 'I\'m having trouble processing your request right now. Please try again in a moment.',
      details: error.message
    });
  }
};
