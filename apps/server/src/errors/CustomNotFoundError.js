// errors/CustomNotFoundError.js

class CustomNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CustomNotFoundError';
        this.statusCode = 404;
    }
}

module.exports = CustomNotFoundError;