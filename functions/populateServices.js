const admin = require('firebase-admin');

// Services data for AI chatbot
const servicesData = {
  1: {
    id: 1,
    service_name: 'Birth Certificate',
    description: 'Registration and issuance of birth certificate for newborns',
    category: 'Civil Registration',
    processing_time: '7-10 days',
    fee: '₹50',
    documents_required: ['Hospital Birth Slip', 'Parents Aadhaar Card', 'Address Proof'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/1',
    keywords: 'birth certificate civil registration newborn baby registration'
  },
  2: {
    id: 2,
    service_name: 'Death Certificate',
    description: 'Registration and issuance of death certificate',
    category: 'Civil Registration',
    processing_time: '5-7 days',
    fee: '₹50',
    documents_required: ['Medical Death Certificate', 'Aadhaar Card', 'Address Proof'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/2',
    keywords: 'death certificate civil registration death'
  },
  3: {
    id: 3,
    service_name: 'Marriage Certificate',
    description: 'Registration and issuance of marriage certificate',
    category: 'Civil Registration',
    processing_time: '10-15 days',
    fee: '₹100',
    documents_required: ['Marriage Invitation', 'Bride & Groom Aadhaar', 'Witness Details'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/3',
    keywords: 'marriage certificate civil registration wedding'
  },
  7: {
    id: 7,
    service_name: 'Trade License',
    description: 'Apply for new trade license or renewal for business operations',
    category: 'Business Services',
    processing_time: '15-30 days',
    fee: '₹500-2000',
    documents_required: ['Aadhaar Card', 'Address Proof', 'Business Plan', 'Lease Agreement'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/7',
    keywords: 'trade license business license shop license business registration'
  },
  8: {
    id: 8,
    service_name: 'Building Permission',
    description: 'Permission for construction of residential/commercial buildings',
    category: 'Business Services',
    processing_time: '30-45 days',
    fee: '₹1000-5000',
    documents_required: ['Building Plans', 'Title Deed', 'Site Declaration', 'Aadhaar Card'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/8',
    keywords: 'building permission construction approval house building'
  },
  9: {
    id: 9,
    service_name: 'Income Certificate',
    description: 'Certificate of income for various government benefits and schemes',
    category: 'Social Welfare',
    processing_time: '7-15 days',
    fee: '₹30',
    documents_required: ['Salary Slip', 'Bank Statement', 'Aadhaar Card', 'Address Proof'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/9',
    keywords: 'income certificate salary certificate financial certificate'
  },
  10: {
    id: 10,
    service_name: 'Caste Certificate',
    description: 'Certificate of caste for reservation benefits in education and jobs',
    category: 'Social Welfare',
    processing_time: '15-30 days',
    fee: '₹30',
    documents_required: ['Parent Caste Certificate', 'Aadhaar Card', 'Address Proof', 'Caste Affidavit'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/10',
    keywords: 'caste certificate reservation sc st obc social welfare'
  },
  11: {
    id: 11,
    service_name: 'Domicile Certificate',
    description: 'Certificate of permanent residence for various applications',
    category: 'Social Welfare',
    processing_time: '10-20 days',
    fee: '₹30',
    documents_required: ['Residence Proof', 'Aadhaar Card', 'Address Proof'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/11',
    keywords: 'domicile certificate residence certificate address certificate'
  },
  12: {
    id: 12,
    service_name: 'BPL Certificate',
    description: 'Below Poverty Line certificate for subsidies and government schemes',
    category: 'Social Welfare',
    processing_time: '20-30 days',
    fee: 'Free',
    documents_required: ['Income Proof', 'Ration Card', 'Aadhaar Card', 'Family Details'],
    eligibility: 'Applicable to residents within Gram Panchayat jurisdiction',
    application_link: '/apply/12',
    keywords: 'bpl certificate below poverty line subsidy scheme'
  },
  18: {
    id: 18,
    service_name: 'Agricultural Subsidy',
    description: 'Subsidy applications for farming equipment, seeds, and agricultural inputs',
    category: 'Agriculture',
    processing_time: '30-60 days',
    fee: 'Free',
    documents_required: ['Land Records', 'Farmer ID/Aadhaar', 'Bank Details', 'Crop Details'],
    eligibility: 'Applicable to farmers within Gram Panchayat jurisdiction',
    application_link: '/apply/18',
    keywords: 'agricultural subsidy farming equipment seeds fertilizer kisan'
  },
  19: {
    id: 19,
    service_name: 'Crop Insurance',
    description: 'Registration for crop insurance schemes to protect against crop losses',
    category: 'Agriculture',
    processing_time: '15-30 days',
    fee: 'As per scheme',
    documents_required: ['Land Records', 'Farmer ID/Aadhaar', 'Bank Details', 'Sowing Receipt'],
    eligibility: 'Applicable to farmers within Gram Panchayat jurisdiction',
    application_link: '/apply/19',
    keywords: 'crop insurance fasal bima farming protection agriculture'
  },
  20: {
    id: 20,
    service_name: 'School Transfer Certificate',
    description: 'Transfer certificate for school students moving to different schools',
    category: 'Education',
    processing_time: '5-10 days',
    fee: '₹50',
    documents_required: ['Previous Report Card', 'Aadhaar Card', 'School Records'],
    eligibility: 'Applicable to students within Gram Panchayat jurisdiction',
    application_link: '/apply/20',
    keywords: 'school transfer certificate tc student education'
  },
  21: {
    id: 21,
    service_name: 'Scholarship Application',
    description: 'Application for government scholarships for students',
    category: 'Education',
    processing_time: '45-60 days',
    fee: 'Free',
    documents_required: ['Bonafide Certificate', 'Marksheet', 'Income Certificate', 'Aadhaar Card'],
    eligibility: 'Applicable to students within Gram Panchayat jurisdiction',
    application_link: '/apply/21',
    keywords: 'scholarship student education financial aid study support'
  }
};

exports.populateServices = async (req, res) => {
  try {
    const db = admin.firestore();
    const servicesCollection = db.collection('services');
    
    // Clear existing data
    const existingDocs = await servicesCollection.get();
    const batch = db.batch();
    
    existingDocs.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    if (existingDocs.docs.length > 0) {
      await batch.commit();
    }

    // Add new services data
    const newBatch = db.batch();
    let count = 0;

    Object.values(servicesData).forEach((service) => {
      const docRef = servicesCollection.doc(service.id.toString());
      newBatch.set(docRef, service);
      count++;
    });

    await newBatch.commit();
    
    res.json({
      success: true,
      message: `Successfully populated ${count} services in Firestore`,
      services_added: count
    });
    
  } catch (error) {
    console.error('Error populating services:', error);
    res.status(500).json({
      error: 'Failed to populate services',
      details: error.message
    });
  }
};
