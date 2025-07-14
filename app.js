const express = require('express');

const app = express();

app.use("/", (req, res) => {
  res.send('Hello, Hemszz! Welcome to node.js with Express!');
});

app.use("/test", (req, res) => {
  res.send('This is a test route!');
}); 

app.use("/test2", (req, res) => {
  res.send('This is another test route!');
});


app.listen(7777, () => {
  console.log('Server is running on port 7777');
});
