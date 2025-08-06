const mongoose = require('mongoose');

const connectDb = async () => {
    await mongoose.connect('mongodb+srv://hemszz:hemszz@learnmongodb.dgnnq4w.mongodb.net/devTinder');
};

module.exports = connectDb;

