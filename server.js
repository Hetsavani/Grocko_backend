const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

// Import the TransportRequest model
const TransportRequest = require("./models/TransportRequest");

const app = express();
const port = 3000;

// Middleware
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
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  // Store passwords in plaintext (not recommended for production)
  users.push({ username, password });

  res.status(201).json({ message: "User registered successfully" });
});

// Login endpoint
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  const user = users.find((user) => user.username === username);
  if (!user || user.password !== password) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  res.status(200).json({ message: "User Found successfully" });
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

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
