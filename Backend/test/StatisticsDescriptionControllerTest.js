process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const jwt = require("jsonwebtoken");

let { StatisticsResource } = require("../models/StatisticsResourceModel");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Statistics Description API", () => {
  let statisticsResource;
  
  beforeEach(async () => {

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
      .get(`/api/resources/statistics-description/${statisticsResource._id}`)
    expect(response).to.have.status(200);
  });

});
