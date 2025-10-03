const express = require('express');
const router = express.Router();
const { userAuth } = require("../middlewares/auth"); // Import your authentication middleware

router.post('/sendConnectionRequest', userAuth, async(req, res, next) => {
  console.log(req)
  const user = req.user; // Access the authenticated user from the request object
  console.log('Received connection request:');
  res.send(`${user.name} sent the connect request and the connection request received successfully`);  

});

module.exports = router;