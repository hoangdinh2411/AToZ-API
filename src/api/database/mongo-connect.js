const mongoose = require('mongoose');
require('dotenv').config();

async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DB);
    console.log('MONGODB CONNECT SUCCESSFULLY!!!');
  } catch (error) {
    console.log('MONGODB CONNECT ERROR:::', error);
  }
}

module.exports = connectDatabase;
