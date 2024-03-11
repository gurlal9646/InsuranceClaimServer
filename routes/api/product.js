const express = require("express");

const router = express.Router();

const { connect } = require("../../utils/Database.js");

const { AvailableProduct } = require("../../utils/models/AvailableProducts.js");

const { v4: uuidv4 } = require("uuid");

router.post("/create", async (request, response) => {
  try {
    request.body.ProductID = uuidv4();
    let dbResponse = await AvailableProduct.create(request.body);
    console.log(dbResponse);

    if (dbResponse._id) {
      response.status(200).send("Product  added to the database.");
    }
  } catch (error) {
    console.error("Create Product error:", error);
    response.status(500).send("Internal server error");
  }
});

// Get route
router.get("/list", async (request, response) => {
  try {
    const productId = request.query.ProductID;
    if (productId) {
      const product = await AvailableProduct.findOne({ ProductID: productId });
      if (product) {
        response.status(200).json(product);
      } else {
        response.status(404).send("Product not found");
      }
    } else {
      const products = await AvailableProduct.find();
      response.status(200).json(products);
    }
  } catch (error) {
    console.error("Get Products error:", error);
    response.status(500).send("Internal server error");
  }
});

router.get("/getProductById/:ProductId", async (request, response) => {
  try {
    const ProductId = request.params.ProductId;
    if (request.user.UserID) {
      const product = await AvailableProduct.findOne({
        ProductID: ProductId,
      });
      response.status(200).json(product);
    } else {
      console.log("User not found");
      response.status(404).send("User has no products registered");
    }
  } catch (error) {
    console.error("Token not found:", error);
    response.status(500).send("Internal server error");
  }
});

// Update route
router.put("/update/:ProductID", async (request, response) => {
  try {
    const productId = request.params.ProductID;
    const updatedProduct = request.body;

    const product = await AvailableProduct.findOneAndUpdate(
      { ProductID: productId },
      { $set: updatedProduct },
      { new: true }
    );

    if (product) {
      response.status(200).json("Product updated successfully!");
    } else {
      response.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Update Product error:", error);
    response.status(500).send("Internal server error");
  }
});

// Delete route
router.delete("/delete/:ProductID", async (request, response) => {
  try {
    const productId = request.params.ProductID;

    const deletedProduct = await AvailableProduct.findOneAndDelete({
      ProductID: productId,
    });

    if (deletedProduct) {
      response.status(200).send("Product deleted successfully");
    } else {
      response.status(404).send("Product not found");
    }
  } catch (error) {
    console.error("Delete Product error:", error);
    response.status(500).send("Internal server error");
  }
});

connect()
  .then((connectedClient) => {
    client = connectedClient;

    console.log("Connected to MongoDB products router");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1); // Exit the application if the database connection fails
  });
module.exports = router;
