const express = require('express');
const router = express.Router();
const { validateSignupData } = require('../utils/signup-validation');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');

router.post('/signup', async (req, res) => {
  
  const userObj = req.body;
  console.log('Signup request body:', userObj);
  // Validate userObj here if needed

  try {
  validateSignupData(req); // Validate signup data using the utility function

  // check if the new mail already exists
  const existingUser = await userModel.findOne({ email: userObj.email });
  if (existingUser) {
    return res.status(400).send('Email already exists');
  }

  //Encrypt password before saving
  
  // If you are using bcrypt, you can do something like this:
  //userObj.password = 'test123';
  const passwordHash = await bcrypt.hash(userObj.password, 10);
  userObj.password = passwordHash; // Replace the plain password with the hashed one


  //Create a new user instance and save it to the database
  const user = new userModel(userObj);
  await user.save()
    .then(() => {
      console.log('User created successfully');
    })
    .catch((error) => {
      console.error('Error creating user:', error);
    }); 
  // Handle user signup logic here
  res.send('User signed up successfully'); 
}
  catch (error) {
    console.error('Error during signup:', error);
    res.status(400).send('Error saving the user: Validation failed. ' + error.message);
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send('Invalid Credentials');
    } 
    const isPasswordValid = user.validatePassword(password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid Credentials');
    }
    // Generate a JWT token (if using JWT for authentication)
    const token = await user.getJWT();
    res.cookie('token', token, { expires: new Date(Date.now() + 7 * 3600000) }); // Set a cookie with the JWT token
    // Handle successful login logic here, e.g., redirecting to a dashboard
    console.log('Login successful for user:', user.email);
    // You can also send user data or a success message

    res.send('Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

module.exports = router;