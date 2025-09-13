const admin = require('firebase-admin');

exports.getChatbotAnalytics = async (req, res) => {
  try {
    // This endpoint should be protected for admin users only
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decodedToken = await admin.auth().verifyIdToken(token);
    const userDoc = await admin.firestore().collection('users').doc(decodedToken.uid).get();
    
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const db = admin.firestore();
    const queriesCollection = db.collection('chatbot_queries');
    
    // Get total queries
    const totalQueries = await queriesCollection.count().get();
    
    // Get queries from last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentQueries = await queriesCollection
      .where('timestamp', '>=', thirtyDaysAgo)
      .orderBy('timestamp', 'desc')
      .limit(100)
      .get();

    // Process analytics data
    const queries = [];
    const serviceRequests = {};
    const dailyStats = {};
    
    recentQueries.forEach(doc => {
      const data = doc.data();
      queries.push({
        id: doc.id,
        query: data.query,
        recommended_service: data.recommended_service,
        timestamp: data.timestamp.toDate(),
        method: data.method
      });
      
      // Count service requests
      if (data.recommended_service) {
        serviceRequests[data.recommended_service] = (serviceRequests[data.recommended_service] || 0) + 1;
      }
      
      // Daily stats
      const dateKey = data.timestamp.toDate().toDateString();
      dailyStats[dateKey] = (dailyStats[dateKey] || 0) + 1;
    });

    // Get most popular services
    const popularServices = Object.entries(serviceRequests)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([service, count]) => ({ service, count }));

    res.json({
      success: true,
      data: {
        total_queries: totalQueries.data().count,
        recent_queries_count: queries.length,
        popular_services: popularServices,
        daily_stats: dailyStats,
        recent_queries: queries.slice(0, 20) // Latest 20 queries
      }
    });

  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({
      error: 'Failed to fetch analytics',
      details: error.message
    });
  }
};
