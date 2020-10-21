const mongoose = require("mongoose");

const testReportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    healthcare_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    test_status:{
        type: String,
        enum: ["Positive", "Negative","Not Tested"],
        default: "Not Tested"
    },
    patient_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Patient'
    }

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// --------demo shcema

const testReportSchemaDemo = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    healthcare_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    test_status:{
        type: String,
        enum: ["Positive", "Negative","Not Tested"],
        default: "Not Tested"
    },
    patient_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Patient'
    }

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



const TestReport = mongoose.model("TestReport", testReportSchema);
exports.TestReport = TestReport;

//------------------------------- demo 
const TestReportDemo = mongoose.model("TestReportDemo", testReportSchemaDemo);
exports.TestReportDemo = TestReportDemo;