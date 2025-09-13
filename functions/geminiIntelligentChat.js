const { GoogleGenerativeAI } = require('@google/generative-ai');
const admin = require('firebase-admin');
const { enhancedServicesData } = require('./enhancedServicesData');

/**
 * Gemini Pro Intelligent Chat Service for Firebase Functions
 * Replaces all existing RAG and recommendation systems with true AI intelligence
 */
class GeminiIntelligentChat {
  constructor() {
    // Initialize Gemini AI with API key from Firebase Functions config
    // Load from environment variables (dotenv)
    this.geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!this.geminiApiKey) {
      throw new Error('GEMINI_API_KEY not configured in Firebase Functions environment');
    }
    
    this.genAI = new GoogleGenerativeAI(this.geminiApiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    this.services = enhancedServicesData;
  }

  /**
   * Create intelligent system prompt for government services
   */
  createSystemPrompt() {
    const servicesInfo = this.services.map(service => 
      `${service.service_name}: ${service.description} | Fee: ${service.fee} | Time: ${service.processing_time} | Link: ${service.application_link} | Docs: ${service.documents_required?.join(', ') || 'Standard documents'}`
    ).join('\n');

    return `You are an intelligent, warm, and conversational AI assistant for a Gram Panchayat (village government office) in India. Your job is to help citizens with government services.

AVAILABLE SERVICES (with full details):
${servicesInfo}

CRITICAL: You MUST distinguish between two types of queries:

**TYPE 1: SINGLE SERVICE QUERIES** - When someone needs a specific service for their life situation:
- "I'm getting married" → Marriage Certificate
- "I need birth certificate" → Birth Certificate
- "I want to start business" → Trade License

**TYPE 2: LIST QUERIES** - When someone asks about multiple services based on criteria:
- "what services require Aadhaar card"
- "which services cost less than 100 rupees"
- "services that take less than 15 days"
- "all services for business"
- "how many services need passport"

LIST QUERY KEYWORDS: "what services", "which services", "how many services", "all services", "list services", "services that", "services for", "services under", "services with", "services requiring"

YOUR RESPONSE FORMATS:

**FOR SINGLE SERVICE QUERIES:**
Be warm and conversational, recommend the specific service they need with application link.

**FOR LIST QUERIES:**
Provide a complete formatted list of ALL matching services. Use this exact format:

"Here are the [NUMBER] services that [CRITERIA]:

1. **Service Name**
   Brief description
   Fee: [amount] | Processing: [time]
   [Apply Link]

2. **Service Name**
   Brief description  
   Fee: [amount] | Processing: [time]
   [Apply Link]

[Continue for ALL matching services]"

EXAMPLES:

User: "I'm getting married next month" (SINGLE SERVICE)
Response: "Congratulations on your upcoming wedding! 🎉 You'll need a **Marriage Certificate** which legally registers your marriage. This is required for joint bank accounts, passports, and legal purposes. You can apply here: /apply/3"

User: "what services require Aadhaar card" (LIST QUERY)
Response: "Here are the 12 services that require Aadhaar card:

1. **Birth Certificate**
   Essential for newborns' legal identity and school admissions
   Fee: ₹50 | Processing: 7-10 working days
   /apply/1

2. **Marriage Certificate** 
   Legal registration of marriage for official purposes
   Fee: ₹100 | Processing: 10-15 working days
   /apply/3

[Continue for ALL services that require Aadhaar]"

IMPORTANT RULES:
- For LIST queries, you MUST search through ALL services and show EVERY match
- Always include the count ("Here are the X services that...")
- Never show just one example for list queries - show the complete list
- Be conversational but prioritize completeness for list queries

Remember: Understand their intent - are they asking for ONE specific service or a LIST of services?`;
  }

  /**
   * Classify query type: single service vs list query
   */
  classifyQueryType(query) {
    const listKeywords = [
      'what services', 'which services', 'how many services', 'all services',
      'list services', 'services that', 'services for', 'services under',
      'services with', 'services requiring', 'services need', 'services cost',
      'services take', 'show me services', 'find services'
    ];
    
    const queryLower = query.toLowerCase();
    const isListQuery = listKeywords.some(keyword => queryLower.includes(keyword));
    
    return {
      isListQuery,
      isSingleService: !isListQuery
    };
  }

