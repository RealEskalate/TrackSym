const { TestReport, TestReportDemo } = require("../models/TestReportModel.js");
var mongoose = require("mongoose");
var UserModels = require("../models/UserModel.js");
const User = UserModels.User;
const { PatientLog } = require("../models/PatientLog.js");
const { Patient } = require("../models/Patient.js");

// getting all test reports
exports.get_all_test_reports = async (req, res) => {
    let filter = {};

    if(req.query.patient_id){
        filter.patient_id = req.query.patient_id;
    }

    if(req.query.reporter_id){
        filter.healthcare_worker_id = req.query.reporter_id;
    }

    if(req.query.status){
        filter.test_status = req.query.status;
    }

    if(req.query.start_date){
        filter.created_at = {$gte : new Date(req.query.start_date)}
    }

    if(req.query.end_date){
        let date = new Date(req.query.end_date)
        date.setHours(23)

        if(filter.created_at!=undefined){
            Object.assign(filter.created_at, {$lte : date});
        }else{
            filter.created_at =  {$lte : date}
        }
    }


    if(req.query.name){
        let re = new RegExp(req.query.name, 'i') 
        
        let patientId =await Patient.find({
            $or:[ {first_name : { $regex: re }}, {last_name : { $regex: re }}]
        }).select('_id')

        let listOfPatients = [];
        for(var patient_id in patientId){
            listOfPatients.push(patientId[patient_id]._id)
        }

        filter.patient_id =  { $in: listOfPatients };
    }



    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    
    let TestReportModel = (req.query.demo) ? TestReportDemo : TestReport;
    const testReports = await TestReportModel.find(
        filter,{},
        { skip: (page - 1) * size, limit: size * 1 }
    ).populate("patient_id").populate("healthcare_worker_id");


    let result = {
        data_count: await TestReportModel.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: testReports,
    };

    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};


// Post a test report
exports.post_test_report = async (req, res) => {

    let reporter_id=req.body.loggedInUser

    const report = new TestReport({
        _id: mongoose.Types.ObjectId(),
        patient_id: req.body.patient_id,
        healthcare_worker_id: reporter_id,
        test_status: req.body.test_status
    });


    //------ saving updating logsfor test count  --- //
    let date = new Date();
    date.setHours(0,0,0,0);
    

    let log =await PatientLog.findOne({date:date,test_status:"TestCount"});

    if(log){
        log.count+=1;
        await log.save();
    }else{
        await new PatientLog({ test_status:"TestCount", date: date }).save();
    }
    //------ end of saving updating logsfor test count --- //

    
    //----- updating patient model and log ----//
    if(req.body.test_status == 'Positive'){

        let log =await PatientLog.findOne({date:date,test_status:"Positive"});

        if(log){
            log.count+=1;
            await log.save();
        }else{
            await new PatientLog({test_status:"Positive", date: date}).save();
        }

        let patient = await Patient.findOne(req.body.patient_id);
        patient.status = "Confirmed";
        await patient.save();

    }
    //----- end updating patient model and log ----//


    try {
        await report.save();
        return res.send(report);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// update a test report
exports.update_test_report = async (req, res) => {
    try {
        const report = await TestReport.findById(req.body.test_id);
        report.test_status = req.body.test_status
        await report.save();


        //----- updating patient model and log ----//
        let date = new Date();
        date.setHours(0,0,0,0);
        
        if(req.body.test_status == 'Positive'){

            let log =await PatientLog.findOne({date:date,test_status:"Confirmed"});

            if(log){
                log.count+=1;
                await log.save();
            }else{
                await new PatientLog({test_status:"Confirmed", date: date}).save();
            }

            let patient = await Patient.findOne(report.patient_id);

            patient.status = "Confirmed";
            await patient.save();

        }
        //----- end updating patient model and log ----//
        

        return res.status(202).send(report);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// Deleting a test report
exports.delete_test_report = async (req, res) => {

    try {
        const report = await TestReport.findByIdAndRemove(req.params.id);

        if (!report) {
            res.status(404).send("Report doesnt exist!");
        } else {

            //----- updating patient model and log ----//

            let date = new Date(report.created_at);
            date.setHours(0,0,0,0);

            let date_2 = new Date(report.update_at);
            date_2.setHours(0,0,0,0);
            
            
            let log =await PatientLog.findOne({date:date,test_status:"TestCount"});
            if(log){
                log.count-=1;
                await log.save();
            }
            
            //------------ patient log ----//
            if(req.body.test_status == 'Positive'){

                let log =await PatientLog.findOne({date:date_2,test_status:"Positive"});

                if(log){
                    log.count-=1;
                    await log.save();
                }

                let patient = await Patient.findOne(report.patient_id);
                patient.status = "Unknown";
                await patient.save();

            }
            //----- end updating patient model and log ----//



            res.status(204).send(report);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};