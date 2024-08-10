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

// Create a model for transport requests
const TransportRequest = mongoose.model(
  "TransportRequest",
  transportRequestSchema
);

module.exports = TransportRequest;
