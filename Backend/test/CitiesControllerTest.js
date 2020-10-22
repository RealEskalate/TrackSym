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

        console.log(response.body);
        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body).to.have.length.above(0);
        expect(response.body[0]).to.be.a("string");
    });

    it("it should return filtered cities", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities")
        .query({filter: "Tokyo"});

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("array");
        expect(response.body[0]).to.be.an("object");
        expect(response.body[0]).to.have.keys(["city", "latitude", "longitude", "country"]);
    });

    it("it should return matched cities", async () => {
        let response = await chai
        .request(server)
        .get("/api/cities")
        .query({match: "Tok"});

        expect(response).to.have.status(200);
        expect(response.body).to.be.an("object");
    })
})