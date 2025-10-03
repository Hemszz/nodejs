const express = require('express');
const connectDb = require('./src/config/database');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies

const authRouter = require('./src/routes/auth');
const profileRouter = require('./src/routes/profile');
const requestRouter = require('./src/routes/request');
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

connectDb().then(() => {
  console.log('Database connection established yayy!!');
  app.listen(7777, () => {
    console.log('Server is running on port 7777');
  });
}).catch((error) => {
  console.error('Database connection failed:', error);
});

