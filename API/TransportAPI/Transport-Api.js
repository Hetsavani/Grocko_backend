const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

// Define a schema for transport requests
const transportRequestSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  pickupLocation: {
    type: String,
    required: true,
  },
  dropLocation: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  estimatedPickupTime: {
    type: Date,
  },
  bill: {
    type: Number,
  },
});

const transportmodel = mongoose.model("Transport-Api", transportRequestSchema);
router.use(express.json());

// Fetch all transport requests
router.get("/transport-requests", async (req, res) => {
  try {
    const requests = await transportmodel.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch a single transport request by ID
router.get("/transport-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await transportmodel.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Transport request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a transport request by ID
router.delete("/transport-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await transportmodel.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Transport request not found" });
    }
    res.status(200).json({ message: "Transport request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create transport request endpoint
router.post("/transport-request", async (req, res) => {
  try {
    const { cropType, weight, pickupLocation, dropLocation } = req.body;
    if (!cropType || !weight || !pickupLocation || !dropLocation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new transportmodel({
      cropType,
      weight,
      pickupLocation,
      dropLocation,
    });

    await newRequest.save();
    res.status(201).json({
      message: "Transport request created successfully",
      request: newRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
