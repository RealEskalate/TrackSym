const mongoose = require("mongoose");

const patientLogSchema = new mongoose.Schema({
    count:{
        type:Number,
        required: true,
        default: 1
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    test_status:{
        type: String,
        enum: ["TestCount","Confirmed","Recovered","Died"],
        index: true
    },

});


const PatientLog = mongoose.model("PatientLog", patientLogSchema);
exports.PatientLog = PatientLog;



// ----------- demo ------


const patientLogSchemaDemo = new mongoose.Schema({
    count:{
        type:Number,
        required: true,
        default: 1
    },
    date: {
        type: Date,
        required: true,
        index: true
    },
    test_status:{
        type: String,
        default: "New",
        index: true
    },

});


const PatientLogDemo = mongoose.model("PatientLogDemo", patientLogSchemaDemo);
exports.PatientLogDemo = PatientLogDemo;