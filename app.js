const express = require('express');

const app = express();

app.get("/hemszz", (req, res) => {
  res.send({ firstName: "Hemszz", lastName: "Node.js" });
});

app.post("/hemszz", (req, res) => {
  res.send({ message: "Post request received!" });
});

app.delete("/hemszz", (req, res) => {
  res.send({ message: "Delete request received!" });
});

app.put("/hemszz", (req, res) => {
  res.send({ message: "Put request received!" });
});   

app.patch("/hemszz", (req, res) => {
  res.send({ message: "Patch request received!" });
});

app.use("/test", (req, res) => {
  res.send('This is a test route!');
}); 


app.use("/", (req, res) => {
  res.send('Hello, Hemszz! Welcome to node.js with Express!');
});

app.listen(7777, () => {
  console.log('Server is running on port 7777');
});
