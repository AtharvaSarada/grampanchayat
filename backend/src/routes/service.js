const express = require('express');
const router = express.Router();
const GeminiChatService = require('../services/geminiChatService');
const { logger } = require('../utils/logger');

// Initialize Gemini Chat Service
let geminiChatService;
try {
  geminiChatService = new GeminiChatService();
  logger.info('Gemini Chat Service initialized successfully');
} catch (error) {
  logger.error('Failed to initialize Gemini Chat Service:', error.message);
}

/**
 * POST /api/intelligent-chat
 * Intelligent conversational AI endpoint powered by Gemini Pro
 */
router.post('/intelligent-chat', async (req, res) => {
  try {
    const { query } = req.body;
    
    // Validate input
    if (!query || typeof query !== 'string' || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: 'Please provide a valid query. Tell me what you need help with!',
        examples: [
          "I'm getting married next month",
          "My wife just had a baby", 
          "I want to start a business",
          "I need water connection",
          "How do I get income certificate?"
        ]
      });
    }

    // Check if Gemini service is available
    if (!geminiChatService) {
      return res.status(503).json({
        success: false,
        error: true,
        message: 'Intelligent chat service is currently unavailable. Please try again later or contact support.',
        fallback: true
      });
    }

    const cleanQuery = query.trim();
    logger.info(`Intelligent chat query received: ${cleanQuery}`);

    // Generate intelligent response using Gemini Pro
    const result = await geminiChatService.generateResponse(cleanQuery);
    
    // Log the interaction for analytics
    logger.info(`Intelligent chat response generated for query: "${cleanQuery}", Success: ${result.success}`);
    
    if (result.success) {
      res.json({
        success: true,
        message: result.response,
        recommended_service: result.recommended_service,
        application_links: result.application_links,
        query: cleanQuery,
        method: 'gemini_pro',
        timestamp: result.timestamp
      });
    } else {
      // Return fallback response
      res.json({
        success: false,
        error: true,
        message: result.response,
        suggestions: result.suggestions,
        query: cleanQuery,
        fallback: true,
        error_details: result.error_message
      });
    }

  } catch (error) {
    logger.error('Intelligent chat endpoint error:', error);
    
    res.status(500).json({
      success: false,
      error: true,
      message: 'I\'m experiencing some technical difficulties right now. Please try again in a moment, or tell me specifically what service you need (like "birth certificate" or "trade license").',
      fallback: true,
      suggestions: [
        "I need a birth certificate",
        "I'm getting married, what do I need?",
        "How do I start a business?", 
        "I need water connection for my house"
      ]
    });
  }
});

/**
 * GET /api/services/all
 * Get all available services
 */
router.get('/all', (req, res) => {
  try {
    if (!geminiChatService) {
      return res.status(503).json({
        success: false,
        error: true,
        message: 'Service data is currently unavailable'
      });
    }
    
    const services = geminiChatService.getAllServices();
    res.json({
      success: true,
      services: services,
      total: services.length
    });
  } catch (error) {
    logger.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to retrieve services'
    });
  }
});

/**
 * GET /api/services/:serviceId
 * Get specific service details
 */
router.get('/:serviceId', (req, res) => {
  try {
    if (!geminiChatService) {
      return res.status(503).json({
        success: false,
        error: true, 
        message: 'Service data is currently unavailable'
      });
    }
    
    const { serviceId } = req.params;
    const service = geminiChatService.getServiceDetails(serviceId);
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: true,
        message: `Service '${serviceId}' not found`
      });
    }
    
    res.json({
      success: true,
      service: service
    });
  } catch (error) {
    logger.error('Get service details error:', error);
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to retrieve service details'
    });
  }
});

module.exports = router;
