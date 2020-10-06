process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { Information } = require("../models/InformationModel");

let mongoose = require("mongoose");
const { use } = require("chai");
const { expect } = chai;
chai.use(chaiHttp);


describe("Web Information API", () => {
  let information;

  
  beforeEach(async () => {

    information = new Information({
        _id: mongoose.Types.ObjectId(),
        title: "Darth Vader and his broken saber",
        language: "English",
        image: "/tmp/",
        type: "action",
        description: "............"
    })

    await information.save();

  });

  
  afterEach(async () => {
    await Information.findByIdAndDelete(information._id);
  });

  
  it("It should add a new Information", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/information")
      .send({
        title: "test title",
        language: "English",
        image: "/tmp/",
        type: "about",
        description: "............"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Information", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/information")
      .send({
        title: "test title",
        language: "English",
        image: "/tmp/",
        description: "............"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should add a new Information", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/information")
      .send({
        title: "test title",
        language: "English",
        type: "about",
        description: "............"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });



  it("It should not add a new Information", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/information")
      .send({
        language: "English",
        image: "/tmp/",
        type: "about",
        description: "............"
      });
    expect(response).to.have.status(500);
  });


  it("It should not add a new Information", async () => {
    let response = await chai
      .request(server)
      .post("/api/resources/information")
      .send({
        title: "test title",
        image: "/tmp/",
        type: "about",
        description: "............"
      });
    expect(response).to.have.status(500);
  });

  
  it("It should get Information objects", async () => {
    let response = await chai
      .request(server)
      .get(`/api/resources/information?type=action&language=English`)
    expect(response).to.have.status(200);
  });

  
  it("It should update Information object", async () => {
    let response = await chai
      .request(server)
      .patch(`/api/resources/information/_id:${information._id}`)
      .send({
        title: "test title",
        image: "/tmp/",
        type: "about",
        description: "............"
      });

    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
  });


  it("It should delete Information object", async () => {
    let response = await chai
      .request(server)
      .delete("/api/resources/information")
      .send({
        _id: information._id
      })
    expect(response).to.have.status(200);
  });

});
