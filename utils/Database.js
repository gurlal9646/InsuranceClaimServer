require("dotenv").config();

const mongoose = require("mongoose");

const uri = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DBNAME}`;

async function connect() {
  try {
    await mongoose.connect(uri);

    return mongoose;
  } catch (e) {
    console.error(e);

    throw e; // Rethrow the error for the caller to handle
  }
}

module.exports = { connect };
