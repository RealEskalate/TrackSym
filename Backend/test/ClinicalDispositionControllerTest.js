process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { ClinicalDisposition } = require("../models/ClinicalDisposition");
let { Interview } = require("../models/InterviewModel");
let { Patient } = require("../models/Patient");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Clinical Disposition API", () => {
  let healthcare_worker;
  let patient;
  let clinical_disposition;
  let interview;
  let tokens;

  
  beforeEach(async () => {
    healthcare_worker = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ephi ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      role: "ephi_user",
      age_group: "21-30",
    });

    await healthcare_worker.save();

    try {
        jwt.sign({ user:healthcare_worker }, process.env.APP_SECRET_KEY, (err, token) => {
          tokens = token;
        });
    } catch (err) {
        console.log("ERROR " + err.toString());
    }

    patient = new Patient({
        _id: mongoose.Types.ObjectId(),
        first_name: "Darth",
        last_name: "Vader",
        dob: new Date('May 25, 1977'),
        phone_number: "+25189028392",
        language: "English",
        gender: "MALE",
        woreda: "Nefas Silk",
        street_address: "Jemo 2",
        city: "Addis Ababa",
        status: "Died",
        sms_status: true,
    })

    await patient.save();


    clinical_disposition = new ClinicalDisposition({
        _id: mongoose.Types.ObjectId(),
        patient_id: patient._id,
        interview_id: mongoose.Types.ObjectId(),
        disposition: "Pending",
        notes: "This is a test note..."
    })

    await clinical_disposition.save();

  });

  
  afterEach(async () => {
    await Patient.findByIdAndDelete(patient._id);
    await User.findByIdAndDelete(healthcare_worker._id);
    await ClinicalDisposition.findByIdAndDelete(clinical_disposition._id);
  });

  
  it("It should add a new Clinical disposition", async () => {
    let response = await chai
      .request(server)
      .post("/api/clinicalDisposition/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id:  patient._id,
        interview_id:  mongoose.Types.ObjectId(),
        disposition: "Pending",
        notes: "This is a test note...",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Clinical disposition", async () => {
    let response = await chai
      .request(server)
      .post("/api/clinicalDisposition/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id:  patient._id,
        interview_id:  mongoose.Types.ObjectId(),
        disposition: "Complete",
        notes: "This is a test note...",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });

  it("It should not add a new Clinical disposition", async () => {
    let response = await chai
      .request(server)
      .post("/api/clinicalDisposition/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        interview_id:  mongoose.Types.ObjectId(),
        notes: "This is a test note...",
      });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });


  it("It should not add a new Clinical disposition", async () => {
    let response = await chai
      .request(server)
      .post("/api/clinicalDisposition/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id:  patient._id,
        interview_id:  mongoose.Types.ObjectId(),
      });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });

  
  it("It should get a Clinical Disposition", async () => {
    let response = await chai
      .request(server)
      .get("/api/clinicalDisposition/")
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });

  
  it("It should update a Clinical Disposition", async () => {
    let response = await chai
      .request(server)
      .patch(`/api/clinicalDisposition/${clinical_disposition._id}`)
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id:  patient._id,
        interview_id:  mongoose.Types.ObjectId(),
        notes: "This is a test note...",
      });

    expect(response).to.have.status(202);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("interview_id");
  });


  it("It should delete Clinical Disposition", async () => {
    let response = await chai
      .request(server)
      .delete(`/api/clinicalDisposition/${clinical_disposition._id}`)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(204);
  });

});
