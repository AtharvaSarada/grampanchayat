const admin = require('firebase-admin');
const functions = require('firebase-functions');

// Hugging Face API configuration
const HF_API_URL = 'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium';

async function queryHuggingFace(prompt, retries = 3) {
  const hfToken = process.env.HUGGINGFACE_TOKEN || functions.config().huggingface?.token;
  
  if (!hfToken) {
    throw new Error('Hugging Face API token not configured');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const fetch = (await import('node-fetch')).default;
      
      const response = await fetch(HF_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            temperature: 0.7,
            return_full_text: false
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`HF API attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Simple keyword-based matching as fallback
function findBestServiceMatch(query, services) {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(' ').filter(word => word.length > 2);
  
  let bestMatch = null;
  let bestScore = 0;

  services.forEach(service => {
    let score = 0;
    const serviceText = `${service.service_name} ${service.description} ${service.category} ${service.keywords}`.toLowerCase();
    
    keywords.forEach(keyword => {
      if (serviceText.includes(keyword)) {
        score += 1;
        
        // Boost score for exact matches in service name
        if (service.service_name.toLowerCase().includes(keyword)) {
          score += 2;
        }
        
        // Boost score for category matches
        if (service.category.toLowerCase().includes(keyword)) {
          score += 1.5;
        }
      }
    });
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = service;
    }
  });

  return bestMatch;
}

exports.getServiceRecommendation = async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        error: 'Query is required',
        message: 'Please provide a question about the service you need.'
      });
    }

    // Get all services from Firestore
    const servicesCollection = admin.firestore().collection('services');
    const snapshot = await servicesCollection.get();
    
    const services = [];
    snapshot.forEach(doc => {
      services.push(doc.data());
    });

    if (services.length === 0) {
      return res.status(500).json({
        error: 'No services found',
        message: 'Services database appears to be empty. Please contact support.'
      });
    }

    // Create a simplified services list for AI context
    const servicesContext = services.map(s => ({
      name: s.service_name,
      description: s.description,
      category: s.category
    }));

    let recommendedService = null;

    try {
      // Try AI-powered matching first
      const aiPrompt = `You are a helpful assistant for Gram Panchayat services. Based on the user query: "${query}", recommend the most appropriate service from this list: ${JSON.stringify(servicesContext)}. Respond with just the service name that best matches the query.`;
      
      const aiResponse = await queryHuggingFace(aiPrompt);
      
      if (aiResponse && aiResponse.length > 0) {
        const aiRecommendation = aiResponse[0].generated_text?.trim();
        
        // Find the service that matches AI recommendation
        recommendedService = services.find(s => 
          s.service_name.toLowerCase().includes(aiRecommendation.toLowerCase()) ||
          aiRecommendation.toLowerCase().includes(s.service_name.toLowerCase())
        );
      }
    } catch (aiError) {
      console.warn('AI recommendation failed, using fallback:', aiError.message);
    }

    // Fallback to keyword matching if AI fails
    if (!recommendedService) {
      recommendedService = findBestServiceMatch(query, services);
    }

    if (!recommendedService) {
      return res.json({
        success: false,
        message: "I'm not sure which service matches your request. Please check the full list of services at /services",
        fallback_url: "/services",
        query: query
      });
    }

    // Log query for analytics
    await admin.firestore().collection('chatbot_queries').add({
      query: query,
      recommended_service: recommendedService.service_name,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      method: recommendedService ? 'keyword_match' : 'ai_match'
    });

    res.json({
      success: true,
      query: query,
      recommendation: {
        service_name: recommendedService.service_name,
        description: recommendedService.description,
        category: recommendedService.category,
        processing_time: recommendedService.processing_time,
        fee: recommendedService.fee,
        documents_required: recommendedService.documents_required,
        eligibility: recommendedService.eligibility,
        application_link: recommendedService.application_link
      }
    });

  } catch (error) {
    console.error('Service recommendation error:', error);
    res.status(500).json({
      error: 'Service recommendation failed',
      message: 'Unable to process your request at this time. Please try again later.',
      details: error.message
    });
  }
};
