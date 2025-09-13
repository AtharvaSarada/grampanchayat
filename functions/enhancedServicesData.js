// Enhanced Services Data for RAG System
const enhancedServicesData = [
  {
    service_id: "birth_certificate",
    service_name: "Birth Certificate",
    description: "Apply for registration and issuance of birth certificate for newborns. This document is required for school admissions, passport applications, and other official purposes. The certificate contains details like child's name, date of birth, place of birth, and parent information.",
    documents_required: [
      "Hospital Birth Certificate/Medical Certificate",
      "Parents' Aadhaar Card",
      "Address Proof (Ration Card/Voter ID/Utility Bill)",
      "Marriage Certificate of Parents (if available)"
    ],
    eligibility: "Newborn children whose birth occurred within the Gram Panchayat jurisdiction. Both hospital births and home births are eligible for registration.",
    application_link: "/apply/1",
    processing_time: "7-10 working days",
    fee: "₹50",
    category: "Civil Registration"
  },
  {
    service_id: "death_certificate",
    service_name: "Death Certificate",
    description: "Apply for registration and issuance of death certificate. This official document is required for legal formalities including property transfer, insurance claims, pension benefits, and other administrative purposes following the death of a family member.",
    documents_required: [
      "Medical Death Certificate from Hospital/Doctor",
      "Deceased Person's Identity Proof",
      "Informant's Aadhaar Card",
      "Address Proof of Deceased"
    ],
    eligibility: "Deaths that occurred within the Gram Panchayat jurisdiction. Can be applied by family members or legal representatives of the deceased person.",
    application_link: "/apply/2",
    processing_time: "5-7 working days",
    fee: "₹50",
    category: "Civil Registration"
  },
  {
    service_id: "marriage_certificate",
    service_name: "Marriage Certificate",
    description: "Apply for registration and issuance of marriage certificate. This legal document proves the marital status and is required for various purposes including passport applications, visa processing, insurance claims, and joint property purchases.",
    documents_required: [
      "Marriage Invitation Card",
      "Bride's Aadhaar Card and Age Proof",
      "Groom's Aadhaar Card and Age Proof",
      "Witness Identity Proofs (2 witnesses)",
      "Marriage Photographs"
    ],
    eligibility: "Couples who got married within the Gram Panchayat jurisdiction or are residents of the area. Both bride and groom must be of legal marriageable age.",
    application_link: "/apply/3",
    processing_time: "10-15 working days",
    fee: "₹100",
    category: "Civil Registration"
  },
  {
    service_id: "water_connection",
    service_name: "Water Connection",
    description: "Apply for a new household water connection in the village. This service provides access to treated municipal water supply for domestic use including drinking, cooking, and household activities. Regular water supply with quality testing.",
    documents_required: [
      "Property Ownership Proof",
      "Aadhaar Card",
      "Address Proof",
      "Property Tax Receipt",
      "Site Plan/Location Map"
    ],
    eligibility: "Property owners or authorized tenants within the Gram Panchayat area who do not have an existing water connection. Property should have proper access for pipeline installation.",
    application_link: "/apply/15",
    processing_time: "15-30 working days",
    fee: "₹2000-5000 (based on connection type)",
    category: "Utility Services"
  },
  {
    service_id: "trade_license",
    service_name: "Trade License",
    description: "Apply for new trade license or renewal of existing business license. This permit allows you to operate a commercial business, shop, or trade within the Gram Panchayat area. Required for all business establishments for legal operation.",
    documents_required: [
      "Business Registration Documents",
      "Proprietor's Aadhaar Card",
      "Shop/Business Address Proof",
      "Lease Agreement (if rented property)",
      "Business Plan Details",
      "NOC from Fire Department (if required)"
    ],
    eligibility: "Business owners and entrepreneurs who want to establish or operate commercial activities within the Gram Panchayat jurisdiction. Must comply with local zoning regulations.",
    application_link: "/apply/7",
    processing_time: "15-30 working days",
    fee: "₹500-2000 (based on business type)",
    category: "Business Services"
  },
  {
    service_id: "building_permission",
    service_name: "Building Permission",
    description: "Apply for construction permission for residential, commercial, or institutional buildings. This approval is mandatory before starting any construction work including new buildings, major renovations, or structural modifications.",
    documents_required: [
      "Building Plans and Architectural Drawings",
      "Property Title Deed/Ownership Proof",
      "Site Survey and Boundary Details",
      "Structural Engineer Approval",
      "Environmental Clearance (if required)",
      "Applicant's Aadhaar Card"
    ],
    eligibility: "Property owners planning to construct or renovate buildings within the Gram Panchayat area. Plans must comply with local building regulations and zoning laws.",
    application_link: "/apply/8",
    processing_time: "30-45 working days",
    fee: "₹1000-5000 (based on construction area)",
    category: "Business Services"
  },
  {
    service_id: "income_certificate",
    service_name: "Income Certificate",
    description: "Apply for income certificate which serves as proof of annual family income. This document is required for various government schemes, educational scholarships, loan applications, and reservation benefits.",
    documents_required: [
      "Salary Certificate/Income Proof from Employer",
      "Bank Account Statements (last 6 months)",
      "Income Tax Returns (if applicable)",
      "Aadhaar Card",
      "Ration Card",
      "Property Documents (if any)"
    ],
    eligibility: "Residents of the Gram Panchayat area who need official documentation of their family income for government schemes, educational benefits, or loan applications.",
    application_link: "/apply/9",
    processing_time: "7-15 working days",
    fee: "₹30",
    category: "Social Welfare"
  },
  {
    service_id: "caste_certificate",
    service_name: "Caste Certificate",
    description: "Apply for caste certificate which provides official recognition of social category (SC/ST/OBC). This certificate is essential for availing reservation benefits in education, employment, and various government schemes.",
    documents_required: [
      "Parent's Caste Certificate",
      "Birth Certificate",
      "School/College Certificate",
      "Aadhaar Card",
      "Caste Verification Affidavit",
      "Community Elder's Certificate"
    ],
    eligibility: "Members of Scheduled Castes, Scheduled Tribes, or Other Backward Classes residing in the Gram Panchayat area. Required for accessing reservation benefits.",
    application_link: "/apply/10",
    processing_time: "15-30 working days",
    fee: "₹30",
    category: "Social Welfare"
  },
  {
    service_id: "domicile_certificate",
    service_name: "Domicile Certificate",
    description: "Apply for domicile certificate which proves permanent residence in the state/area. This document is required for college admissions, job applications, and accessing various state-specific benefits and schemes.",
    documents_required: [
      "Continuous Residence Proof (minimum 3 years)",
      "Aadhaar Card",
      "Voter ID Card",
      "School/College Certificates",
      "Property Documents",
      "Employer Certificate (if applicable)"
    ],
    eligibility: "Individuals who have been permanent residents of the Gram Panchayat area for a minimum period as specified by state regulations (usually 3-15 years).",
    application_link: "/apply/11",
    processing_time: "10-20 working days",
    fee: "₹30",
    category: "Social Welfare"
  },
  {
    service_id: "bpl_certificate",
    service_name: "BPL Certificate",
    description: "Apply for Below Poverty Line certificate which identifies economically disadvantaged families. This certificate provides access to various government welfare schemes, subsidized food, healthcare, and educational benefits.",
    documents_required: [
      "Family Income Proof",
      "Ration Card",
      "Bank Account Details",
      "Property Assessment",
      "Family Member Details",
      "Aadhaar Cards of All Family Members"
    ],
    eligibility: "Families with annual household income below the state-specified poverty line threshold. Economic survey and verification will be conducted.",
    application_link: "/apply/12",
    processing_time: "20-30 working days",
    fee: "Free",
    category: "Social Welfare"
  },
  {
    service_id: "agricultural_subsidy",
    service_name: "Agricultural Subsidy",
    description: "Apply for various agricultural subsidies including equipment, seeds, fertilizers, and farming technology. These subsidies support farmers in improving agricultural productivity and adopting modern farming techniques.",
    documents_required: [
      "Land Ownership Records (Khata/Patta)",
      "Farmer Registration ID",
      "Aadhaar Card",
      "Bank Account Details",
      "Crop Details and Season Information",
      "Previous Subsidy Records (if any)"
    ],
    eligibility: "Registered farmers who own or lease agricultural land within the Gram Panchayat area. Must be engaged in active farming activities.",
    application_link: "/apply/18",
    processing_time: "30-60 working days",
    fee: "Free",
    category: "Agriculture"
  },
  {
    service_id: "crop_insurance",
    service_name: "Crop Insurance",
    description: "Register for crop insurance schemes to protect against crop losses due to natural disasters, pests, or disease. This insurance provides financial security to farmers and helps recover from agricultural losses.",
    documents_required: [
      "Land Records and Crop Details",
      "Farmer ID/Aadhaar Card",
      "Bank Account Information",
      "Sowing Certificate",
      "Previous Insurance Records",
      "Village Revenue Officer Certificate"
    ],
    eligibility: "Farmers cultivating crops within the Gram Panchayat area. Both landowner farmers and tenant farmers with proper documentation are eligible.",
    application_link: "/apply/19",
    processing_time: "15-30 working days",
    fee: "Premium as per scheme guidelines",
    category: "Agriculture"
  },
  {
    service_id: "school_transfer_certificate",
    service_name: "School Transfer Certificate",
    description: "Apply for transfer certificate for students moving from one school to another. This official document contains academic records and is required for admission to new educational institutions.",
    documents_required: [
      "Previous School Records",
      "Student's Birth Certificate",
      "Parent's Aadhaar Card",
      "Address Proof of New Location",
      "School Leaving Application",
      "Fee Clearance Certificate"
    ],
    eligibility: "Students who have completed their studies at a school within the Gram Panchayat area and need to transfer to another institution.",
    application_link: "/apply/20",
    processing_time: "5-10 working days",
    fee: "₹50",
    category: "Education"
  },
  {
    service_id: "scholarship_application",
    service_name: "Scholarship Application",
    description: "Apply for government scholarships for students from economically disadvantaged backgrounds. These scholarships support education expenses including tuition fees, books, and other educational materials.",
    documents_required: [
      "Academic Performance Records",
      "Income Certificate of Family",
      "Caste Certificate (if applicable)",
      "Bank Account Details",
      "School/College Bonafide Certificate",
      "Aadhaar Card"
    ],
    eligibility: "Students from families with income below specified limits, belonging to reserved categories, or showing exceptional academic merit. Must be enrolled in recognized educational institutions.",
    application_link: "/apply/21",
    processing_time: "45-60 working days",
    fee: "Free",
    category: "Education"
  }
];

module.exports = { enhancedServicesData };
