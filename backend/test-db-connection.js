require('dotenv').config();
const { initializeFirebase, getFirestore, COLLECTIONS } = require('./src/config/firebase');

async function testDatabaseConnection() {
  try {
    console.log('🔄 Testing Firebase connection...');
    
    // Initialize Firebase
    initializeFirebase();
    const db = getFirestore();
    
    // Test basic connection
    console.log('✅ Firebase initialized successfully');
    
    // Test writing a document
    const testDoc = {
      message: 'Test connection',
      timestamp: new Date(),
      environment: 'development'
    };
    
    console.log('🔄 Testing write operation...');
    const docRef = await db.collection('test').add(testDoc);
    console.log('✅ Test document written with ID:', docRef.id);
    
    // Test reading the document
    console.log('🔄 Testing read operation...');
    const doc = await docRef.get();
    
    if (doc.exists) {
      console.log('✅ Test document read successfully:', doc.data());
    } else {
      console.log('❌ Test document not found');
    }
    
    // Clean up - delete test document
    console.log('🔄 Cleaning up test document...');
    await docRef.delete();
    console.log('✅ Test document deleted');
    
    // Test collections exist
    console.log('🔄 Testing collection access...');
    const collections = Object.values(COLLECTIONS);
    for (const collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).limit(1).get();
        console.log(`✅ Collection '${collectionName}' accessible (${snapshot.size} documents)`);
      } catch (error) {
        console.log(`⚠️  Collection '${collectionName}' error:`, error.message);
      }
    }
    
    console.log('\n🎉 Database connection test completed successfully!');
    console.log('📍 Your Firestore database is ready for development');
    
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    console.error('\n🔧 Troubleshooting steps:');
    console.error('1. Check your .env file has correct Firebase credentials');
    console.error('2. Ensure your Firebase project has Firestore enabled');
    console.error('3. Verify your service account has proper permissions');
    console.error('4. Make sure Firestore is in test mode or rules allow access');
  }
  
  process.exit(0);
}

testDatabaseConnection();
