process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { Patient } = require("../models/Patient");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Patient API", () => {
  let healthcare_worker;
  let patient;
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
        status: "Death",
        sms_status: true,
    })

    await patient.save();

  });

  
  afterEach(async () => {
    await User.findByIdAndDelete(healthcare_worker._id);
    await Patient.findByIdAndDelete(patient._id);
  });

  
  it("It should add a new Patient", async () => {
    let response = await chai
      .request(server)
      .post("/api/patients/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        first_name: "Darth",
        last_name: "Vader",
        dob: new Date('May 25, 1977'),
        phone_number: "+25189028392",
        language: "English",
        gender: "MALE",
        woreda: "Arada",
        street_address: "4 killo",
        city: "Addis Ababa",
        status: "Death",
        sms_status: true,
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Patient", async () => {
    let response = await chai
      .request(server)
      .post("/api/patients/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        first_name: "Darth",
        last_name: "Vader",
        gender: "MALE",
        status: "Death",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should not add a new Patient", async () => {
    let response = await chai
      .request(server)
      .post("/api/patients/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        first_name: "Darth",
        last_name: "Vader",
        dob: new Date('May 25, 1977'),
        phone_number: "+25189028392",
        language: "English",
        woreda: "Arada",
        street_address: "4 killo",
        city: "Addis Ababa",
        status: "Death",
        sms_status: true,
      });
    expect(response).to.have.status(500);
  });


  it("It should not add a new Patient", async () => {
    let response = await chai
      .request(server)
      .post("/api/patients/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        dob: new Date('May 25, 1977'),
        phone_number: "+25189028392",
        language: "English",
        gender: "MALE",
        woreda: "Arada",
        street_address: "4 killo",
        city: "Addis Ababa",
        status: "Death",
        sms_status: true,
      });
    expect(response).to.have.status(500);
  });


  it("It should not add a new Patient", async () => {
    let response = await chai
      .request(server)
      .post("/api/patients/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
      });
    expect(response).to.have.status(500);
  });

  
  it("It should get Patient Object", async () => {
    let response = await chai
      .request(server)
      .get("/api/patients/"+patient._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });

  
  it("It should update the Patient", async () => {
    let response = await chai
      .request(server)
      .patch("/api/patients/"+patient._id)
      .set("Authorization", "Bearer " + tokens)
      .send({
        first_name: "alice",
        last_name: "braga",
        dob: new Date('May 25, 2019'),
        phone_number: "+25189028392",
        language: "English",
        gender: "FEMALE",
        woreda: "Nefas Silk",
        street_address: "Jemo 1",
        city: "Addis Ababa",
        status: "Death",
        sms_status: true,
      });

    expect(response).to.have.status(202);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("first_name");
  });


  it("It should delete Patient model", async () => {
    let response = await chai
      .request(server)
      .delete("/api/patients/"+patient._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(204);
  });
});
