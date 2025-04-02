// errors.middleware.js

// Custom error handler middleware
module.exports = (err, req, res, next) => {
    console.error(err.stack);
    
    // Default error values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';
    let errors = {};
    
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
        
        // Extract all validation errors
        Object.keys(err.errors).forEach(key => {
            errors[key] = err.errors[key].message;
        });
    }
    
    // Handle Mongoose cast errors (usually invalid ObjectIds)
    if (err.name === 'CastError') {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
    }
    
    // Send appropriate response based on environment
    const response = {
        success: false,
        message,
        errors: Object.keys(errors).length > 0 ? errors : undefined
    };
    
    res.status(statusCode).json(response);
};