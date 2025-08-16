const express = require('express');
const connectDb = require('./src/config/database');
const userModel = require('./src/models/user');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

app.post('/signup', async (req, res) => {
  
  const userObj = req.body;
  // Validate userObj here if needed

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

app.patch('/user', async (req, res) => {
  const userId = req.body.userId;
  const updateData = req.body;
  try{
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
    res.status(500).send('Internal Server Error');
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

