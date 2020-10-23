process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
const { expect } = chai;
chai.use(chaiHttp);

describe("Cities controller", () => {
    it("it should return a list of cities", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities/listed");

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length.above(0);
        expect(response.body[0]).to.be.a("string");
    });

    it("it should return filtered city", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities")
        .query({filter: "Tokyo"});

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body[0]).to.be.an("object");
        expect(response.body[0]).to.have.keys(["city", "latitude", "longitude", "country"]);
    });

    it("it should not return filtered city", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities")
        .query({filter: "Fire Nation"});

        expect(response).to.have.status(400);
    });

    it("it should return matched cities", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities")
        .query({matches: "Tok"});
        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length.above(0);
    });

    it("it should return no matched cities", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities")
        .query({matches: "w31woop52y[]"});

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length(0);
    });

    it("it should return all cities details", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities");

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("object");
    });
})