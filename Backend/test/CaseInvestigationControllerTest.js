process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { CaseInvestigation } = require("../models/CaseInvestigation");
let { Patient } = require("../models/Patient");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Case Investigation API", () => {
  let healthcare_worker;
  let patient;
  let case_investigation;
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
      jwt.sign({ user: healthcare_worker }, process.env.APP_SECRET_KEY, (err, token) => {
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


    case_investigation = new CaseInvestigation({
      _id: mongoose.Types.ObjectId(),
      patient_id: patient._id,
      assigned_to: healthcare_worker._id,
      notes: {
        note: "This is a test note...",
        date: new Date(),
        health_worker_id: healthcare_worker._id
      }
    })

    await case_investigation.save();

  });


  afterEach(async () => {
    await Patient.findByIdAndDelete(patient._id);
    await User.findByIdAndDelete(healthcare_worker._id);
    await CaseInvestigation.findByIdAndDelete(case_investigation._id);
  });


  it("It should add a new Case Investigation", async () => {
    let response = await chai
      .request(server)
      .patch("/api/case_investigations/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id: mongoose.Types.ObjectId(),
        assigned_to: healthcare_worker._id,
        notes: "This is a test note...",
      });
    expect(response).to.have.status(201);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Case Investigation", async () => {
    let response = await chai
      .request(server)
      .patch("/api/case_investigations/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id: patient._id,
        notes: "This is a test note...",
      });
    expect(response).to.have.status(201);
    expect(response.body).to.be.a("object");
  });


  it("It should not add a new Case Investigation", async () => {
    let response = await chai
      .request(server)
      .patch("/api/case_investigations/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id: patient._id,
        assigned_to: healthcare_worker._id,
      });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });


  it("It should not add a new Case Investigation", async () => {
    let response = await chai
      .request(server)
      .patch("/api/case_investigations/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        assigned_to: healthcare_worker._id,
        notes: "This is a test note...",
      });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });


  it("It should get a Case Investigation", async () => {
    let response = await chai
      .request(server)
      .get("/api/case_investigations/" + case_investigation._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });


  it("It should get case Investigations", async () => {
    let response = await chai
      .request(server)
      .get("/api/case_investigations/")
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });


  it("It should update a case investigation", async () => {
    let response = await chai
      .request(server)
      .patch(`/api/case_investigations?id=${case_investigation._id}`)
      .set("Authorization", "Bearer " + tokens)
      .send({
        patient_id: patient._id,
        assigned_to: healthcare_worker._id,
        notes: "This is another test note...",
      });

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("assigned_to");
  });


  it("It should delete case investigation", async () => {
    let response = await chai
      .request(server)
      .delete("/api/case_investigations/" + case_investigation._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });

});
