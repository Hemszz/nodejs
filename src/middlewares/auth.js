const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async(req, resp, next) => {
    
    try {
        // Middleware to check if the user is authenticated
        const { token } = req.cookies; // Get the token from cookies
        if (!token) {
            throw new Error('Authentication token is Invlid or missing');
        }
        // Verify the token
        const decodedObj = await jwt.verify(token, 'JWT12345');
        console.log('Decoded Object:', decodedObj);
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error('User not found');
        }
        req.user = user; // Attach user to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Token verification failed:', error);
        return resp.status(400).send('ERROR: ' + error.message);
    }
};  

module.exports = {userAuth};