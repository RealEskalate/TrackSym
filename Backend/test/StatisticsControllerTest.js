process.env.NODE_ENV = "dev";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");

const { expect } = chai;
chai.use(chaiHttp);


describe("Statistics API", () => {
  
  it("It should get confirmed statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Confirmed&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Deaths statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Deaths&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Recovered statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Recovered&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Active statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Active&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });


  it("It should get Tests statistics for USA", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Tests&country=USA`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(0);
  });

  it("It should get All statistics for USA", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=All&country=USA`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(0);
  });

  
  // for world

  it("It should get confirmed statistics for world", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Confirmed&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Deaths statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Deaths&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Recovered statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Recovered&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Active statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Active&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });

  it("It should get All statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=All&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(0);
  });
  
  
  // rates 
  // countires

  it("It should get Tests Rate statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Tests_Rate&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Recovered Rate statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Recovered_Rate&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Deaths Rate statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Deaths_Rate&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Active Rate statistics for ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Active_Rate&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });


  // for world 
 
  it("It should get Recovered Rate statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Recovered_Rate&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Deaths Rate statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Deaths_Rate&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(5);
  });

  it("It should get Active Rate statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Active_Rate&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });


  // Hospitalization / ICU'
  it("It should get hospitalization statistics for Ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Hospitalization&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });

  it("It should get icu Rate statistics for Ethiopia", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=ICU&country=ETH`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });

  // world
  it("It should get hospitalization statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=Hospitalization&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });

  it("It should get icu Rate statistics for World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics?criteria=ICU&country=World`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(4);
  });


  // get countries list
  it("It should get all countries list in the World", async () => {
    let response = await chai
      .request(server)
      .get(`/api/statistics/countries`)
    expect(response).to.have.status(200);
    expect(response.body).to.have.length.greaterThan(180);
  });

});