  /**
   * Find services matching specific criteria
   */
  findMatchingServices(query, criteria) {
    const queryLower = query.toLowerCase();
    const matchingServices = [];
    
    for (const service of this.services) {
      let matches = false;
      
      // Document-based matching
      if (queryLower.includes('aadhaar') || queryLower.includes('aadhar')) {
        if (service.documents_required?.some(doc => doc.toLowerCase().includes('aadhaar') || doc.toLowerCase().includes('aadhar'))) {
          matches = true;
        }
      }
      
      // Fee-based matching
      if (queryLower.includes('cost') || queryLower.includes('fee') || queryLower.includes('rupees') || queryLower.includes('₹')) {
        const feeMatch = queryLower.match(/(under|less than|below)\s*(\d+)/i);
        if (feeMatch) {
          const maxFee = parseInt(feeMatch[2]);
          const serviceFee = service.fee.replace(/[^\d]/g, '');
          if (serviceFee && parseInt(serviceFee) <= maxFee) {
            matches = true;
          }
        } else if (queryLower.includes('free')) {
          if (service.fee.toLowerCase().includes('free')) {
            matches = true;
          }
        }
      }
      
      // Time-based matching
      if (queryLower.includes('days') || queryLower.includes('time') || queryLower.includes('processing')) {
        const timeMatch = queryLower.match(/(under|less than|below)\s*(\d+)\s*days?/i);
        if (timeMatch) {
          const maxDays = parseInt(timeMatch[2]);
          const serviceTime = service.processing_time.match(/\d+/g);
          if (serviceTime && parseInt(serviceTime[0]) <= maxDays) {
            matches = true;
          }
        }
      }
      
      // Category-based matching
      if (queryLower.includes('business') || queryLower.includes('trade') || queryLower.includes('commercial')) {
        if (service.category?.toLowerCase().includes('business') || 
            service.service_name.toLowerCase().includes('business') ||
            service.service_name.toLowerCase().includes('trade') ||
            service.service_name.toLowerCase().includes('license')) {
          matches = true;
        }
      }
      
      if (queryLower.includes('civil') || queryLower.includes('certificate')) {
        if (service.category?.toLowerCase().includes('civil') ||
            service.service_name.toLowerCase().includes('certificate')) {
          matches = true;
        }
      }
      
      if (queryLower.includes('agriculture') || queryLower.includes('farming') || queryLower.includes('crop')) {
        if (service.category?.toLowerCase().includes('agriculture') ||
            service.service_name.toLowerCase().includes('agricultural') ||
            service.service_name.toLowerCase().includes('crop')) {
          matches = true;
        }
      }
      
      if (queryLower.includes('education') || queryLower.includes('school') || queryLower.includes('scholarship')) {
        if (service.category?.toLowerCase().includes('education') ||
            service.service_name.toLowerCase().includes('school') ||
            service.service_name.toLowerCase().includes('scholarship')) {
          matches = true;
        }
      }
      
      // Passport-based matching
      if (queryLower.includes('passport')) {
        if (service.documents_required?.some(doc => doc.toLowerCase().includes('passport')) ||
            service.description.toLowerCase().includes('passport')) {
          matches = true;
        }
      }
      
      // General document matching
      const docKeywords = ['birth certificate', 'death certificate', 'marriage certificate', 
                          'income certificate', 'caste certificate', 'domicile certificate'];
      for (const docKeyword of docKeywords) {
        if (queryLower.includes(docKeyword.replace(' certificate', ''))) {
          if (service.service_name.toLowerCase().includes(docKeyword)) {
            matches = true;
          }
        }
      }
      
      if (matches) {
        matchingServices.push(service);
      }
    }
    
    return matchingServices;
  }

