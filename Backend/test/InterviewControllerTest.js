process.env.NODE_ENV = "test";
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const jwt = require("jsonwebtoken");

let { User } = require("../models/UserModel");
let { Interview } = require("../models/InterviewModel");
let { Patient } = require("../models/Patient");
let { TestReport } = require("../models/TestReportModel");
let { Symptom } = require("../models/Symptom");

let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Interview API", () => {
    let interview_id;
    let patient;
    let user_interviewer;
    let user_patient;
    let tokens_interviewer;
    let tokens_patient;
    let test_report;
    let symptom_1;
    let symptom_2;
    beforeEach(async () => {
        user_interviewer = new User({
            _id: mongoose.Types.ObjectId(),
            username: `${Date.now().toString()} ${Math.random()}`,
            password:
                "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
            gender: "FEMALE",
            age_group: "21-30",
        });
        try {
            jwt.sign(
                { user: user_interviewer },
                process.env.APP_SECRET_KEY,
                (err, token) => {
                    tokens_interviewer = token;
                }
            );
        } catch (err) {
            // console.log("ERROR " + err.toString());
        }
        await user_interviewer.save();

        user_patient = new User({
            _id: mongoose.Types.ObjectId(),
            username: `${Date.now().toString()} ${Math.random()}`,
            password:
                "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
            gender: "FEMALE",
            age_group: "21-30",
        });

        symptom_1 = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: "Fever",
            description: "High Temperature",
        });
        await symptom_1.save();

        symptom_2 = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: "Cold",
            description: "Low Temperature",
        });
        await symptom_2.save();

        patient = new Patient({
            _id: mongoose.Types.ObjectId(),
            user_id: user_patient._id,
            first_name: "Abebe",
            last_name: "Kebede",
            dob: new Date(Date.now()),
            phone_number: "091122334456",
            language: "English",
            gender: "MALE",
            woreda: "010",
            street_address: "Kenya Street",
            city: "Addis Ababa",
            state: "Addis Ababa",
            sms_status: false,
            status: "New",
            history: [],
            emergency_contact: {
                first_name: "Test_FirstName",
                last_name: "Test_LastName",
                relationship: "Siblings",
                city: "Addis Ababa",
                state: "Addis Ababa",
                phone_number: "091122334455",
            },
        });

        user_patient.patient_info = patient._id;
        await patient.save();
        await user_patient.save();

        test_report = new TestReport({
            _id: mongoose.Types.ObjectId(),
            user_id: user_patient._id,
            healthcare_worker_id: user_interviewer._id,
            test_status: "Positive",
        });
        await test_report.save();
    });
    afterEach(async () => {
        await User.findByIdAndDelete(user_interviewer._id);
        await User.findByIdAndDelete(user_patient._id);
        await Symptom.findByIdAndDelete(symptom_1._id);
        await Symptom.findByIdAndDelete(symptom_2._id);
        await Patient.findByIdAndDelete(patient._id);
        await TestReport.findByIdAndDelete(test_report._id);
        await Interview.findByIdAndDelete(interview_id);
    });

    it("It should save a new interview record", async () => {
        let response = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        expect(response).to.have.status(201);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("user_id");
        interview_id = response.body._id;
    });
    it("It should not save a new interview record", async () => {
        let response = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        expect(response).to.have.status(422);
        expect(response.body).to.be.a("object");
    });


    it("It should not save a new interview record", async () => {
        let response = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
            });
        expect(response).to.have.status(422);
        expect(response.body).to.be.a("object");
    });

    it("It should not save a new interview record", async () => {
        let response = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        expect(response).to.have.status(422);
        expect(response.body).to.be.a("object");
    });

    it("It should not save a new interview record", async () => {
        let response = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        expect(response).to.have.status(422);
        expect(response.body).to.be.a("object");
    });

    it("It should fetch all interview records", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        let response = await chai
            .request(server)
            .get("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer);
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("current_page");
        interview_id = save_interview.body._id;
    });
    it("It should not fetch interview records", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        let response = await chai
            .request(server)
            .get("/api/interviews")
            .set("Authorization", "Bearer " + mongoose.Types.ObjectId());
        expect(response).to.have.status(401);
        interview_id = save_interview.body._id;
    });

    it("It should fetch a specific interview record", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        let response = await chai
            .request(server)
            .get("/api/interviews/" + save_interview.body._id)
            .set("Authorization", "Bearer " + tokens_interviewer);
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
        expect(response.body).to.have.lengthOf(1);
        interview_id = save_interview.body._id;
    });
    it("It should not fetch a specific interview record", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        let response = await chai
            .request(server)
            .get("/api/interviews/" + mongoose.Types.ObjectId())
            .set("Authorization", "Bearer " + tokens_interviewer);
        expect(response).to.have.status(200);
        expect(response.body).to.have.lengthOf(0);
        interview_id = save_interview.body._id;
    });

    it("It should patch a specific interview record", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        save_interview.body.status.occupation = "CITY_WORKER";
        let response = await chai
            .request(server)
            .patch("/api/interviews/" + save_interview.body._id)
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send(save_interview.body);
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("user_id");
        interview_id = save_interview.body._id;
    });
    it("It should not patch a specific interview record", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        let response = await chai
            .request(server)
            .patch("/api/interviews/" + mongoose.Types.ObjectId())
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                status: {
                    occupation: "CITY_WORKER",
                },
            });
        expect(response).to.have.status(404);
        interview_id = save_interview.body._id;
    });

    it("It should delete a specific interview record", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        save_interview.body.status.occupation = "CITY_WORKER";
        let response = await chai
            .request(server)
            .delete("/api/interviews/" + save_interview.body._id)
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send(save_interview.body);
        expect(response).to.have.status(200);
        expect(response.body).to.be.a("object");
        expect(response.body).to.have.property("user_id");
        interview_id = save_interview.body._id;
    });
    it("It should not delete a specific interview record", async () => {
        let save_interview = await chai
            .request(server)
            .post("/api/interviews")
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                user_id: user_patient._id,
                clinical_review: true,
                completion_date: new Date(Date.now()),
                test_report: test_report._id,
                interview_report: {
                    interviewer_id: user_interviewer._id,
                    interview_date: new Date(Date.now()),
                    investigation_disposition: "INCARCERATED",
                    source: "CASE",
                },
                living_situation: {
                    situation_type: "SINGLE_FAMILY_HOME",
                    occupancy_count: 10,
                },
                status: {
                    occupation: "STUDENT",
                },
                clinical: {
                    recent_symptoms: [symptom_1._id, symptom_2._id],
                },
                work_informations: {
                    names: "Addis Ababa University, Black Bird Cafe",
                    addresses: "King Haileselassie Road, Mexico",
                },
                notes: "Slowly recovering patient",
            });
        let response = await chai
            .request(server)
            .delete("/api/interviews/" + mongoose.Types.ObjectId())
            .set("Authorization", "Bearer " + tokens_interviewer)
            .send({
                status: {
                    occupation: "CITY_WORKER",
                },
            });
        expect(response).to.have.status(404);
        interview_id = save_interview.body._id;
    });
});
