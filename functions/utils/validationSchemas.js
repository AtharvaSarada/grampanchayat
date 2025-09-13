const Joi = require('joi');

// User registration schema
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
  address: Joi.object({
    street: Joi.string().required(),
    village: Joi.string().required(),
    district: Joi.string().required(),
    state: Joi.string().required(),
    pinCode: Joi.string().pattern(/^[0-9]{6}$/).required()
  }).required(),
  dateOfBirth: Joi.date().max('now').required(),
  role: Joi.string().valid('user', 'staff', 'officer').default('user')
});

// User login schema
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Service creation schema
const serviceSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(500).required(),
  category: Joi.string().required(),
  requiredDocuments: Joi.array().items(Joi.string()).min(1).required(),
  processingTime: Joi.string().required(),
  fees: Joi.number().min(0).required(),
  eligibilityCriteria: Joi.array().items(Joi.string()).min(1).required(),
  isActive: Joi.boolean().default(true)
});

// Application submission schema
const applicationSchema = Joi.object({
  serviceId: Joi.string().required(),
  applicantDetails: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.string().pattern(/^[0-9]{10}$/).required(),
    address: Joi.object({
      street: Joi.string().required(),
      village: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      pinCode: Joi.string().pattern(/^[0-9]{6}$/).required()
    }).required()
  }).required(),
  additionalInfo: Joi.object(),
  documents: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    url: Joi.string().uri().required(),
    type: Joi.string().required()
  }))
});

// Application status update schema
const applicationStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'under_review', 'approved', 'rejected', 'completed').required(),
  remarks: Joi.string().max(500),
  reviewedBy: Joi.string().required()
});

// Profile update schema
const profileUpdateSchema = Joi.object({
  firstName: Joi.string().min(2).max(50),
  lastName: Joi.string().min(2).max(50),
  phoneNumber: Joi.string().pattern(/^[0-9]{10}$/),
  address: Joi.object({
    street: Joi.string(),
    village: Joi.string(),
    district: Joi.string(),
    state: Joi.string(),
    pinCode: Joi.string().pattern(/^[0-9]{6}$/)
  }),
  dateOfBirth: Joi.date().max('now')
});

// Password change schema
const passwordChangeSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
  confirmPassword: Joi.string().valid(Joi.ref('newPassword')).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  serviceSchema,
  applicationSchema,
  applicationStatusSchema,
  profileUpdateSchema,
  passwordChangeSchema
};
