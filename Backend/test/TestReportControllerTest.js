process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { Patient } = require("../models/Patient");
let { TestReport } = require("../models/TestReportModel");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Test Report API", () => {
  let patient;
  let healthcare_worker;
  let test_report;
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
      status: "Death",
      sms_status: true,
  })

    await healthcare_worker.save();
    await patient.save();

    try {
        jwt.sign({ user:healthcare_worker }, process.env.APP_SECRET_KEY, (err, token) => {
          tokens = token;
        });
    } catch (err) {
        console.log("ERROR " + err.toString());
    }


    test_report = new TestReport({
        _id: mongoose.Types.ObjectId(),
        patient_id: patient._id,
        healthcare_worker_id: healthcare_worker._id,
        test_status: "Positive"
    })

    await test_report.save();

  });

  
  afterEach(async () => {
    await Patient.findByIdAndDelete(patient._id);
    await User.findByIdAndDelete(healthcare_worker._id);
    await TestReport.findByIdAndDelete(test_report._id);
  });

  
  it("It should add a new Test report", async () => {
    let response = await chai
      .request(server)
      .post("/api/test-report/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        test_status: "Negative",
        user_id: patient._id,
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Test report", async () => {
    let response = await chai
      .request(server)
      .post("/api/test-report/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        user_id: patient._id,
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });
  
  
  it("It should not add a new Test report", async () => {
    let response = await chai
      .request(server)
      .post("/api/test-report/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        test_status: "Negative",
      });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });

  
  it("It should get a Test Report", async () => {
    let response = await chai
      .request(server)
      .get("/api/test-report/"+"?patient_id="+patient._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });

  
  it("It should update a Test report", async () => {
    let response = await chai
      .request(server)
      .patch("/api/test-report/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        test_id: test_report._id,
        test_status: "Recovered"
      });

    expect(response).to.have.status(202);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("test_status");
  });


  it("It should delete Test report", async () => {
    let response = await chai
      .request(server)
      .delete("/api/test-report/"+test_report._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(204);
  });
});
