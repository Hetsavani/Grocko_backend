const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sequence = require('../Sequence/Sequence');

// Define the Order schema
const OrderSchema = new mongoose.Schema({
    order_id: { type: Number, unique: true, required: true },
    vendor_id:  { type: Number, required: true },
    seed_id:  { type: Number, required: true },
    order_quantity: { type: Number, required: true },
    order_date: { type: Date, required: true },
    delivery_date: { type: Date, required: true },
    order_status: { type: String, required: true }
});

// Auto-increment order_id before saving
OrderSchema.pre('save', function (next) {
    const order = this;
    Sequence.findByIdAndUpdate(
        { _id: 'orderid' },
        { $inc: { order_sequence_value: 1 } },
        { new: true, upsert: true }
    )
    .then((sequence) => {
        order.order_id = sequence.order_sequence_value;
        next();
    })
    .catch((error) => {
        next(error);
    });
});

const OrderModel = mongoose.model('Order-Api', OrderSchema);

// Middleware
router.use(express.json());

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await OrderModel.find()
            .populate('vendor_id', 'Vendor_name')  // Populate vendor details
            .populate('seed_id', 'Seed_name')      // Populate seed details
            .exec();
        res.send(orders);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Create a new order
router.post('/orders', async (req, res) => {
    try {
        const newOrder = new OrderModel(req.body);
        await newOrder.save();
        res.status(201).send(newOrder);
    } catch (error) {
        res.status(400).send(error);
    }
});

module.exports = router;
