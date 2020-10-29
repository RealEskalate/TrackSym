process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { TestReport } = require("../models/TestReportModel");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Test Report API", () => {
  let user;
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

    user = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()}  ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "MALE",
      age_group: "21-30",
    });

    await healthcare_worker.save();
    await user.save();

    try {
        jwt.sign({ user:healthcare_worker }, process.env.APP_SECRET_KEY, (err, token) => {
          tokens = token;
        });
    } catch (err) {
        console.log("ERROR " + err.toString());
    }


    test_report = new TestReport({
        _id: mongoose.Types.ObjectId(),
        user_id: user._id,
        healthcare_worker_id: healthcare_worker._id,
        test_status: "Positive"
    })

    await test_report.save();

  });

  
  afterEach(async () => {
    await User.findByIdAndDelete(user._id);
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
        user_id: user._id,
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
        user_id: user._id,
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
      .get("/api/test-report/"+"?user_id="+user._id)
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
        test_status: "Positive"
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
