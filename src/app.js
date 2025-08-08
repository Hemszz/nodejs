const express = require('express');
const connectDb = require('./config/database');
const userModel = require('./models/user');

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

connectDb().then(() => {
  console.log('Database connection established yayy!!');
  app.listen(7777, () => {
    console.log('Server is running on port 7777');
  });
}).catch((error) => {
  console.error('Database connection failed:', error);
});

