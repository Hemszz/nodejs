const validator = require('validator');

const validateSignupData = (req) => {
    const { name, email, password, age, gender, bio, photoUrl, skills} = req.body;

    if(!name || name.length < 2 || name.length > 50) {
        throw new Error('Name must be between 2 and 50 characters long');
    }
    if(!email || !validator.isEmail(email)) {
        throw new Error('Invalid email format');
    }
    if(!password || password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 6 characters long');
    }
    if(!age || age < 18) {
        throw new Error('Age must be at least 18');
    }

}

module.exports = {
    validateSignupData
};