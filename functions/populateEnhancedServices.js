const admin = require('firebase-admin');
const { enhancedServicesData } = require('./enhancedServicesData');
// OLD: Embedding service removed - now using Gemini Pro intelligent chat
// const { generateEmbeddings, createSearchableText } = require('./embeddingService');

/**
 * Populate Firestore with enhanced services including embeddings
 */
exports.populateEnhancedServices = async (req, res) => {
  try {
    console.log('Starting enhanced services population with embeddings...');
    
    const db = admin.firestore();
    const servicesCollection = db.collection('services');
    
    // Clear existing services
    const existingDocs = await servicesCollection.get();
    const deleteBatch = db.batch();
    
    existingDocs.docs.forEach((doc) => {
      deleteBatch.delete(doc.ref);
    });
    
    if (existingDocs.docs.length > 0) {
      await deleteBatch.commit();
      console.log(`Cleared ${existingDocs.docs.length} existing documents`);
    }

    // Simplified: Just populate services without embeddings (Gemini Pro handles intelligence)
    const results = [];
    const firestoreBatch = db.batch();
    
    enhancedServicesData.forEach((service) => {
      const serviceData = {
        ...service,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = servicesCollection.doc(service.service_id);
      firestoreBatch.set(docRef, serviceData);
      
      results.push({
        service_id: service.service_id,
        service_name: service.service_name,
        processed: true
      });
    });
    
    await firestoreBatch.commit();
    console.log('All services committed successfully');
    
    console.log('Enhanced services population completed!');
    
    res.json({
      success: true,
      message: `Successfully populated ${enhancedServicesData.length} enhanced services (ready for Gemini Pro intelligent chat)`,
      services_processed: enhancedServicesData.length,
      results: results
    });
    
  } catch (error) {
    console.error('Error populating enhanced services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to populate enhanced services',
      details: error.message
    });
  }
};
