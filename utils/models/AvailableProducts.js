const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AvailableProductSchema = new Schema({

// AvailableStock Collection Schema
    ProductID: String,
    ProductName: String,
    Model: String,
    Manufacturer: String,
    Description: String,
    Price: Number,
    WarrantyDetails: String,
    Availability: {
      type: String,
      enum: ['Available', 'Out of Stock'],
      default: 'Available'
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

  
const AvailableProduct = mongoose.model("AvailableProduct ", AvailableProductSchema, "AvailableProducts");

module.exports = { AvailableProduct  };
