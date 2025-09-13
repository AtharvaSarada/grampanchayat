const admin = require('firebase-admin');
const { enhancedServicesData } = require('./enhancedServicesData');
const { createSearchableText } = require('./simpleEmbeddingService');

/**
 * Populate Firestore with enhanced services using simple approach
 */
exports.populateSimpleServices = async (req, res) => {
  try {
    console.log('Starting simple services population...');
    
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

    // Process all services
    const firestoreBatch = db.batch();
    const results = [];
    
    enhancedServicesData.forEach((service) => {
      const serviceWithSearchText = {
        ...service,
        searchable_text: createSearchableText(service),
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = servicesCollection.doc(service.service_id);
      firestoreBatch.set(docRef, serviceWithSearchText);
      
      results.push({
        service_id: service.service_id,
        service_name: service.service_name,
        searchable_text_length: serviceWithSearchText.searchable_text.length
      });
    });
    
    await firestoreBatch.commit();
    console.log('Simple services population completed!');
    
    res.json({
      success: true,
      message: `Successfully populated ${enhancedServicesData.length} services with searchable text`,
      services_processed: enhancedServicesData.length,
      results: results
    });
    
  } catch (error) {
    console.error('Error populating simple services:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to populate simple services',
      details: error.message
    });
  }
};
