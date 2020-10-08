process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const jwt = require("jsonwebtoken");

let { LearningPath } = require("../models/LearningPathModel");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Learning Path API", () => {
  let learningPath;
  
  beforeEach(async () => {

    learningPath = new LearningPath({
      _id: mongoose.Types.ObjectId(),
      name: "Test Learning",
      what: "it is a test learning path model...",
      why: "test...",
      time: "50min",
      how: "video",
      action: "watch",
      age_group: "21-30",
      language: "English"
    });

    await learningPath.save();

  });

  
  afterEach(async () => {
    await LearningPath.findByIdAndDelete(learningPath._id);
  });

  
  it("It should add a new Learning Path", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/learning-path")
      .send({
        what: "it is a test learning path model...",
        why: "test...",
        time: "50min",
        how: "video",
        action: "watch",
        age_group: "21-30",
        language: "English"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Learning Path", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/learning-path")
      .send({
        name: "Test Learning",
        what: "it is a test learning path model...",
        why: "test...",
        time: "50min",
        how: "video",
        action: "watch",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Learning Path", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/learning-path")
      .send({
        name: "Test Learning",
        what: "it is a test learning path model...",
        why: "test...",
        time: "50min",
        how: "video",
        action: "watch",
        age_group: "21-30",
        language: "English"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should not add a new Learning Path", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/learning-path")
      .send({
        name: "Test Learning",
        why: "test...",
        time: "50min",
        how: "video",
        action: "watch",
        age_group: "21-30",
        language: "English"
      });
    expect(response).to.have.status(500);
  });


  it("It should not add a new Learning Path", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/learning-path")
      .send({
        name: "Test Learning",
        what: "it is a test learning path model...",
        why: "test...",
        how: "video",
        action: "watch",
        age_group: "21-30",
        language: "English"
      });
    expect(response).to.have.status(500);
  });

  it("It should not add a new Learning Path", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/learning-path")
      .send({
        name: "Test Learning",
        what: "it is a test learning path model...",
        why: "test...",
        time: "50min",
        how: "video",
        age_group: "21-30",
        language: "English"
      });
    expect(response).to.have.status(500);
  });

  
  it("It should get a Learning Path objects", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/learning-path")
    expect(response).to.have.status(200);
  });


  it("It should get a Learning Path objects", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/learning-path/name/"+"Test Learning")
    expect(response).to.have.status(200);
  });

  it("It should get a Learning Path object", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/learning-path/"+learningPath._id)
    expect(response).to.have.status(200);
  });
  
  it("It should update a Learning Path", async () => {
    let response = await chai
      .request(server)
      .patch("/api/resources/learning-path/"+learningPath._id)
      .send({
        name: "Test Learning",
        what: "it is a test learning path model...",
        why: "test...",
        time: "50min",
        how: "video",
        action: "watch",
        age_group: "21-30",
        language: "English"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should delete a Learning Path", async () => {
    let response = await chai
      .request(server)
      .delete("/api/resources/learning-path")
      .send({ _id:learningPath._id});
    expect(response).to.have.status(200);
  });

});
