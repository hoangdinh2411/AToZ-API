const mongoose = require('mongoose');
const createHttpError = require('http-errors');
require('dotenv').config();

async function connectDatabase() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.DB);
    console.log('MONGODB CONNECT SUCCESSFULLY!!!');
  } catch (error) {
    console.log('MONGODB CONNECT ERROR:::', error);
    createHttpError(500, 'MONGODB CONNECT ERROR');
  }
}

module.exports = connectDatabase;
