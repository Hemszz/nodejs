const express = require('express');
const router = express.Router();
const { userAuth } = require("../middlewares/auth"); // Import your authentication middleware

router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log('Fetching profile for user:', req);
    res.send(user); // Send the user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(400).send('ERROR : ' + error.message);
  }   
  
});

module.exports = router;