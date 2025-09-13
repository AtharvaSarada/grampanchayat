const { logger } = require('../utils/logger');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      logger.warn('Validation error:', error.details[0].message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        error: error.details[0].message
      });
    }
    next();
  };
};

module.exports = {
  validateRequest
};