  /**
   * Generate intelligent response using Gemini Pro
   */
  async generateResponse(userQuery) {
    try {
      const queryType = this.classifyQueryType(userQuery);
      const systemPrompt = this.createSystemPrompt();
      
      let enhancedPrompt;
      
      if (queryType.isListQuery) {
        // For list queries, also provide matching services data
        const matchingServices = this.findMatchingServices(userQuery);
        const matchingInfo = matchingServices.map(s => 
          `${s.service_name} | Fee: ${s.fee} | Time: ${s.processing_time} | Link: ${s.application_link}`
        ).join('\n');
        
        enhancedPrompt = `${systemPrompt}

User Query: "${userQuery}"

DETECTED: This is a LIST QUERY asking about multiple services.

MATCHING SERVICES FOUND:
${matchingInfo || 'None found by keyword matching - search all services manually'}

IMPORTANT: You MUST provide a complete formatted list of ALL services that match the user's criteria. Don't just give one example - give the complete list with count. Use the exact format specified in the system prompt.`;
      } else {
        // For single service queries, use standard approach
        enhancedPrompt = `${systemPrompt}

User Query: "${userQuery}"

DETECTED: This is a SINGLE SERVICE QUERY for a specific life situation.

Please provide a warm, conversational response recommending the specific service they need.`;
      }

      const result = await this.model.generateContent(enhancedPrompt);
      const response = await result.response;
      const generatedText = response.text();

      // Extract application links if mentioned in the response
      const linkMatches = generatedText.match(/\/apply\/[\w\d-]+/g);
      const applicationLinks = linkMatches || [];

      // For list queries, find all mentioned services
      let recommendedServices = [];
      if (queryType.isListQuery) {
        for (const service of this.services) {
          if (generatedText.toLowerCase().includes(service.service_name.toLowerCase()) ||
              (service.application_link && applicationLinks.includes(service.application_link))) {
            recommendedServices.push(service);
          }
        }
      } else {
        // For single service queries, find the main recommended service
        for (const service of this.services) {
          if (generatedText.toLowerCase().includes(service.service_name.toLowerCase()) ||
              (service.application_link && applicationLinks.includes(service.application_link))) {
            recommendedServices.push(service);
            break; // Only one for single service queries
          }
        }
      }

      return {
        success: true,
        message: generatedText,
        query_type: queryType.isListQuery ? 'list_query' : 'single_service',
        recommended_service: recommendedServices[0] || null, // For backward compatibility
        recommended_services: recommendedServices, // New field for list queries
        application_links: applicationLinks,
        query: userQuery,
        method: 'gemini_pro_intelligent_enhanced',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback response
      return {
        success: false,
        error: true,
        message: "I'm having trouble processing your request right now. Could you please tell me specifically what government service you need? For example, you could say 'I need a birth certificate' or 'I'm getting married, what do I need?' 🤔",
        fallback: true,
        query: userQuery,
        error_message: error.message,
        suggestions: [
          "I need a birth certificate",
          "I'm getting married, what documents do I need?", 
          "How do I start a business?",
          "I need water connection for my house",
          "I want to build a house",
          "I need income certificate"
        ]
      };
    }
  }

  /**
   * Get service details by name or ID
   */
  getServiceDetails(serviceName) {
    return this.services.find(service => 
      service.service_name.toLowerCase() === serviceName.toLowerCase() ||
      service.service_id === serviceName
    );
  }

  /**
   * Get all available services
   */
  getAllServices() {
    return this.services;
  }
}

/**
 * Firebase Cloud Function for Intelligent Chat
 * REPLACES: intelligentRagRecommendation, ragServiceRecommendation, simpleRagRecommendation
 */
async function intelligentChat(req, res) {
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

    const cleanQuery = query.trim();
    console.log('Intelligent chat query received:', cleanQuery);

    // Initialize Gemini service
    const geminiService = new GeminiIntelligentChat();
    
    // Generate intelligent response
    const result = await geminiService.generateResponse(cleanQuery);
    
    // Log the interaction for analytics
    try {
      await admin.firestore().collection('chatbot_queries').add({
        query: cleanQuery,
        response: result.message || null,
        query_type: result.query_type || 'single_service',
        recommended_service: result.recommended_service?.service_name || null,
        recommended_services_count: result.recommended_services?.length || 0,
        success: result.success,
        method: result.method || 'gemini_pro_intelligent',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        user_ip: req.ip,
        user_agent: req.get('User-Agent')
      });
    } catch (logError) {
      console.error('Failed to log chat interaction:', logError);
    }
    
    if (result.success) {
      res.json({
        success: true,
        message: result.message,
        query_type: result.query_type,
        recommended_service: result.recommended_service,
        recommended_services: result.recommended_services, // For list queries
        application_links: result.application_links,
        query: cleanQuery,
        method: result.method,
        timestamp: result.timestamp
      });
    } else {
      // Return fallback response
      res.json({
        success: false,
        error: true,
        message: result.message,
        suggestions: result.suggestions,
        query: cleanQuery,
        fallback: true,
        error_details: result.error_message
      });
    }

  } catch (error) {
    console.error('Intelligent chat endpoint error:', error);
    
    // Log error
    try {
      await admin.firestore().collection('chatbot_errors').add({
        query: req.body.query,
        error: error.message,
        method: 'gemini_pro_intelligent',
        timestamp: admin.firestore.FieldValue.serverTimestamp()
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
    
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
}

/**
 * Get all services endpoint
 */
async function getAllServices(req, res) {
  try {
    const geminiService = new GeminiIntelligentChat();
    const services = geminiService.getAllServices();
    
    res.json({
      success: true,
      services: services,
      total: services.length,
      method: 'gemini_service_list'
    });
  } catch (error) {
    console.error('Get all services error:', error);
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to retrieve services'
    });
  }
}

/**
 * Get specific service details endpoint
 */
async function getServiceDetails(req, res) {
  try {
    const { serviceId } = req.params;
    const geminiService = new GeminiIntelligentChat();
    const service = geminiService.getServiceDetails(serviceId);
    
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
    console.error('Get service details error:', error);
    res.status(500).json({
      success: false,
      error: true,
      message: 'Failed to retrieve service details'
    });
  }
}

module.exports = {
  intelligentChat,
  getAllServices,
  getServiceDetails,
  GeminiIntelligentChat
};
