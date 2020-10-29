const { Patient } = require("../models/Patient.js");
var mongoose = require("mongoose");
const { User } = require("../models/UserModel");
const { PatientLog } = require("../models/PatientLog.js");

// ### helper methods

// link user with patient...
let link_patient_with_user = async (patient, req, res) =>{
    let filter;
    if (patient.email && patient.phone_number){
        filter = {$or:[{email:patient.email},{phone_number:patient.phone_number}]};
    } else if (patient.email){
        filter = {email:patient.email};
    } else if (patient.phone_number){
        filter = {phone_number:patient.phone_number}
    } else {
        filter = {_id: null} //returns null on User
    }
    let user = await User.findOne(filter);
    if(!user){
        let unusedUsername = `${patient.first_name}-${patient.last_name}-${Date.now().toString().substring(6, 13)}`;
        let foundUser = await User.findOne({username: unusedUsername});
        while (foundUser){
            unusedUsername = `${patient.first_name}-${patient.last_name}-${Date.now().toString().substring(6, 13)}`;
            foundUser = await User.findOne({username: unusedUsername});
        }
        user = new User({
            _id: mongoose.Types.ObjectId(),
            username: unusedUsername,
            password:`pswod-${Math.random()}`,
            gender:patient.gender,
            email:patient.email,
            created_by:req.body.loggedInUser,
            patient_info:patient._id,
            phone_number:patient.phone_number
        })

        try {
            await user.save();
            patient.user_id = user._id;
            await patient.save();
            
            return res.send(user)
        } catch (err){
            return res.status(500).send(err.toString());
        }
    } 

    else if(user.patient_info){
        return res.status(422).send({'message':' a patient exists with the given phone number or email.'})
    }

    user.patient_info = patient._id;
    await user.save()

    patient.user_id = user._id;
    await patient.save();

    return res.send(user)
}


// check for daily duplicate log and update the log.
let check_and_update_log = async (oldData, patient) =>{
    let date = new Date();
    date.setHours(0,0,0,0);

    if(oldData && oldData.status != 'Unknown'){
        let prev = new Date(oldData.updated_at)
        prev.setHours(0,0,0,0);
    
        if(prev == date){
            let log =await PatientLog.findOne({date:prev,test_status:oldData.status});
            log.count -= 1
            await log.save();
        }
    }

    if(patient && patient.status != 'Unknown'){

        let log =await PatientLog.findOne({date:date,test_status:patient.status});

        if(log){
            log.count+=1;
            await log.save();
        }else{
            await new PatientLog({test_status:patient.status, date: date}).save();
        }
    }
    
}



// getting all patients
exports.get_all_patients = async (req, res) => {
    let filter = {};

    if(req.query.user_id){
        filter.user_id = req.query.user_id;
    }

    if(req.query.name){
        let re = new RegExp(req.query.name, 'i') 
        Object.assign(filter,
            {$or:[
                {first_name : { $regex: re }},
                {last_name : { $regex: re }}
            ]}
        );
    }

    if(req.query.phone_number){
        filter.phone_number = req.query.phone_number;
    }

    if(req.query.language){
        filter.language = req.query.language;
    }

    if(req.query.gender){
        filter.gender = req.query.gender;
    }

    if(req.query.location){
        let re = new RegExp(req.query.location, 'i') 

        Object.assign(filter,
            {$or:[
                {woreda : { $regex: re }},
                {street_address : { $regex: re }},
                {city : { $regex: re }},
                {state : { $regex: re }}
            ]}
        );
    }

    if(req.query.below_age){
        let date = new Date(2020,0,1);
        date.setFullYear(date.getFullYear() - req.query.below_age )
        filter.dob = {$gte : date}
    }

    if(req.query.above_age){
        let date = new Date(2020,11,31);
        date.setFullYear(date.getFullYear() - req.query.above_age )
        filter.dob = {$lte : date}
    }

    if(req.query.sms_status!=undefined){
        filter.sms_status = req.query.sms_status
    }

    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    const patients = await Patient.find(
        filter,{},
        { skip: (page - 1) * size, limit: size * 1 }
    ).populate("user_id");

    let result = {
        data_count: await Patient.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: patients,
    };

    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

// get single patient
exports.get_patient_by_id = async(req,res) => {
    const patient = await Patient.findById(req.params.id);

    try {
        return res.send(patient);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};

// Post a patient
exports.post_patient_data = async (req, res) => {
    const patient = new Patient(req.body);
    patient._id= mongoose.Types.ObjectId();

    //----- updating patient log ----//
    await check_and_update_log(null,patient)
    //----- end updating patient log ----//

    try {
        return link_patient_with_user(patient, req, res) 
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};



// update a patient
exports.update_patient = async (req, res) => {
    try {
        let oldData = await Patient.findById(req.params.id);
        let patient = await Patient.updateOne({ _id: mongoose.Types.ObjectId(req.params.id) },req.body);
        patient = await Patient.findById(req.params.id);


        //---- patient log ------ //
        await  check_and_update_log(oldData,patient);
        //----- end updating patient log ----//

        
        // history
        if( patient.status != oldData.status && oldData.updated_at != patient.updated_at ){
            patient.history.push({
                start_date:oldData.updated_at,
                end_date:patient.updated_at,
                status:oldData.status,
            })
            patient.save();
        }
        
        return res.status(202).send(patient);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// Deleting a patient
exports.delete_patient = async (req, res) => {

    try {
        const patient = await Patient.findById(req.params.id);
        await Patient.findByIdAndRemove(req.params.id);

        //---- remove if there is daily patient log ------ //
        let tmp = patient.status
        patient.status = 'Unknown'

        await  check_and_update_log(patient,null);
        
        patient.status = tmp
        // ---------- //


        // unlink with a user.....
        if(patient.user_id){
            let user = await User.findById(patient.user_id);
            user.patient_info = null;
            await user.save();
        }


        if (!patient) {
            res.status(404).send("Patient doesnt exist!");
        } else {
            res.status(204).send(patient);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};