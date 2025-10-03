const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validator(value) {
      if(!validator.isEmail(value)) {
        throw new Error('Invalid email format '+ value);
      }
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    //write a custom validator to check password strength
    validate(value) {
      if (!/[a-z]/.test(value) || !/[A-Z]/.test(value) || !/[0-9]/.test(value) || value.length < 6) {
        throw new Error('Password must contain at least one lowercase letter, one uppercase letter, one number, and be at least 6 characters long');
      }
    }
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    validate(value) {
      if (value < 18) {
        throw new Error('Age must be at least 18');
      }
    }
  },
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "others"].includes(value)) {
        throw new Error('Gender data not valid');
      }
    }
  },
  bio: {
    type: String,
    trim: true,
    minlength: 10,
    maxlength: 200
  },
  photoUrl: {
    type: String,
    default: 'https://example.com/default-profile.png',
    validate(value) {
      if (!validator.isURL(value)) {
        throw new Error('Invalid URL format for photoUrl');
      }
    }
  },
  skills: {
    type: [String],
    // Custom validation to ensure skills are not empty
    // Ensure the array doenst have duplicate
    validate(value) {
      if (value.length === 0) {
        throw new Error('Skills array cannot be empty');
      }
      const uniqueSkills = new Set(value);
      if (uniqueSkills.size !== value.length) {
        throw new Error('Skills must be unique');
      }
    }
  }
},
{
  timestamps: true,
} ); 

userSchema.methods.getJWT = async function() {
  const token = await jwt.sign({ _id: this._id }, 'JWT12345', { expiresIn: '7d' });
  return token;
}; 

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;