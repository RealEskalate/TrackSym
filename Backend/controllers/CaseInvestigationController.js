const { CaseInvestigation } = require("../models/CaseInvestigation.js");
const mongoose = require("mongoose")
const _ = require("lodash");
const { Patient } = require("../models/Patient.js");
const { SymptomUser } = require("../models/SymptomUser");

// Fetch all case investigations, with filters if any
exports.getCaseInvestigations = async (req, res) => {
    const filter = {};
    if (req.query.patient) {
        filter.patient_id = req.query.patient;
    }
    if (req.query.assignee) {
        filter.assigned_to = req.query.assignee;
    }
    if (req.query.assigned) {
        filter.assigned_to = req.query.assigned ? { $ne: null } : { $eq: null }
    }

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;
    try {
        const investigations = await CaseInvestigation.find(filter, {}, { skip: page - 1, limit: size * 1 });
        const populated = await CaseInvestigation.populate(investigations, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'User', path: 'assigned_to', select: '_id username' },
            { model: 'User', path: 'notes.health_worker_id', select: '_id username' },
        ]);
        const result = {
            data_count: await CaseInvestigation.countDocuments(filter),
            page_size: size,
            current_page: page,
            data: populated
        };
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}

// Fetch a case investigation by id
exports.getCaseInvestigationById = async (req, res) => {
    const { id } = req.params;
    try {
        const investigations = await CaseInvestigation.find({ _id: id });
        const result = await CaseInvestigation.populate(investigations, [
            { model: 'Patient', path: 'patient_id', select: '_id first_name last_name' },
            { model: 'User', path: 'assigned_to', select: '_id username' }
        ]);
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
    const id = req.query.id || null;
    try {
        const investigation = await CaseInvestigation.findById(id);
        if (!investigation) {
            const investigation = new CaseInvestigation(_.pick(req.body, ["patient_id", "assigned_to"]));
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
        investigation.patient_id = req.body.patient_id || investigation.patient_id;
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

    const { assignee } = req.query;
    const { status } = req.query;

    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;
    try {
        const selectedPatients = await CaseInvestigation.find({ assigned_to: mongoose.Types.ObjectId(assignee) })
        const patientIds = []

        for (var i = 0; i < selectedPatients.length; i++) {
            patientIds.push(selectedPatients[i].patient_id);
        }
        const filter = { status: status, _id: { $in: patientIds } };
        const patients = await Patient.find(filter, {}, { skip: page - 1, limit: size * 1 });

        const result = {
            data_count: await Patient.countDocuments(filter),
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
    if (!req.query.assigned_to){
        return res.status(400).send("Health care worker not sent")
    }
    let assigned_to = req.query.assigned_to;

    const selectedPatients = await CaseInvestigation.find({ assigned_to: assigned_to })
    const patientIds = [];
    const userIds = [];

    for (var i = 0; i < selectedPatients.length; i++) {
        patientIds.push(selectedPatients[i].patient_id);
    }


    const patients = await Patient.find({_id: { $in: patientIds }});

    let result = {
        total: {
            count: 0,
            change: 0
        }};

    for(var index in patients){

        if (patients[index].user_id){
            userIds.push(patients[index].user_id)
        }

        if(!(patients[index].status in result) ){
            result[ patients[index].status ] = {
                count: 0, 
                change: 0
            };
        }

        date = patients[index].updated_at;
        //check if update happened in the last 24 hours
        if ((new Date()) - date <= (1000 * 3600 * 24)){
            result[ patients[index].status ].change += 1
            result.total.change += 1;
        }
        result[ patients[index].status ].count += 1
        result.total.count += 1;
    }

    result.active_symptoms = (await SymptomUser.aggregate([
        {$match: {user_id: {$in: userIds}}},
        {$group: {_id: '$user_id'}},
        {$count: "count"}
    ]))[0];
 
    res.send(result);
}


exports.getAssigedHealthWorkersByPatientId = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const size = parseInt(req.query.size) || 15;

    try {
        const investigations = await CaseInvestigation
            .find({ patient_id: req.params.id }, {}, { skip: page - 1, limit: size * 1 })
            .select("notes assigned_to -_id")
            .sort({ "updated_at": -1 });
        const populated = await CaseInvestigation.populate(investigations, [
            { model: 'User', path: 'assigned_to', select: '_id username' },
            { model: 'User', path: 'notes.health_worker_id', select: '_id username' },
        ]);
        const result = {
            data_count: await CaseInvestigation.countDocuments({ patient_id: req.params.id }),
            page_size: size,
            current_page: page,
            data: populated
        };
        return res.send(result);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
}