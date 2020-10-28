process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { CaseInvestigation } = require("../models/CaseInvestigation");
let { Patient } = require("../models/Patient");
let { SymptomUser } = require("../models/SymptomUser");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Case Investigation API", () => {
  let healthcare_worker;
  let user;
  let user2;
  let user3;
  let user4;
  let patient;
  let patient2;
  let patient3;
  let patient4;
  let symptomuser;
  let symptomuser2;
  let case_investigation;
  let case_investigation2;
  let case_investigation3;
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

    var create_user = id => 
      new User({
        _id: mongoose.Types.ObjectId(),
        username: "user-" + mongoose.Types.ObjectId(),
        password: "Hidden password",
        patient_info: id
      })
    

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
    });
    
    user = create_user(patient._id)

    patient.user_id = user._id

    await patient.save();
    await user.save()

    patient2 = new Patient({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      first_name: "Luke",
      last_name: "Skywalker",
      dob: new Date('May 25, 1970'),
      phone_number: "+25189098392",
      language: "English",
      gender: "MALE",
      woreda: "Nefas Silk",
      street_address: "Jemo 2",
      city: "Addis Ababa",
      status: "Confirmed",
      sms_status: true,
    });

    user2 = create_user(patient2._id)
    patient2.user_id = user2._id
    await patient2.save();
    await user2.save()

    symptomuser = new SymptomUser({
      _id: mongoose.Types.ObjectId(),
      user_id: user2._id,
      symptom_id: mongoose.Types.ObjectId()
    });

    await symptomuser.save();

    patient3 = new Patient({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      first_name: "Anakin",
      last_name: "Skywalker",
      dob: new Date('May 25, 1947'),
      phone_number: "+25183028392",
      language: "English",
      gender: "MALE",
      woreda: "Nefas Silk",
      street_address: "Jemo 2",
      city: "Addis Ababa",
      status: "Recovered",
      sms_status: true,
    });

    user3 = create_user(patient3._id)
    patient3.user_id = user3._id
    await patient3.save();
    await user3.save();

    patient4 = new Patient({
      _id: mongoose.Types.ObjectId(),
      user_id: mongoose.Types.ObjectId(),
      first_name: "C-3PO",
      last_name: "Droid",
      dob: new Date('May 25, 1966'),
      phone_number: "+25189428392",
      language: "English",
      gender: "MALE",
      woreda: "Nefas Silk",
      street_address: "Jemo 2",
      city: "Addis Ababa",
      status: "Unknown",
      sms_status: true,
    });

    user4 = create_user(patient4._id);
    patient4.user_id = user4._id
    await patient4.save();
    await user4.save();

    symptomuser2 = new SymptomUser({
      _id: mongoose.Types.ObjectId(),
      user_id: user4._id,
      symptom_id: mongoose.Types.ObjectId()
    });

    await symptomuser2.save();

    case_investigation = new CaseInvestigation({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        assigned_to: healthcare_worker._id,
        current_note: {
            note: "This is a test note...",
            date: new Date(),
        },
        notes: [
            {
                note: "This is a test note...",
                date: new Date(),
                health_worker_id: healthcare_worker._id,
            },
        ],
    });

    await case_investigation.save();

    case_investigation2 = new CaseInvestigation({
      _id: mongoose.Types.ObjectId(),
      user_id: user2._id,
      assigned_to: healthcare_worker._id,
      current_note: {
          note: "This is a test note...",
          date: new Date(),
      },
      notes: [
          {
              note: "This is a test note...",
              date: new Date(),
              health_worker_id: healthcare_worker._id,
          },
      ],
    });

    await case_investigation2.save();
    
    case_investigation3 = new CaseInvestigation({
      _id: mongoose.Types.ObjectId(),
      user_id: user3._id,
      assigned_to: healthcare_worker._id,
      current_note: {
          note: "This is a test note...",
          date: new Date(),
      },
      notes: [
          {
              note: "This is a test note...",
              date: new Date(),
              health_worker_id: healthcare_worker._id,
          },
      ],
    });

    await case_investigation3.save();

  });


  afterEach(async () => {
    await User.findByIdAndDelete(user._id)
    await User.findByIdAndDelete(user2._id)
    await User.findByIdAndDelete(user3._id)
    await User.findByIdAndDelete(user4._id)
    await Patient.findByIdAndDelete(patient._id);
    await Patient.findByIdAndDelete(patient2._id);
    await Patient.findByIdAndDelete(patient3._id);
    await Patient.findByIdAndDelete(patient4._id);
    await SymptomUser.findByIdAndDelete(symptomuser._id);
    await SymptomUser.findByIdAndDelete(symptomuser2._id);
    await User.findByIdAndDelete(healthcare_worker._id);
    await CaseInvestigation.findByIdAndDelete(case_investigation._id);
    await CaseInvestigation.findByIdAndDelete(case_investigation2._id);
    await CaseInvestigation.findByIdAndDelete(case_investigation3._id);
  });


  it("It should add a new Case Investigation", async () => {
    let response = await chai
        .request(server)
        .patch("/api/case_investigations/")
        .set("Authorization", "Bearer " + tokens)
        .send({
            user_id: mongoose.Types.ObjectId(),
            assigned_to: healthcare_worker._id,
            current_note: "This is a test note...",
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
            user_id: user._id,
            current_note: "This is a test note...",
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
        user_id: user._id,
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
            current_note: "This is a test note...",
        });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });


  it("It should get count by patient status", async() => {
    let response = await chai
      .request(server)
      .get("/api/case_investigations/status_count/")
      .set("Authorization", "Bearer " + tokens)
      .query({
        assigned_to: healthcare_worker._id.toString()
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("Object");
    expect(response.body.total).to.be.eql({ count: 3, change: 3 });
    expect(response.body.Died).to.be.eql({ count: 1, change: 1 });
    expect(response.body.Confirmed).to.be.eql({ count: 1, change: 1 });
    expect(response.body.Recovered).to.be.eql({ count: 1, change: 1 });
    expect(response.body.active_symptoms).to.be.eql({count: 1})
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
            user_id: user._id,
            assigned_to: healthcare_worker._id,
            current_note: "This is another test note...",
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
