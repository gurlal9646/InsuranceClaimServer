const express = require("express");

const router = express.Router();

const { connect } = require("../../utils/Database.js");

const { Claim } = require("../../utils/models/Claim.js");
const { v4: uuidv4 } = require("uuid");

router.post("/create", async (req, res) => {
  try {
    req.body.ClaimId = uuidv4();
    req.body.UserId = req.user.UserID;
    console.log(req.body);
    let dbResponse = await Claim.create(req.body);

    if (dbResponse._id) {
      res.status(200).send("Claim registered successfully.");
    }
  } catch (error) {
    console.error("Register Claim error:", error);
    res.status(500).send("Internal server error");
  }
});

router.get("/list", async (req, res) => {
  try {
    const userId = req.user.UserID;
    const roleId = req.user.RoleID;

    if (userId) {
      if (roleId === 2) {
        const claims = await Claim.find({ UserId: userId });
        res.status(200).json(claims);
      } else if (roleId === 1) {
        const claims = await Claim.find();
        res.status(200).json(claims);
      } else {
        console.log("No claims registered");
        res.status(404).send("User has no claims registered");
      }
    } else {
      console.log("User not found");
      res.status(404).send("User has no claims registered");
    }
  } catch (error) {
    console.error("Token not found:", error);
    res.status(500).send("Internal server error");
  }
});

// Search By ID
router.get("/:claimId", async (req, res) => {
  try {
    const claim = await Claim.findOne({ ClaimId: req.params.claimId });
    if (claim) {
      res.status(200).json(claim);
    } else {
      res.status(404).send("Claim not found");
    }
  } catch (error) {
    console.error("Get Claim by ID error:", error);
    res.status(500).send("Internal server error");
  }
});

// Update a claim by ID
router.put("/update/:ClaimId", async (request, response) => {
  try {
    const claimId = request.params.ClaimId;
    const updatedClaim = request.body;

    // For admins, allow updating any claim
    const claim = await Claim.findOneAndUpdate(
      { ClaimId: claimId },
      { $set: updatedClaim },
      { new: true }
    );

    if (claim) {
      response.status(200).json("Claim Successfully Updated!");
    } else {
      response.status(404).send("Claim not found");
    }
  } catch (error) {
    console.error("Update Claim error:", error);
    response.status(500).send("Internal server error");
  }
});

// Delete route for claims
router.delete("/delete/:ClaimId", async (request, response) => {
  try {
    const claimId = request.params.ClaimId;

    if (request.user.RoleID === 1) {
      // For admins, allow deletion of any claim
      const deletedClaim = await Claim.findOneAndDelete({
        ClaimId: claimId,
      });

      if (deletedClaim) {
        response.status(200).send("Claim deleted successfully");
      } else {
        response.status(404).send("Claim not found");
      }
    } else if (request.user.RoleID === 2) {
      // Assuming the Claim model has a UserId field
      const deletedClaim = await Claim.findOneAndDelete({
        $and: [{ UserId: request.user.UserID }, { ClaimId: claimId }],
      });

      if (deletedClaim) {
        response.status(200).send("Claim deleted successfully");
      } else {
        response.status(404).send("Claim not found");
      }
    } else {
      response.status(403).send("Forbidden: Insufficient permissions");
    }
  } catch (error) {
    console.error("Delete Claim error:", error);
    response.status(500).send("Internal server error");
  }
});

router.put("/updateClaimStatus/:ClaimId", async (request, response) => {
  try {
    const claimId = request.params.ClaimId;
    const updatedClaim = request.body;

    // For admins, allow updating any claim
    const claim = await Claim.findOneAndUpdate(
      { ClaimId: claimId },
      { $set: updatedClaim },
      { new: true }
    );

    if (claim) {
      response.status(200).json("Claim Status Successfully Updated!");
    } else {
      response.status(404).send("Claim not found");
    }
  } catch (error) {
    console.error("Update Claim error:", error);
    response.status(500).send("Internal server error");
  }
});

connect()
  .then((connectedClient) => {
    client = connectedClient;

    console.log("Connected to MongoDB UserClaim router");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);

    process.exit(1);
  });
module.exports = router;
