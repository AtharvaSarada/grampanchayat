const admin = require('firebase-admin');

/**
 * Populate test applications in Firestore for testing statistics
 */
exports.populateTestApplications = async (req, res) => {
  try {
    console.log('Starting test applications population...');
    
    const db = admin.firestore();
    const applicationsCollection = db.collection('applications');
    
    // Sample service IDs (matching your services)
    const serviceIds = [
      'birth_certificate',
      'death_certificate', 
      'marriage_certificate',
      'water_connection',
      'trade_license',
      'building_permission',
      'income_certificate',
      'caste_certificate'
    ];
    
    const statuses = ['pending', 'approved', 'completed', 'rejected'];
    const userIds = ['user_001', 'user_002', 'user_003', 'user_004', 'user_005'];
    
    const sampleApplications = [];
    const count = req.body?.count || 15; // Default 15 applications
    
    for (let i = 0; i < count; i++) {
      // Random date within last 60 days
      const submittedAt = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
      );
      
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      let completedAt = null;
      if (status === 'completed') {
        // Add 3-15 days processing time for completed applications
        const processingDays = 3 + Math.random() * 12;
        completedAt = admin.firestore.Timestamp.fromDate(
          new Date(submittedAt.toDate().getTime() + processingDays * 24 * 60 * 60 * 1000)
        );
      }
      
      const application = {
        application_id: `APP${Date.now()}${String(i).padStart(3, '0')}`,
        service_id: serviceIds[Math.floor(Math.random() * serviceIds.length)],
        user_id: userIds[Math.floor(Math.random() * userIds.length)],
        status: status,
        submitted_at: submittedAt,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        ...(completedAt && { completed_at: completedAt }),
        // Additional fields for realism
        applicant_name: `Test User ${i + 1}`,
        contact_number: `+91${String(Math.floor(Math.random() * 10000000000)).padStart(10, '0')}`,
        fee_amount: Math.floor(Math.random() * 500) + 50 // Random fee between 50-550
      };
      
      sampleApplications.push(application);
    }
    
    // Add all applications in batches
    const batchSize = 500; // Firestore batch limit
    const batches = [];
    
    for (let i = 0; i < sampleApplications.length; i += batchSize) {
      const batch = db.batch();
      const batchApplications = sampleApplications.slice(i, i + batchSize);
      
      batchApplications.forEach((app) => {
        const docRef = applicationsCollection.doc();
        batch.set(docRef, app);
      });
      
      batches.push(batch);
    }
    
    // Execute all batches
    await Promise.all(batches.map(batch => batch.commit()));
    
    console.log(`Created ${sampleApplications.length} test applications`);
    
    // Calculate some statistics for response
    const completedApps = sampleApplications.filter(app => app.status === 'completed');
    let avgProcessingTime = 0;
    
    if (completedApps.length > 0) {
      const totalProcessingTime = completedApps.reduce((sum, app) => {
        if (app.completed_at && app.submitted_at) {
          const processingMs = app.completed_at.toDate().getTime() - app.submitted_at.toDate().getTime();
          return sum + (processingMs / (1000 * 60 * 60 * 24)); // Convert to days
        }
        return sum;
      }, 0);
      avgProcessingTime = Math.round((totalProcessingTime / completedApps.length) * 10) / 10;
    }
    
    res.json({
      success: true,
      message: `Successfully created ${sampleApplications.length} test applications`,
      data: {
        totalApplications: sampleApplications.length,
        completedApplications: completedApps.length,
        averageProcessingTime: avgProcessingTime,
        statusBreakdown: {
          pending: sampleApplications.filter(app => app.status === 'pending').length,
          approved: sampleApplications.filter(app => app.status === 'approved').length,
          completed: sampleApplications.filter(app => app.status === 'completed').length,
          rejected: sampleApplications.filter(app => app.status === 'rejected').length
        }
      }
    });
    
  } catch (error) {
    console.error('Error creating test applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create test applications',
      details: error.message
    });
  }
};

/**
 * Clear all test applications (for testing purposes)
 */
exports.clearTestApplications = async (req, res) => {
  try {
    console.log('Clearing test applications...');
    
    const db = admin.firestore();
    const applicationsCollection = db.collection('applications');
    
    // Get all applications
    const snapshot = await applicationsCollection.get();
    
    if (snapshot.empty) {
      return res.json({
        success: true,
        message: 'No applications to clear',
        deletedCount: 0
      });
    }
    
    // Delete in batches
    const batchSize = 500;
    const batches = [];
    
    for (let i = 0; i < snapshot.docs.length; i += batchSize) {
      const batch = db.batch();
      const batchDocs = snapshot.docs.slice(i, i + batchSize);
      
      batchDocs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      
      batches.push(batch);
    }
    
    // Execute all batches
    await Promise.all(batches.map(batch => batch.commit()));
    
    console.log(`Deleted ${snapshot.docs.length} applications`);
    
    res.json({
      success: true,
      message: `Successfully deleted ${snapshot.docs.length} applications`,
      deletedCount: snapshot.docs.length
    });
    
  } catch (error) {
    console.error('Error clearing test applications:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to clear test applications',
      details: error.message
    });
  }
};
