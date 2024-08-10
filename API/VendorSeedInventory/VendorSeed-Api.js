const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sequence = require('../Sequence/Sequence');

const inventorySchema = new mongoose.Schema({
    inventory_id: { type: Number, unique: true, required: true },
    vendor_id: Number,
    seed_id: Number,
    stock_quantity: { type: Number, required: true },
    batch_number: { type: String, required: true },
    manufacture_date: { type: Date, required: true },
    expiry_date: { type: Date, required: true }
  }, { strictPopulate: false });

  inventorySchema.pre('save', function (next) {
    const inv = this;
    Sequence.findByIdAndUpdate(
      { _id: 'inventoryid' },
      { $inc: { inventory_sequence_value: 1 } },
      { new: true, upsert: true }
    )
      .then((sequence) => {
        inv.inventory_id = sequence.inventory_sequence_value;
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
  const inventorymodel = mongoose.model('VendorSeed-Api', inventorySchema);
  router.use(express.json());
  router.get('/inventory/:id', async (req, res) => {
    try {
        const inventory = await inventorymodel.findOne({ inventory_id: req.params.id })
            .populate('vendor_id') // Populate vendor details
            .populate('seed_id'); // Populate seed details

        if (!inventory) {
            return res.status(404).json({ message: 'Inventory not found' });
        }

        res.json(inventory);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
  router.get('/inventory',async (req, res) => {
    try {
        const inventories = await inventorymodel.find()
            .populate('vendor_id') // Populate vendor details
            .populate('seed_id'); // Populate seed details
        res.json(inventories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
  });
//   router.post('/Vendor',async (req, res) => {
//     console.log(req.body);
//     const admin = new adminmodel({
//         Admin_name:req.body.username,
//         Admin_password:req.body.password
//     });
//     await admin.save();
//     res.send(admin);
//   });

  module.exports = router;