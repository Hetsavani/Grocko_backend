const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

// Import the TransportRequest and User models
const TransportRequest = require("./models/TransportRequest");
const User = require("./models/User");

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Register endpoint
app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ username, password }); // Hash password before saving in production
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      // Compare hashed password in production
      return res.status(401).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "User found successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create transport request endpoint
app.post("/transport-request", async (req, res) => {
  try {
    const { cropType, weight, pickupLocation, dropLocation } = req.body;
    if (!cropType || !weight || !pickupLocation || !dropLocation) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new TransportRequest({
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

// Update transport request endpoint (Accept/Reject)
app.put("/transport-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, estimatedPickupTime, bill } = req.body;

    if (!status || !["accepted", "rejected"].includes(status)) {
      return res.status(400).json({
        message: "Status is required and must be 'accepted' or 'rejected'",
      });
    }

    const updatedRequest = await TransportRequest.findByIdAndUpdate(
      id,
      { status, estimatedPickupTime, bill },
      { new: true }
    );

    if (!updatedRequest) {
      return res.status(404).json({ message: "Transport request not found" });
    }

    res.status(200).json({
      message: "Transport request updated successfully",
      request: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch all transport requests
app.get("/transport-requests", async (req, res) => {
  try {
    const requests = await TransportRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Fetch a single transport request by ID
app.get("/transport-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const request = await TransportRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Transport request not found" });
    }
    res.status(200).json(request);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete a transport request by ID
app.delete("/transport-request/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRequest = await TransportRequest.findByIdAndDelete(id);
    if (!deletedRequest) {
      return res.status(404).json({ message: "Transport request not found" });
    }
    res.status(200).json({ message: "Transport request deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
