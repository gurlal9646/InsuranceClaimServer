const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  // User Collection Schema
    UserID: String,
    RoleID:Number,
    Username: String,
    Password: String,
    CellphoneNo: String,
    Email: String,
    Name: String,
    Address: String,
    createdAt: {
        type: Date,
        default: Date.now, // Set default value to the current date
      },
      createdBy: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null, // Set default value to null
      },
      updatedBy: {
        type: Number,
        default: null, // Set default value to null
      },
    });
  
const User = mongoose.model("User", UserSchema,"users");

module.exports = { User };
