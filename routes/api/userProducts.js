const express = require("express");

const router = express.Router();

const { connect } = require("../../utils/Database.js");

const { UserProducts } = require("../../utils/models/UserProducts.js");
const { v4: uuidv4 } = require("uuid");

router.post("/register", async (request, response) => {
  try {
    request.body.UserProductId = uuidv4();
    request.body.UserId = request.user.UserID;
    let dbResponse = await UserProducts.create(request.body);
    if (dbResponse._id) {
      response.status(200).send("Product registered succesfully.");
    }
  } catch (error) {
    console.error("Register Product error:", error);
    response.status(500).send("Internal server error");
  }
});

router.get("/getProductById/:UserProductId", async (request, response) => {
    try {
        const userProductId = request.params.UserProductId;
      if (request.user.UserID) {
        if (request.user.RoleID === 2) {
          const product = await UserProducts.findOne({
            UserId: request.user.UserID,
            UserProductId:userProductId
            
          });
          response.status(200).json(product);
        } else if (request.user.RoleID === 1) {
          const product = await UserProducts.findOne({
            userProductId:userProductId         
          });
          response.status(200).json(product);
        } else {
          console.log("No products Registerd");
          response.status(404).send("User has no products registered");
        }
      } else {
        console.log("User not found");
        response.status(404).send("User has no products registered");
      }
    } catch (error) {
      console.error("Token not found:", error);
      response.status(500).send("Internal server error");
    }
  });

router.get("/list", async (request, response) => {
  try {
    if (request.user.UserID) {
      if (request.user.RoleID === 2) {
        const product = await UserProducts.find({
          UserId: request.user.UserID,
        });
        response.status(200).json(product);
      } else if (request.user.RoleID === 1) {
        const product = await UserProducts.find();
        response.status(200).json(product);
      } else {
        console.log("No products Registerd");
        response.status(404).send("User has no products registered");
      }
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
router.put("/update/:UserProductId", async (request, response) => {
  try {
    const userProductId = request.params.UserProductId;
    const updatedProduct = request.body;
    console.log(request.body);
    if (request.user.RoleID === 1) {
      // For admins, allow update any product
      const product = await UserProducts.findOneAndUpdate(
        { UserProductId: userProductId },
        { $set: updatedProduct },
        { new: true }
      );

      if (product) {
        response.status(200).json(product);
      } else {
        response.status(404).send("Product not found");
      }
    } else if (request.user.RoleID === 2) {
      // Assuming the UserProducts model has a UserId field

      const product = await UserProducts.findOneAndUpdate(
        {
          $and: [
            { UserId: request.user.UserID },
            { UserProductId: userProductId },
          ],
        },
        { $set: updatedProduct },
        { new: true }
      );
      if (product) {
        response.status(200).json("Product updated successfully!");
      } else {
        response.status(404).send("Product not found");
      }
    } else {
      response.status(403).send("Forbidden: Insufficient permissions");
    }
  } catch (error) {
    console.error("Update Product error:", error);
    response.status(500).send("Internal server error");
  }
});

// Delete route
router.delete("/delete/:UserProductId", async (request, response) => {
  try {
    const userProductId = request.params.UserProductId;

    if (request.user.RoleID === 1) {
      // For admins, allow deletion of any product
      const deletedProduct = await UserProducts.findOneAndDelete({
        UserProductId: userProductId,
      });

      if (deletedProduct) {
        response.status(200).send("Product deleted successfully");
      } else {
        response.status(404).send("Product not found");
      }
    } else if (request.user.RoleID === 2) {
      // Assuming the UserProducts model has a UserId field
      const deletedProduct = await UserProducts.findOneAndDelete({
        $and: [
          { UserId: request.user.UserID },
          { UserProductId: userProductId },
        ],
      });

      if (deletedProduct) {
        response.status(200).send("Product deleted successfully");
      } else {
        response.status(404).send("Product not found");
      }
    } else {
      response.status(403).send("Forbidden: Insufficient permissions");
    }
  } catch (error) {
    console.error("Delete Product error:", error);
    response.status(500).send("Internal server error");
  }
});

connect()
  .then((connectedClient) => {
    client = connectedClient;

    console.log("Connected to MongoDB UserProducts router");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1);
  });
module.exports = router;
