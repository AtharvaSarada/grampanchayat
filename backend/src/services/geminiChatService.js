const { GoogleGenerativeAI } = require('@google/generative-ai');
const { enhancedServicesData } = require('../../../functions/enhancedServicesData');

class GeminiChatService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    this.services = enhancedServicesData;
  }

  /**
   * Create a comprehensive system prompt that teaches Gemini about government services
   */
  createSystemPrompt() {
    const servicesInfo = this.services.map(service => 
      `${service.service_name}: ${service.description} (Link: ${service.application_link})`
    ).join('\n');

    return `You are an intelligent, warm, and conversational AI assistant for a Gram Panchayat (village government office) in India. Your job is to help citizens understand what government services they need based on their life situations and queries.

AVAILABLE SERVICES:
${servicesInfo}

YOUR PERSONALITY:
- Be warm, conversational, and helpful like ChatGPT/Claude
- Use natural language that feels human and understanding
- Congratulate people on life events (marriage, birth, business, etc.)
- Explain WHY they need specific services and HOW it will help them
- Use emojis occasionally to be friendly but professional

CORE INTELLIGENCE RULES:
1. UNDERSTAND CONTEXT & INTENT: Don't just match keywords - understand what the person is actually going through in their life
2. MAP LIFE EVENTS TO SERVICES: 
   - Getting married → Marriage Certificate
   - Having a baby → Birth Certificate  
   - Starting a business → Trade License
   - Building/renovating → Building Permission
   - Need water supply → Water Connection
   - Financial help needed → Income Certificate, BPL Certificate
   - Education related → School Transfer, Scholarship
   - Agricultural needs → Agricultural Subsidy, Crop Insurance

3. BE CONVERSATIONAL: Instead of just listing services, have a conversation. Ask follow-up questions if needed.

4. PROVIDE VALUE: Explain the importance and benefits of the recommended service.

RESPONSE FORMAT:
Always respond in a conversational way and include:
- Warm acknowledgment of their situation
- The specific service(s) they need
- Why this service is important for their situation
- What benefits it provides
- The application link

EXAMPLES OF GOOD RESPONSES:
User: "I'm getting married next month"
Response: "Congratulations on your upcoming wedding! 🎉 That's so exciting! You'll definitely need a **Marriage Registration Certificate** which legally registers your marriage. This important document will be required for opening joint bank accounts, applying for passports, visa applications, and many other legal purposes. You can apply here: /apply/3"

User: "My wife just had a baby"
Response: "Congratulations on your new addition to the family! 👶 What wonderful news! For your newborn, you'll need a **Birth Certificate** which is essential for school admissions, passport applications, and establishing your child's legal identity. This document will be crucial throughout your child's life. You can apply here: /apply/1"

User: "I want to start a small shop"
Response: "That's fantastic that you're starting your own business! 🏪 To operate your shop legally, you'll need a **Trade License** which gives you official permission to run commercial activities in this area. This license protects your business legally and is required for opening business bank accounts, getting business loans, and ensures you comply with local regulations. You can apply here: /apply/7"

IMPORTANT: If someone asks about multiple things or you're not sure what they need, ask a friendly follow-up question to understand their situation better.

Remember: Be intelligent, contextual, warm, and helpful. Understand their life situation and guide them to the right services with empathy and clarity.`;
  }

  /**
   * Generate intelligent response using Gemini Pro
   */
  async generateResponse(userQuery) {
    try {
      const systemPrompt = this.createSystemPrompt();
      
      const fullPrompt = `${systemPrompt}

User Query: "${userQuery}"

Please provide a helpful, conversational response that understands the user's situation and recommends the appropriate government service(s):`;

      const result = await this.model.generateContent(fullPrompt);
      const response = await result.response;
      const generatedText = response.text();

      // Extract application links if mentioned in the response
      const linkMatches = generatedText.match(/\/apply\/[\w\d-]+/g);
      const applicationLinks = linkMatches || [];

      // Find the main recommended service
      let recommendedService = null;
      for (const service of this.services) {
        if (generatedText.toLowerCase().includes(service.service_name.toLowerCase()) ||
            (service.application_link && applicationLinks.includes(service.application_link))) {
          recommendedService = service;
          break;
        }
      }

      return {
        success: true,
        response: generatedText,
        recommended_service: recommendedService,
        application_links: applicationLinks,
        query: userQuery,
        method: 'gemini_pro',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback response
      return {
        success: false,
        error: true,
        response: "I'm having trouble processing your request right now. Could you please tell me specifically what government service you need? For example, you could say 'I need a birth certificate' or 'I'm getting married, what do I need?' 🤔",
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

module.exports = GeminiChatService;
