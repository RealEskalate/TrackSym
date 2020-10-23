process.env.NODE_ENV = "test";
require("dotenv").config();
let chai = require("chai");
let chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
let mongoose = require("mongoose");
const { expect } = chai;

let server = require("../index");
let { User } = require("../models/UserModel");
let { Symptom } = require("../models/Symptom");
let { SymptomUser } = require("../models/SymptomUser");
const CitizenSymptoms = require("../models/CitizenSymptomsModel");

chai.use(chaiHttp);

describe("Citizen Symptom API", () => {
    let symptom_user;
    let user;
    let symptom;
    let symptom2;
    let tokens;
    beforeEach(async () => {
        user = new User({
            _id: mongoose.Types.ObjectId(),
            username: `${Date.now().toString()} ${Math.random()}`,
            password:
                "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
            gender: "FEMALE",
            age_group: "21-30",
        });

        try {
            jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
                tokens = token;
            });
        } catch (err) {
            // console.log("ERROR " + err.toString());
        }

        await user.save();
        symptom = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: "Fever",
            description: "High Temperature",
        });
        await symptom.save();
        symptom2 = new Symptom({
            _id: mongoose.Types.ObjectId(),
            name: "Cold",
            description: "Low Temperature",
        });
        await symptom2.save();

        symptom_user = new SymptomUser({
            _id: mongoose.Types.ObjectId(),
            user_id: user._id,
            symptom_id: symptom._id,
        });
        await symptom_user.save();
    });

    afterEach(async () => {
        await User.findByIdAndDelete(user._id);
        await SymptomUser.findByIdAndDelete(symptom_user._id);
        await Symptom.findByIdAndDelete(symptom._id);
        await Symptom.findByIdAndDelete(symptom2._id);
            let date = new Date();
            date.setHours(date.getHours() - 24 + date.getTimezoneOffset() / 60);
        await CitizenSymptoms.deleteMany({
            created_at: {
                $gte: date
            }
        })
    });

    it("It should save a citizen symptom aggregation", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});
        let response = await chai.request(server).get("/api/citizen_symptoms");

        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
        expect(response.body[response.body.length - 1].total).to.be.gte(0);
    });
    it("It should save a citizen symptom aggregation with start_date filter added", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});
        let response = await chai
            .request(server)
            .get("/api/citizen_symptoms?start_date=2020-01-01");

        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
        last_date = new Date(response.body[response.body.length - 1].date.substring(0,10))
        today = new Date();
        last_date.setHours(0, 0, 0, 0);
        today.setHours(0, 0, 0, 0);
        expect(today.getDay()).to.be.equal(last_date.getDay());
        expect(response.body[response.body.length - 1].total).to.be.gte(0);
    });
    it("It should save and return a citizen symptom aggregation with end_date filter added", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let response = await chai
            .request(server)
            .get("/api/citizen_symptoms?end_date=" + tomorrow);

        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
        last_date = new Date(
            response.body[response.body.length - 1].date.substring(0, 10)
        );
        last_date.setHours(0, 0, 0, 0);
        expect(last_date).to.be.lte(tomorrow);
    });
    it("It should save and return a citizen symptom aggregation with end_date filter added", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});
        let response = await chai
            .request(server)
            .get("/api/citizen_symptoms?end_date=2020-09-01");

        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
    });
    it("It should save and return a citizen symptom aggregation  with both start and end date filters added", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});
        
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        let response = await chai
            .request(server)
            .get(
                "/api/citizen_symptoms?start_date=2020-01-01&end_date="+tomorrow
            );

        expect(response).to.have.status(200);
        expect(response.body).to.be.a("array");
        first_date = new Date(
            response.body[0].date.substring(0, 10)
        );
        first_date.setHours(0, 0, 0, 0);
        last_date = new Date(
            response.body[response.body.length - 1].date.substring(0, 10)
        );
        last_date.setHours(0, 0, 0, 0);
        expect(first_date).to.be.gte(new Date("2020-01-01"));
        expect(last_date).to.be.lte(tomorrow);
    });
    it("It should save but not return a citizen symptom aggregation due to illegal date request", async () => {
        //Save symptom history
        let save_symptoms = await chai
            .request(server)
            .post("/api/symptomuser/multiple/")
            .set("Authorization", "Bearer " + tokens)
            .send({
                _id: mongoose.Types.ObjectId(),
                symptoms: [symptom2._id],
            });
        //Hourly update
        let updates = await chai
            .request(server)
            .post("/api/update?interval=hourly&key=" + process.env.UPDATE_PASS)
            .send({});
        let response = await chai
            .request(server)
            .get("/api/citizen_symptoms?start_date=2020-13-13");

        expect(response).to.have.status(500);
    });
});
