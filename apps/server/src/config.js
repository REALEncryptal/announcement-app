const dotenv = require('dotenv');
dotenv.config({
    path: __dirname + '/.env'
});

module.exports = {
    PORT: process.env.PORT || 3000,
    MONGODB_URI: process.env.MONGODB_URI,
    AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET,
    AUTH0_CALLBACK_URL: process.env.AUTH0_CALLBACK_URL || '/oauth2/redirect',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173'
}