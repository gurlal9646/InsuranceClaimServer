const express = require("express");

const router = express.Router();

const { connect } = require("../../utils/Database.js");

const { User } = require("../../utils/models/User.js");

const { encryptPassword, comparePasswords } = require("../../utils/bcrypt.js");

const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { Roles } = require("../../utils/Enums.js");

router.post("/login", async (request, response) => {
  try {
    const user = await User.findOne({
      $or: [
        { Username: request.body.Username },
        { Email: request.body.Username },
      ],
    });
    if (!user) {
      return response.status(401).send("User not found");
    }

    const passwordMatch = await comparePasswords(
      request.body.Password,
      user.Password
    );

    if (passwordMatch) {
      const token = jwt.sign(
        {
          UserID: user.UserID,
          RoleID: user.RoleID,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      response
        .status(200)
        .send({ token, RoleID: user.RoleID, UserID: user.UserID });
    } else {
      response.status(401).send("Username or password is incorrect.");
    }
  } catch (error) {
    console.error("Login error:", error);
    response.status(500).send("Internal server error");
  }
});

router.post("/signup", async (request, response) => {
  try {
    const user = await User.findOne({
      Email: request.body.Email,
      Username: request.body.Username,
    });
    if (user) {
      return response.status(401).send("User already exists");
    }

    request.body.UserID = uuidv4();
    request.body.Password = await encryptPassword(request.body.Password);
    if (!request.body.hasOwnProperty("RoleID")) {
      request.body.RoleID = Roles.USER;
    }
    else{
      request.body.RoleID = Roles.ADMIN;
    }
    let dbResponse = await User.create(request.body);
    if (dbResponse._id) {
      const token = jwt.sign(
        {
          UserID: request.body.UserID,
          RoleID: request.body.RoleID,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );
      response
        .status(200)
        .send({
          token,
          RoleID: request.body.RoleID,
          UserID: request.body.UserID,
        });
    }
  } catch (error) {
    console.error("Signup error:", error);
    response.status(500).send("Internal server error");
  }
});

router.get("/list/:UserId?", async (request, response) => {
  try {
    const UserId = request.params.UserId;
    if (request.user.UserID) {
      if (UserId) {
        const users = await User.findOne({
          $and: [{ RoleID: request.user.RoleID }, { UserID: UserId }],
        });
        response.status(200).json(users);
      } else {
        const users = await User.find({
          RoleID: Roles.USER,
        });
        response.status(200).json(users);
      }
    } else {
      response.status(404).send("No users available");
    }
  } catch (error) {
    response.status(500).send("Internal server error");
  }
});

router.get("/adminlist/:UserId?", async (request, response) => {
  try {
    const UserId = request.params.UserId;
    if (request.user.UserID) {
      if (UserId) {
        const users = await User.findOne({
          $and: [{ RoleID: request.user.RoleID }, { UserID: UserId }],
        });
        response.status(200).json(users);
      } else {
        const users = await User.find({
          RoleID: Roles.ADMIN,
        });
        response.status(200).json(users);
      }
    } else {
      response.status(404).send("No admins available");
    }
  } catch (error) {
    response.status(500).send("Internal server error");
  }
});

router.put("/update/:UserId", async (request, response) => {
  try {
    const UserId = request.params.UserId;
    const updatedUser = request.body;
    if (request.user.RoleID === 1) {
      // For admins, allow update any product
      const user = await User.findOneAndUpdate(
        { UserID: UserId },
        { $set: updatedUser },
        { new: true }
      );

      if (user) {
        response.status(200).json("Details updated successfully!");
      } else {
        response.status(404).send("User not found");
      }
    } else if (request.user.RoleID === 2) {
      // Assuming the UserProducts model has a UserId field

      const user = await User.findOneAndUpdate(
        {
          $and: [{ RoleID: request.user.RoleID }, { UserID: UserId }],
        },
        { $set: updatedUser },
        { new: true }
      );
      if (user) {
        response.status(200).json("Details updated successfully!");
      } else {
        response.status(404).send("User not found");
      }
    } else {
      response.status(403).send("Forbidden: Insufficient permissions");
    }
  } catch (error) {
    console.error("Update User error:", error);
    response.status(500).send("Internal server error");
  }
});

// Delete route
router.delete("/delete/:UserId", async (request, response) => {
  try {
    const UserId = request.params.UserId;
    const deletedUser = await User.findOneAndDelete({
      UserID: UserId,
    });

    if (deletedUser) {
      response.status(200).send("User deleted successfully");
    } else {
      response.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Delete User error:", error);
    response.status(500).send("Internal server error");
  }
});

connect()
  .then((connectedClient) => {
    client = connectedClient;

    console.log("Connected to MongoDB users router");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1); // Exit the application if the database connection fails
  });
module.exports = router;
