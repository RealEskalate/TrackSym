const TestReportModels = require("../models/TestReportModel.js");
var mongoose = require("mongoose");
var UserModels = require("../models/UserModel.js");
const User = UserModels.User;
const PatientLogModels = require("../models/PatientLog.js");
const PatientModels = require("../models/Patient.js");

// ### helper methods
// check if demo=true in request
let demo_or_real_db = (query) => {
    if (query.demo && query.demo == "true"){
        return {
            Patient: PatientModels.PatientDemo,
            PatientLog: PatientLogModels.PatientLogDemo,
            User: UserModels.DemoUser,
            TestReport: TestReportModels.TestReportDemo
        }
    } else {
        return {
            Patient: PatientModels.Patient,
            PatientLog: PatientLogModels.PatientLog,
            User: UserModels.User,
            TestReport: TestReportModels.TestReport
        }
    }
}
// check for daily duplicate log and update the log.
let check_and_update_log = async (report, req) =>{
    var { User, Patient, PatientLog } = demo_or_real_db(req.query);
    let date = new Date();
    let status= {'Negative':'TestCount','Positive':'Confirmed'}
    date.setHours(0,0,0,0);

    let user = await User.findById(report.user_id);
    
    if(user && user.patient_info){
        let patient = await Patient.findById(user.patient_info)

        let prev_date = new Date(patient.updated_at)
        prev_date.setHours(0,0,0,0);

        if(prev_date == date){
            let log =await PatientLog.findOne({date:prev_date,test_status:patient.status});
            log.count -= 1
            await log.save();
        }


        if (report && report.test_status == 'Positive'){
            patient.status = 'Confirmed'
            await patient.save();
        }
    }

    if (report.test_status != 'Not Tested'){
        // update log.
        let log =await PatientLog.findOne({date:date,test_status: status[report.test_status]});

        if(log){
            log.count+=1;
            await log.save();
        }else{
            await new PatientLog({ test_status:'Confirmed', date: date}).save();
        }
    }
}




// getting all test reports
exports.get_all_test_reports = async (req, res) => {
    var { User, TestReport } = demo_or_real_db(req.query)
    let filter = {};

    if(req.query.user_id){
        filter.user_id = req.query.user_id;
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


    if(req.query.username){
        let re = new RegExp(req.query.username, 'i') 
        let userId =await User.find({username : { $regex: re }}).select('_id')

        let listOfUserId = [];

        for(var user_id in userId){
            listOfUserId.push(userId[user_id]._id)
        }
        filter.user_id= { $in: listOfUserId };
    }



    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;

    const testReports = await TestReport.find(
        filter,{},
        { skip: (page - 1) * size, limit: size * 1 }
    ).populate("user_id").populate("healthcare_worker_id");

    let result = {
        data_count: await TestReport.countDocuments(filter),
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
    var { TestReport } = demo_or_real_db(req.query);
    let reporter_id=req.body.loggedInUser

    const report = new TestReport({
        _id: mongoose.Types.ObjectId(),
        user_id: req.body.user_id,
        healthcare_worker_id: reporter_id,
        test_status: req.body.test_status
    });

    try {
        await report.save();
        
        //------ updating logs --- //
        await check_and_update_log(report, req)
        //------ end of updating logs --- //

        return res.send(report);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// update a test report
exports.update_test_report = async (req, res) => {
    var { TestReport } = demo_or_real_db(req.query);
    try {
        const report = await TestReport.findById(req.body.test_id);

        //------ updating logs --- //
        await check_and_update_log(report, req)
        //------ end of updating logs --- //

        report.test_status = req.body.test_status
        await report.save();
        
        return res.status(202).send(report);
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};


// Deleting a test report
exports.delete_test_report = async (req, res) => {
    var { TestReport } = demo_or_real_db(req.query);
    try {
        const report = await TestReport.findById(req.params.id);
        if (!report) {
            res.status(404).send("Report doesnt exist!");
        } else {

            await TestReport.findByIdAndRemove(req.params.id);

            //------ updating logs --- //
            let tmp = report.test_status
            report.test_status = 'Not Tested'

            await check_and_update_log(report, req)
            
            report.test_status =tmp
            //------ end of updating logs --- //

            res.status(204).send(report);
        }
    } catch (err) {
        res.status(500).send(err.toString());
    }
};