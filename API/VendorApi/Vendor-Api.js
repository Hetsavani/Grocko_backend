const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sequence = require('../Sequence/Sequence');

const VendorSchema = new mongoose.Schema({
    Vendor_id: { type: Number, index: true, unique: true },
    Vendor_name: String,
    Contact_info: String,
    Location: String,
  });

  VendorSchema.pre('save', function (next) {
    const Vendor = this;
    Sequence.findByIdAndUpdate(
      { _id: 'Vendorid' },
      { $inc: { vendor_sequence_value: 1 } },
      { new: true, upsert: true }
    )
      .then((sequence) => {
        Vendor.Vendor_id = sequence.vendor_sequence_value;
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
  const Vendormodel = mongoose.model('Vendor-Api', VendorSchema);
  router.use(express.json());
  router.get('/Vendor',async (req, res) => {
    const Vendor = await Vendormodel.find();
        res.send(Vendor);
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