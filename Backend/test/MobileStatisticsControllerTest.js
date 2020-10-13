process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const jwt = require("jsonwebtoken");

let { MobileStatistics } = require("../models/MobileStatistics");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Mobile Statistics Description API", () => {
  let statisticsResource;
  
  beforeEach(async () => {

    statisticsResource = new MobileStatistics({
      _id: mongoose.Types.ObjectId(),
      description:{ topic: "it is a test statistics model..."},
      language: "English",
      filter: "kids",
    });

    await statisticsResource.save();

  });

  
  afterEach(async () => {
    await MobileStatistics.findByIdAndDelete(statisticsResource._id);
  });

  
  it("It should get a Statistics Description objects for mobile", async () => {
    let response = await chai
      .request(server)
      .get("/api/resources/mobile/statistics")
    expect(response).to.have.status(200);
  });


  it("It should get a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .get(`/api/resources/mobile/statistics/${statisticsResource._id}`)
    expect(response).to.have.status(200);
  });

  it("It should save a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .post(`/api/resources/mobile/statistics`)
      .send({
        description:{ topic: "it is a test statistics model..."},
        language: "English",
        filter: "kids",
      })
    expect(response).to.have.status(200);
  });


  it("It should save a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .post(`/api/resources/mobile/statistics`)
      .send({
        language: "English",
        filter: "kids",
      })
    expect(response).to.have.status(200);
  });


  it("It should not save a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .post(`/api/resources/mobile/statistics`)
      .send({
        description:{ topic: "it is a test statistics model..."},
        filter: "kids",
      })
    expect(response).to.have.status(500);
  });

  it("It should not save a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .post(`/api/resources/mobile/statistics`)
      .send({
        description:{ topic: "it is a test statistics model..."},
        language: "English",
      })
    expect(response).to.have.status(500);
  });


  it("It should update a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .patch(`/api/resources/mobile/statistics?id=${statisticsResource._id}`)
      .send({
        description:{ topic: "it is a test statistics model..."},
        filter: "kids",
      })
    expect(response).to.have.status(200);
  });


  it("It should delete a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .delete(`/api/resources/mobile/statistics?id=${statisticsResource._id}`)
    expect(response).to.have.status(204);
  });


  it("It should not delete a Statistics Description objects", async () => {
    let response = await chai
      .request(server)
      .delete(`/api/resources/mobile/statistics?id=${mongoose.Types.ObjectId()}`)
    expect(response).to.have.status(400);
  });

});
