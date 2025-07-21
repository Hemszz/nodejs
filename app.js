const express = require('express');

const app = express();

const { adminAuth, userAuth } = require('./middlewares/util');

app.use("/user", userAuth, 
  (req, res, next) => {
    console.log("Another middleware for /user route");
    res.send({ message: "Another middleware for /user route" });
    next();
  }
)

app.use("/admin", adminAuth, (req, res) => {
  res.send({ message: "Admin route accessed" });
});

app.get("/hemszz", (req, res) => {
  res.send({ firstName: "Hemszz", lastName: "Node.js" });
});

app.get("/user/:userId", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  console.log(req.body);
  res.send({ id: req.query.userId, name: req.query.name });
});

app.get("/getUserData", (req, res) => {
  try{
    //res.send({ message: "User route accessed" });
    throw new Error("This is a test error"); 
  }
  catch (error) {
    console.error("Error occurred:", error);
    res.status(500).send({ error: "An error occurred while processing your request." });
  }
});
 
app.use("/", (req, res) => {
  res.send('Hello, Hemszz! Welcome to node.js with Express!');
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});
