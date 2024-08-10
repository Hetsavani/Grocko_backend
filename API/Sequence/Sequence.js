const mongoose = require('mongoose');

const sequenceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seed_sequence_value: { type: Number, default: 101 },
  vendor_sequence_value: { type: Number, default: 1 },
  inventory_sequence_value: { type: Number, default:1},
  order_sequence_value: { type: Number, default: 11111 }, 
});

const Sequence = mongoose.model('Sequence', sequenceSchema);

module.exports = Sequence;
