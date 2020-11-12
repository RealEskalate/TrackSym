const mongoose = require("mongoose");

const testReportSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
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

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});



const TestReport = mongoose.model("TestReport", testReportSchema);
exports.TestReport = TestReport;


const testReportSchemaDemo = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Demo User'
    },
    healthcare_worker_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Demo User'
    },
    test_status:{
        type: String,
        enum: ["Positive", "Negative","Not Tested"],
        default: "Not Tested"
    },

},
{
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});


const TestReportDemo = mongoose.model("TestReportDemo2", testReportSchemaDemo);
exports.TestReportDemo = TestReportDemo;