const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClaimSchema = new Schema({
  // Claim Collection Schema
    ClaimId: String,
    UserId:String,
    UserProductId: String,
    DateOfClaim: {type:Date,
        default: Date.now,},
    Description: String,
    Status: {type:String,
        enum:["Approved","Rejected","Pending"],
        default:"Pending"
    },
    
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
  
const Claim = mongoose.model("Claim",ClaimSchema,"claims");

module.exports = { Claim };
