const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sequence = require('../Sequence/Sequence');

const SeedSchema = new mongoose.Schema({
    Seed_id: { type: Number, index: true, unique: true },
    Seed_name: String,
    Seed_type: String,
    Quality_grade: String,
    Price_per_unit: Number,
  });

  SeedSchema.pre('save', function (next) {
    const seed = this;
    Sequence.findByIdAndUpdate(
      { _id: 'seedid' },
      { $inc: { seed_sequence_value: 1 } },
      { new: true, upsert: true }
    )
      .then((sequence) => {
        seed.Seed_id = sequence.seed_sequence_value;
        next();
      })
      .catch((error) => {
        next(error);
      });
  });
  const seedmodel = mongoose.model('Seed-Api', SeedSchema);
  router.use(express.json());
  router.get('/seed/:id', async (req, res) => {
    try {
        const seed = await seedmodel.findOne({ Seed_id: req.params.id });
        if (!seed) {
            return res.status(404).send({ message: 'Seed not found' });
        }
        res.send(seed);
    } catch (error) {
        res.status(500).send(error);
    }
});
  router.get('/seed',async (req, res) => {
    const seed = await seedmodel.find();
        res.send(seed);
  });
  
//   router.post('/seed',async (req, res) => {
//     console.log(req.body);
//     const admin = new adminmodel({
//         Admin_name:req.body.username,
//         Admin_password:req.body.password
//     });
//     await admin.save();
//     res.send(admin);
//   });

  module.exports = router;