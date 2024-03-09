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
      response.status(200).send(token);
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
    request.body.RoleID = Roles.USER;
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
      response.status(200).send(token);
    }
  } catch (error) {
    console.error("Signup error:", error);
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
