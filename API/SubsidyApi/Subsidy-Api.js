const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Sequence = require('../Sequence/Sequence');

const SubsidySchema = new mongoose.Schema({
    subsidy_id: { type: Number, index: true, unique: true },
    subsidy_name: String,
    description: String,
    subsidy_type: String,
    amount: Number,
    currency: String,
    duration: {
        start_date: Date,
        end_date: Date
    },
    eligibility_criteria: String,
    application_procedure: String,
});

// Auto-increment `subsidy_id` before saving
SubsidySchema.pre('save', function (next) {
    const subsidy = this;
    Sequence.findByIdAndUpdate(
        { _id: 'subsidyid' },
        { $inc: { subsidy_sequence_value: 1 } },
        { new: true, upsert: true }
    )
        .then((sequence) => {
            subsidy.subsidy_id = sequence.subsidy_sequence_value;
            next();
        })
        .catch((error) => {
            next(error);
        });
});

const subsidyModel = mongoose.model('Subsidy-Api', SubsidySchema);

router.use(express.json());

// Get a specific subsidy by ID
router.get('/subsidy/:id', async (req, res) => {
    try {
        const subsidy = await subsidyModel.findOne({ subsidy_id: req.params.id });
        if (!subsidy) {
            return res.status(404).send({ message: 'Subsidy not found' });
        }
        res.send(subsidy);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Get all subsidies
router.get('/subsidy', async (req, res) => {
    try {
        const subsidies = await subsidyModel.find();
        res.send(subsidies);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Add a new subsidy
router.post('/subsidy', async (req, res) => {
    try {
        const subsidy = new subsidyModel({
            subsidy_name: req.body.subsidy_name,
            description: req.body.description,
            subsidy_type: req.body.subsidy_type,
            amount: req.body.amount,
            currency: req.body.currency,
            duration: {
                start_date: req.body.start_date,
                end_date: req.body.end_date
            },
            eligibility_criteria: req.body.eligibility_criteria,
            application_procedure: req.body.application_procedure,
        });

        await subsidy.save();
        res.send(subsidy);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
