const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserProductSchema = new Schema({
  // Claim Collection Schema
    UserProductId: String,
    ProductId:String,
    UserId: String,
    SerialNo: String,
    PurchaseDate: Date,
    createdAt: {
        type: Date,
        default: Date.now,
      },
      createdBy: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
      updatedBy: {
        type: Number,
        default: null, 
      },
    });
  
const UserProducts = mongoose.model("UserProducts", UserProductSchema,"UserProducts");

module.exports = { UserProducts };
