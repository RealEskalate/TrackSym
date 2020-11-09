process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const jwt = require("jsonwebtoken");

let { StatisticsResource } = require("../models/StatisticsResourceModel");
let { User } = require("../models/UserModel");

let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);


describe("Statistics Description API", () => {
  let statisticsResource;
  let sysAdmin;
  let tokens;

  beforeEach(async () => {

    sysAdmin = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ephi ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      role: "sysadmin",
      age_group: "21-30",
    });

    await sysAdmin.save();

    try {
      jwt.sign({ user: sysAdmin }, process.env.APP_SECRET_KEY, (err, token) => {
        tokens = token;
      });
    } catch (err) {
      console.log("ERROR " + err.toString());
    }


    statisticsResource = new StatisticsResource({
      _id: mongoose.Types.ObjectId(),
      title: "Test Learning",
      description: "it is a test learning path model...",
      language: "English",
      fields: [ { time: "50min"} ],
      criteria: [ { type:"video"} ],
    });

    await statisticsResource.save();

  });

  
  afterEach(async () => {
    await StatisticsResource.findByIdAndDelete(statisticsResource._id);
  });

  
  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/statistics-description")
    expect(response).to.have.status(200);
  });

  
  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/statistics-description?language=English")
    expect(response).to.have.status(200);
  });

  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/statistics-description?language=English&title=Test Learning")
    expect(response).to.have.status(200);
  });

  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/statistics-description?title=Test Learning")
    expect(response).to.have.status(200);
  });


  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get(`/api/resources/statistics-description/${statisticsResource._id}`)
    expect(response).to.have.status(200);
  });

  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get(`/api/resources/statistics-description/d42`)
    expect(response).to.have.status(500);
  });

  it("It should add a new Statistics Description", async () => {
    let response = await chai
        .request(server)
        .post("/api/resources/statistics-description/")
        .set("Authorization", "Bearer " + tokens)
        .send({
          title: "Test Learning",
          description: "it is a test learning path model...",
          language: "English",
          fields: [ { time: "50min"} ],
          criteria: [ { type:"video"} ],
        });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Statistics Description", async () => {
    let response = await chai
        .request(server)
        .post("/api/resources/statistics-description/")
        .set("Authorization", "Bearer " + tokens)
        .send({
          description: "it is a test learning path model...",
          language: "English",
          fields: [ { time: "50min"} ],
          criteria: [ { type:"video"} ],
        });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });

  it("It should not add a new Statistics Description", async () => {
    let response = await chai
        .request(server)
        .post("/api/resources/statistics-description/")
        .set("Authorization", "Bearer " + tokens)
        .send({
          language: "English",
          fields: [ { time: "50min"} ],
          criteria: [ { type:"video"} ],
        });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });

  it("It should not add a new Statistics Description", async () => {
    let response = await chai
        .request(server)
        .post("/api/resources/statistics-description/")
        .set("Authorization", "Bearer " + tokens)
        .send({
          title: "Test Learning",
          language: "English",
          fields: [ { time: "50min"} ],
          criteria: [ { type:"video"} ],
        });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });

  it("It should not add a new Statistics Description", async () => {
    let response = await chai
        .request(server)
        .post("/api/resources/statistics-description/")
        .set("Authorization", "Bearer " + tokens)
        .send({
          title: "Test Learning",
          description: "it is a test learning path model...",
          fields: [ { time: "50min"} ],
          criteria: [ { type:"video"} ],
        });
    expect(response).to.have.status(500);
    expect(response.body).to.be.a("object");
  });

  it("It should add a new Statistics Description", async () => {
    let response = await chai
        .request(server)
        .post("/api/resources/statistics-description/")
        .set("Authorization", "Bearer " + tokens)
        .send({
          title: "Test Learning",
          description: "it is a test learning path model...",
          language: "English",
        });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should upadate a Statistics Description Object", async () => {
    let response = await chai
        .request(server)
        .patch(`/api/resources/statistics-description/${statisticsResource._id}`)
        .set("Authorization", "Bearer " + tokens)
        .send({
          title: "Test Learning",
          description: "it is a test learning path model...",
          language: "English",
        });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });

  it("It should not upadate a Statistics Description Object", async () => {
    let response = await chai
        .request(server)
        .patch(`/api/resources/statistics-description/d42`)
        .set("Authorization", "Bearer " + tokens)
        .send({
          title: "Test Learning",
          description: "it is a test learning path model...",
          language: "English",
        });
    expect(response).to.have.status(500);
  });

  it("It should not delete a Statistics Description Object", async () => {
    let response = await chai
        .request(server)
        .delete(`/api/resources/statistics-description/${mongoose.Types.ObjectId()}`)
        .set("Authorization", "Bearer " + tokens)
    expect(response).to.have.status(404);
  });

  it("It should not delete a Statistics Description Object", async () => {
    let response = await chai
        .request(server)
        .delete(`/api/resources/statistics-description/d42`)
        .set("Authorization", "Bearer " + tokens)
    expect(response).to.have.status(500);
  });

  it("It should delete a Statistics Description Object", async () => {
    let response = await chai
        .request(server)
        .delete(`/api/resources/statistics-description/${statisticsResource._id}`)
        .set("Authorization", "Bearer " + tokens)
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });

});
