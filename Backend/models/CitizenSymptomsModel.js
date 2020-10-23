const mongoose = require("mongoose");

const citizenSymptomsSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
        index: true,
        unique: true,
    },
    total: {
        type: Number,
        required: true,
    },
},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});
const CitizenSymptoms = mongoose.model(
    "CitizenSymptoms",
    citizenSymptomsSchema
);
module.exports = CitizenSymptoms;
