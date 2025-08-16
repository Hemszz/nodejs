const express = require('express');
const connectDb = require('./src/config/database');
const userModel = require('./src/models/user');
const { validateaSignupData } = require('./src/utils/signup-validation');
const bcrypt = require('bcrypt');   
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken'); // If you plan to use JWT for authentication

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send('Invalid Credentials');
    } 
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).send('Invalid Credentials');
    }
    // Generate a JWT token (if using JWT for authentication)
    const token = jwt.sign({ userId: user._id }, 'JWT12345', { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true }); // Set a cookie with the JWT token
    // Handle successful login logic here, e.g., redirecting to a dashboard
    console.log('Login successful for user:', user.email);
    // You can also send user data or a success message

    res.send('Login successful');
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

app.get('/profile', async (req, res) => {
  const { token } = req.cookies; // Get the token from cookies
  const isTokenValid = jwt.verify(token, 'JWT12345'); // Verify the token
  if (!isTokenValid) {
    return res.status(401).send('Unauthorized');
  }
  const userId = isTokenValid.userId; // Extract user ID from the token
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.send(user); // Send the user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Internal Server Error');
  }   
  
});

app.post('/signup', async (req, res) => {
  
  const userObj = req.body;
  // Validate userObj here if needed

  try {
  validateaSignupData(req); // Validate signup data using the utility function

  // check if the new mail already exists
  const existingUser = await userModel.findOne({ email: userObj.email });
  if (existingUser) {
    return res.status(400).send('Email already exists');
  }

  //Encrypt password before saving
  
  // If you are using bcrypt, you can do something like this:
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

app.get('/user', async (req, res) => {
  const email = req.body.email;
  try{
    const users = await userModel.find({ email: email });
    if(users.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(users);
      console.log('User fetched successfully:', users);
    }
  }
  catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/feed', async (req, res) => {
  try{
    const users = await userModel.find({ });
    if(users.length === 0) {
      res.status(404).send('User not found');
    } else {
      res.send(users);
      console.log('Users fetched successfully:', users);
    }
  }
  catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.delete('/user', async (req, res) => {
  const userId = req.body.userId;
  try{
    const result = await userModel.findByIdAndDelete(userId);
    if(result) {
      res.send('User deleted successfully');
      console.log('User deleted successfully:', result);
    } else {
      res.status(404).send('User not found');
    }
  }
  catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.patch('/user/:userId', async (req, res) => {
  const userId = req.params?.userId;
  const updateData = req.body;
  
  try{
    const allowedUpdates = ['userId', 'age', 'photoUrl', 'gender', 'bio', 'skills'];
    const isUpdateAllowed = Object.keys(updateData).every((key) => allowedUpdates.includes(key));
    if (!isUpdateAllowed) {
      throw new Error('Invalid update fields');
    }
    const result = await userModel.findByIdAndUpdate(userId, updateData, { new: true });
    if(result) {
      res.send('User updated successfully');
      console.log('User updated successfully:', result);
    } else {
      res.status(404).send('User not found');
    }
  }
  catch (error) {
    console.error('Error updating user:', error);
    res.status(400).send('Update failed: ' + error.message);
  }
});

connectDb().then(() => {
  console.log('Database connection established yayy!!');
  app.listen(7777, () => {
    console.log('Server is running on port 7777');
  });
}).catch((error) => {
  console.error('Database connection failed:', error);
});

