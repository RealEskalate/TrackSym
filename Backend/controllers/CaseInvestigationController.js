const CaseInvestigationModels = require("../models/CaseInvestigation.js");
const mongoose = require("mongoose")
const _ = require("lodash");
const PatientModels = require("../models/Patient.js");
const SymptomUserModels = require("../models/SymptomUser");
const UserModels = require("../models/UserModel.js");


// Fetch all case investigations, with filters if any
exports.getCaseInvestigations = async (req, res) => {
    var { CaseInvestigation, Name_, Name } = demo_or_real_db(req.query);
    const filter = build_filter(req.query);

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;
    try {
        const cases = await CaseInvestigation
            .find(filter, {}, { skip: page - 1, limit: size * 1 })
            .populate({ model: Name_ + 'User', path: 'user_id', select: '_id username', 
                populate: { model: 'Patient' + Name, path: "patient_info", select:"_id first_name last_name" } })
            .populate({ model: Name_ + 'User', path: 'assigned_to', select: '_id username' })
            .populate({ model: Name_ + 'User', path: 'notes.health_worker_id', select: '_id username' })
        const result = {
            data_count: cases.length,
            page_size: size,
            current_page: page,
            data: cases
        };
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

// Fetch a case investigation by id
exports.getCaseInvestigationById = async (req, res) => {
    var { CaseInvestigation, Name_, Name } = demo_or_real_db(req.query);
    const { id } = req.params;
    try {
        const result = await CaseInvestigation
            .find({ _id: id })
            .populate({ model: Name_ + 'User', path: 'user_id', select: '_id username', 
                populate: { model: 'Patient' + Name, path: "patient_info" } })
            .populate({ model: Name_ + 'User', path: 'assigned_to', select: '_id username' })
            .populate({ model: Name_ + 'User', path: 'notes.health_worker_id', select: '_id username' })
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

const datesAreOnSameDay = (first, second) =>
    first.getFullYear() === second.getFullYear() &&
    first.getMonth() === second.getMonth() &&
    first.getDate() === second.getDate();
 
// Update or add a case investigation
exports.addOrUpdateCaseInvestigation = async (req, res) => {
    var { CaseInvestigation } = demo_or_real_db(req.query);
    const id = req.query.id || null;
    try {
        const investigation = await CaseInvestigation.findById(id);
        if (!investigation) {
            const investigation = new CaseInvestigation(_.pick(req.body, ["user_id", "assigned_to"]));
            investigation._id = mongoose.Types.ObjectId();
            investigation.current_note = {
                date : new Date(),
                note : req.body.current_note,
            };
            investigation.notes = [];            
            await investigation.save();
            return res.status(201).send(investigation);
        }
        investigation.notes = req.body.notes || investigation.notes;
        if (req.body.current_note) {
            //If the current note currently saved is on a different date, add it to the previous notes
            if (!datesAreOnSameDay(investigation.current_note.date, new Date(Date.now))) {
                investigation.notes.push({
                    health_worker_id: investigation.assigned_to,
                    date: investigation.current_note.date,
                    note: investigation.current_note.note
                })
            }
            //Replace current note
            investigation.current_note = {
                date: new Date(),
                note: req.body.current_note,
            };
        }
        investigation.user_id = req.body.user_id || investigation.patient_id;
        investigation.assigned_to = req.body.assigned_to || investigation.assigned_to;
        investigation.markModified("current_note");
        investigation.markModified("notes");
        await investigation.save();
        return res.send(investigation)
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}

// Delete case investigation
exports.deleteCaseInvestigation = async (req, res) => {
    var { CaseInvestigation } = demo_or_real_db(req.query);
    const { id } = req.params;
    try {
        const investigation = await CaseInvestigation.findById(id);
        if (!investigation) {
            return res.status(404).send('The case investigation does not exist');
        }
        await investigation.remove();
        return res.send(investigation);
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}

exports.get_patients_by_status = async (req, res) => {
    var { Patient } = demo_or_real_db(req.query);

    const filter = {};
    if (req.query.status){
        filter.status = status;
    }
    const { assignee } = req.query;

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;
    try {
        const patientIds = await find_patients_from_case_investigations(assignee, req.query);
        filter._id = { $in: patientIds };
        const patients = await Patient.find(filter, {}, { skip: page - 1, limit: size * 1 });

        const result = {
            data_count: patients.length,
            page_size: size,
            current_page: page,
            data: patients
        };
        return res.status(200).send(result);
    } catch (error) {
        return res.status(500).send(error.toString());
    }
}


exports.get_count_per_status = async (req, res) =>{
    var { Patient } = demo_or_real_db(req.query);

    let assigned_to = req.query.assigned_to;
    if (!assigned_to){
        return res.status(400).send("Health care worker not sent")
    }

    const patientIds = await find_patients_from_case_investigations(assigned_to, req.query) 
    const patients = await Patient.find({_id: { $in: patientIds }});

    let result = {
        total: { count: 0, change: 0 },
        Unknown: { count: 0, change: 0 },
        Recovered: { count: 0, change: 0},
        Confirmed: { count: 0, change: 0},
        Died: { count: 0, change: 0 }
    };
    await count_patient_by_status(patients, result, req.query);
    res.send(result);
}


exports.getAssigedHealthWorkersByPatientId = async (req, res) => {
    var { CaseInvestigation, Name_ } = demo_or_real_db(req.query);
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;

    try {
        const investigations = await CaseInvestigation
            .find({ patient_id: req.params.id }, {}, { skip: page - 1, limit: size * 1 })
            .select("notes assigned_to -_id")
            .sort({ "updated_at": -1 })
            .populate({ model: Name_ + 'User', path: 'assigned_to', select: '_id username' })
            .populate({ model: Name_ + 'User', path: 'notes.health_worker_id', select: '_id username' });
            
        const result = {
            data_count: investigations.length,
            page_size: size,
            current_page: page,
            data: investigations
        };
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

// check if demo=true in request
function demo_or_real_db (query){
    if (query.demo && query.demo == "true"){
        return {
            Patient: PatientModels.PatientDemo,
            SymptomUser: SymptomUserModels.DemoSymptomUser,
            User: UserModels.DemoUser,
            CaseInvestigation: CaseInvestigationModels.CaseInvestigationDemo,
            Name: "Demo", // for populate queries
            Name_: "Demo " // with space 
        }
    } else {
        return {
            Patient: PatientModels.Patient,
            SymptomUser: SymptomUserModels.SymptomUser,
            User: UserModels.User,
            CaseInvestigation: CaseInvestigationModels.CaseInvestigation,
            Name: "",
            Name_: ""
        }
    }
}
function build_filter(query){
    let filter = {};
    if (query.patient) {
        filter.patient_id = query.patient;
    }
    if (query.assignee) {
        filter.assigned_to = query.assignee;
    }
    if (query.assigned) {
        filter.assigned_to = query.assigned ? { $ne: null } : { $eq: null }
    }
    return filter
}
async function find_patients_from_case_investigations(assigned_to, demo_data_query) {
    var { CaseInvestigation, User } = demo_or_real_db(demo_data_query);
    const userIds = (await CaseInvestigation.find({ assigned_to: assigned_to }))
                        .map(investigation => investigation.user_id)
    const patientIds = (await User.find({_id: {$in: userIds}}))
                        .map(user => user.patient_info)
    return patientIds;
}
async function count_patient_by_status(patients, output, demo_data_query){
    var { SymptomUser } = demo_or_real_db(demo_data_query);
    patients.forEach(patient => { 
        if(!(patient.status in output) ){
            output[ patient.status ] = {
                count: 0, 
                change: 0
            };
        }

        // check if update happened in the last 24 hours
        if ((new Date()) - patient.updated_at <= (1000 * 3600 * 24)){
            output[ patient.status ].change += 1
            output.total.change += 1;
        }
        output[ patient.status ].count += 1
        output.total.count += 1;
    });
    
    // count number of unique users with symptoms
    output.active_symptoms = (await SymptomUser.aggregate([
        {$match: {user_id: {$in: userIds}}},
        {$group: {_id: '$user_id'}},
        {$count: "count"}
    ]))[0];
    if (!output.active_symptoms){
        output.active_symptoms = { count: 0 };
    }
}