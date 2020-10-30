const mongoose = require("mongoose");

const caseInvestigationSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    current_note: {
        date: {
            type: Date,
            required: true,
        },
        note:{
            type: String,
            required: true,
        }
    },
    notes: [{
        health_worker_id: {
            required: true,
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            required: true,
        },
        note:{
            type: String,
            required: true,
        }
    }],

},
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
    });

const caseInvestigationSchemaDemo = new mongoose.Schema({
        _id: mongoose.Schema.Types.ObjectId,
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Demo User'
        },
        assigned_to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Demo User'
        },
        current_note: {
            date: {
                type: Date,
                required: true,
            },
            note:{
                type: String,
                required: true,
            }
        },
        notes: [{
            health_worker_id: {
                required: true,
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Demo User'
            },
            date: {
                type: Date,
                required: true,
            },
            note:{
                type: String,
                required: true,
            }
        }],
    
    },
        {
            timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
        });
    

const CaseInvestigation = mongoose.model("CaseInvestigation", caseInvestigationSchema);
const CaseInvestigationDemo = mongoose.model("CaseInvestigationDemo", caseInvestigationSchemaDemo);
exports.CaseInvestigation = CaseInvestigation;
exports.CaseInvestigationDemo = CaseInvestigationDemo
