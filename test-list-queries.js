/**
 * Test Script: Enhanced Gemini Pro Chatbot List Query Capabilities
 * 
 * This script demonstrates the chatbot's ability to handle both:
 * 1. Single Service Queries - "I need birth certificate" 
 * 2. List Queries - "what services require Aadhaar card"
 */

const testQueries = [
  // SINGLE SERVICE QUERIES
  {
    type: 'single_service',
    query: "I'm getting married next month",
    expected: "Should recommend Marriage Certificate with application link"
  },
  {
    type: 'single_service', 
    query: "I need birth certificate for my baby",
    expected: "Should recommend Birth Certificate with warm congratulations"
  },
  {
    type: 'single_service',
    query: "I want to start a small business",
    expected: "Should recommend Trade License with business guidance"
  },
  
  // LIST QUERIES - These should return multiple services
  {
    type: 'list_query',
    query: "what services require Aadhaar card",
    expected: "Should list ALL services requiring Aadhaar with count"
  },
  {
    type: 'list_query',
    query: "which services cost less than 100 rupees", 
    expected: "Should list ALL services under ₹100 with fees shown"
  },
  {
    type: 'list_query',
    query: "services that take less than 15 days",
    expected: "Should list ALL fast-processing services with timeframes"
  },
  {
    type: 'list_query',
    query: "all services for business",
    expected: "Should list ALL business-related services"
  },
  {
    type: 'list_query',
    query: "how many services need passport",
    expected: "Should count and list services requiring passport"
  },
  {
    type: 'list_query',
    query: "services under 500 rupees",
    expected: "Should list all affordable services with fee breakdown"
  }
];

async function testChatbotAPI() {
  const API_BASE = 'https://api-vastrf6wqa-uc.a.run.app';
  
  console.log('🤖 TESTING ENHANCED GEMINI PRO CHATBOT');
  console.log('='.repeat(50));
  console.log();
  
  for (let i = 0; i < testQueries.length; i++) {
    const test = testQueries[i];
    
    console.log(`🧪 Test ${i + 1}: ${test.type.toUpperCase()}`);
    console.log(`Query: "${test.query}"`);
    console.log(`Expected: ${test.expected}`);
    console.log('-'.repeat(50));
    
    try {
      const response = await fetch(`${API_BASE}/intelligent-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          query: test.query
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ SUCCESS');
        console.log(`Query Type Detected: ${result.query_type || 'single_service'}`);
        console.log(`Response: ${result.message}`);
        
        if (result.recommended_services && result.recommended_services.length > 0) {
          console.log(`📋 Services Found: ${result.recommended_services.length}`);
          result.recommended_services.forEach((service, idx) => {
            console.log(`   ${idx + 1}. ${service.service_name} (${service.application_link})`);
          });
        } else if (result.recommended_service) {
          console.log(`📋 Service: ${result.recommended_service.service_name} (${result.recommended_service.application_link})`);
        }
        
        // Validate list query responses
        if (test.type === 'list_query') {
          if (result.query_type === 'list_query') {
            console.log('✅ Correctly identified as LIST QUERY');
          } else {
            console.log('❌ FAILED: Should have been identified as list query');
          }
          
          if (result.recommended_services && result.recommended_services.length > 1) {
            console.log('✅ Returned multiple services as expected');
          } else {
            console.log('❌ FAILED: List query should return multiple services');
          }
        }
        
      } else {
        console.log('❌ ERROR');
        console.log(`Message: ${result.message}`);
      }
      
    } catch (error) {
      console.log('❌ NETWORK ERROR');
      console.log(`Error: ${error.message}`);
    }
    
    console.log();
    console.log('='.repeat(50));
    console.log();
    
    // Wait 1 second between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🎉 TESTING COMPLETE!');
  console.log();
  console.log('Expected Behavior:');
  console.log('• Single Service Queries → One specific service recommendation');
  console.log('• List Queries → Complete list of matching services with count');
  console.log('• "what services require Aadhaar" → Shows ALL services, not just one example');
}

// For browser testing
if (typeof window !== 'undefined') {
  window.testChatbot = testChatbotAPI;
  console.log('Run testChatbot() in browser console to test');
}

// For Node.js testing  
if (typeof module !== 'undefined') {
  module.exports = { testChatbotAPI, testQueries };
}

// Auto-run if called directly
if (typeof require !== 'undefined' && require.main === module) {
  // Install node-fetch for testing
  const fetch = require('node-fetch');
  testChatbotAPI().catch(console.error);
}
