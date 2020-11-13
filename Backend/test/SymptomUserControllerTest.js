process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User,DemoUser,StressUser } = require("../models/UserModel");
const jwt = require("jsonwebtoken");

let { Symptom } = require("../models/Symptom");
let { SymptomUser,DemoSymptomUser,StressSymptomUser } = require("../models/SymptomUser");

let mongoose = require("mongoose");
const { expect } = chai;
chai.use(chaiHttp);

describe("Symptom Users API", () => {
  let symptom_user;
  let symptom_user2;
  let user;
  let symptom;
  let symptom_2;
  let tokens;
  let tokens_2;
  beforeEach(async () => {
    user = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      age_group: "21-30",
    });
    user_2 = new User({
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
    let temp = user;
    user = user_2;
    try {
      jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
          tokens_2 = token;
      });
    } catch (err) {
        // console.log("ERROR " + err.toString());
    }
    user = temp;
    await user.save();
    await user_2.save();
    symptom = new Symptom({
      _id: mongoose.Types.ObjectId(),
      name: "Fever",
      description: "High Temperature",
    });
    await symptom.save();
    symptom_2 = new Symptom({
        _id: mongoose.Types.ObjectId(),
        name: "Cold",
        description: "Similar to common cold or flu",
    });
    await symptom_2.save();
    symptom_user = new SymptomUser({
      _id: mongoose.Types.ObjectId(),
      user_id: user._id,
      symptom_id: symptom._id,
    });
    await symptom_user.save();

    symptom_user2 = new SymptomUser({
      _id: mongoose.Types.ObjectId(),
      user_id: user._id,
      symptom_id: "5eb29993cd958a3ff8582903",
    });
    await symptom_user2.save();
    
  });

  afterEach(async () => {
    await User.findByIdAndDelete(user._id);
    await User.findByIdAndDelete(user_2._id);
    await SymptomUser.deleteMany({ user_id: user._id });
    await SymptomUser.deleteMany({ user_id: user_2._id });
    await Symptom.findByIdAndDelete(symptom._id);
    await Symptom.findByIdAndDelete(symptom_2._id);
  });

  it("It should add a new symptom user pair", async () => {
    let response = await chai
      .request(server)
      .post("/api/symptomuser/")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: mongoose.Types.ObjectId(),
        symptom_id: symptom._id,
        user_id: user._id,
      });
    expect(response).to.have.status(201);
    expect(response.body).to.be.a("object");
  });
  it("It should not add a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
          });
      expect(response).to.have.status(422);
  });
  it("It should add multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple")
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [symptom._id],
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should add multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple")
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [symptom_2._id],
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should add no multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple/")
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [],
          });
      expect(response).to.have.status(201);
  });
  it("It should get a new symptom user pair by symptom", async () => {
    let response = await chai
      .request(server)
      .get("/api/symptomuser/symptom/" + symptom_user.symptom_id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
  });
  it("It should not get a new symptom user pair by symptom", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/symptom/" + mongoose.Types.ObjectId())
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(422);
  });
  it("It should get a new symptom user pair by user", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should get a new symptom user pair by user and iso", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({iso: 'ET', probability: true})
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should get a new symptom user pair by user and language", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({language: 'Amharic'})
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should not get a nonexisting  symptom user pair", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + mongoose.Types.ObjectId()) 
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(422);
  });
  it("It should update symptom user", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: symptom_user._id,
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("symptom_id");
      expect(response.body).to.have.property("user_id");
  });
  it("It should not update symptom user due to mismatched tokens", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens_2)
          .send({
              _id: symptom_user._id,
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(403);
  });
  it("It should not update non existing symptom user", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(422);
  });
  it("It should delete symptom user", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: symptom_user._id,
          });
      expect(response).to.have.status(200);
  });
  it("It should not delete symptom user as tokens are mismatched with data", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens_2)
          .send({
              _id: symptom_user._id,
          });
      expect(response).to.have.status(403);
  });
  it("It should not delete a non existing symptom user", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
          });
      expect(response).to.have.status(422);
  });
});
describe("Demo Symptom Users API", () => {
  let symptom_user;
  let user;
  let symptom;
  let symptom_2;
  let tokens;
  let tokens_2;
  beforeEach(async () => {
      user = new DemoUser({
          _id: mongoose.Types.ObjectId(),
          username: `${Date.now().toString()} ${Math.random()}`,
          password:
              "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
          gender: "FEMALE",
          age_group: "21-30",
      });
      user_2 = new DemoUser({
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
      let temp = user;
      user = user_2;
      try {
          jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
              tokens_2 = token;
          });
      } catch (err) {
          // console.log("ERROR " + err.toString());
      }
      user = temp;
      await user.save();
      await user_2.save();
      symptom = new Symptom({
          _id: mongoose.Types.ObjectId(),
          name: "Fever",
          description: "High Temperature",
      });
      await symptom.save();

      symptom_2 = new Symptom({
          _id: mongoose.Types.ObjectId(),
          name: "Cold",
          description: "Resembles common cold or a flu",
      });
      await symptom_2.save();

      symptom_user = new DemoSymptomUser({
          _id: mongoose.Types.ObjectId(),
          user_id: user._id,
          symptom_id: symptom._id,
      });
      await symptom_user.save();
       
      symptom_user2 = new DemoSymptomUser({
          _id: mongoose.Types.ObjectId(),
          user_id: user._id,
          symptom_id: "5eb29993cd958a3ff8582903",
      });
      await symptom_user2.save();

  });

  afterEach(async () => {
      await DemoUser.findByIdAndDelete(user._id);
      await DemoUser.findByIdAndDelete(user_2._id);
      await DemoSymptomUser.deleteMany({ user_id: user._id });
      await DemoSymptomUser.deleteMany({ user_id: user_2._id });
      await Symptom.findByIdAndDelete(symptom._id);
      await Symptom.findByIdAndDelete(symptom_2._id);
  });

  it("It should add a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
              symptom_id: symptom._id,
              user_id: user._id,
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should not add a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
          });
      expect(response).to.have.status(422);
  });
  it("It should add multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [symptom._id],
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should add multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [symptom_2._id],
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should add no symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [],
          });
      expect(response).to.have.status(201);
  });
  it("It should get a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/symptom/" + symptom_user.symptom_id)
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should not get a new symptom user pair by symptom", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/symptom/" + mongoose.Types.ObjectId())
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(422);
  });
  it("It should get a new symptom user pair by user", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should get a new symptom user pair by user and iso", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({ iso: "ET", probability: true, demo: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should get a new symptom user pair by user and language", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({ language: "Amharic", demo: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should not get a nonexisting  symptom user pair", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + mongoose.Types.ObjectId())
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(422);
  });
  it("It should update symptom user", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: symptom_user._id,
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("symptom_id");
      expect(response.body).to.have.property("user_id");
  });
  it("It should not update symptom user due to mismatched tokens", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens_2)
          .send({
              _id: symptom_user._id,
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(403);
  });
  it("It should not update non existing symptom user", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(422);
  });
  it("It should delete symptom user", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: symptom_user._id,
          });
      expect(response).to.have.status(200);
  });
  it("It should not delete symptom user as tokens are mismatched with data", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens_2)
          .send({
              _id: symptom_user._id,
          });
      expect(response).to.have.status(403);
  });
  it("It should not delete a non existing symptom user", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .query({ demo: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
          });
      expect(response).to.have.status(422);
  });
  
})
describe("Stress Symptom Users API", () => {
  let symptom_user;
  let user;
  let symptom;
  let symptom_2;
  let tokens;
  let tokens_2;
  beforeEach(async () => {
      user = new StressUser({
          _id: mongoose.Types.ObjectId(),
          username: `${Date.now().toString()} ${Math.random()}`,
          password:
              "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
          gender: "FEMALE",
          age_group: "21-30",
      });
      user_2 = new StressUser({
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
      let temp = user;
      user = user_2;
      try {
          jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
              tokens_2 = token;
          });
      } catch (err) {
          // console.log("ERROR " + err.toString());
      }
      user = temp;
      await user.save();
      await user_2.save();
    
      symptom = new Symptom({
          _id: mongoose.Types.ObjectId(),
          name: "Fever",
          description: "High Temperature",
      });
      await symptom.save();
    
      symptom_2 = new Symptom({
          _id: mongoose.Types.ObjectId(),
          name: "Cold",
          description: "Resembles common cold or a flu",
      });
      await symptom_2.save();

      symptom_user = new StressSymptomUser({
          _id: mongoose.Types.ObjectId(),
          user_id: user._id,
          symptom_id: symptom._id,
      });
      await symptom_user.save();
    
      symptom_user2 = new StressSymptomUser({
          _id: mongoose.Types.ObjectId(),
          user_id: user._id,
          symptom_id: "5eb29993cd958a3ff8582903",
      });
      await symptom_user2.save();
  });

  afterEach(async () => {
      await StressUser.findByIdAndDelete(user._id);
      await StressUser.findByIdAndDelete(user_2._id);
      await StressSymptomUser.deleteMany({ user_id: user._id });
      await StressSymptomUser.deleteMany({ user_id: user_2._id });
      await Symptom.findByIdAndDelete(symptom._id);
      await Symptom.findByIdAndDelete(symptom_2._id);
  });

  it("It should add a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
              symptom_id: symptom._id,
              user_id: user._id,
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should not add a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
          });
      expect(response).to.have.status(422);
  });
  it("It should add multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [symptom._id],
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should add multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [symptom_2._id],
          });
      expect(response).to.have.status(201);
      expect(response.body).to.be.a("object");
  });
  it("It should add no multiple symptom user pairs", async () => {
      let response = await chai
          .request(server)
          .post("/api/symptomuser/multiple/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              symptoms: [],
          });
      expect(response).to.have.status(201);
  });
  it("It should get a new symptom user pair", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/symptom/" + symptom_user.symptom_id)
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should not get a new symptom user pair by symptom", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/symptom/" + mongoose.Types.ObjectId())
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(422);
  });
  it("It should get a new symptom user pair by user", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should get a new symptom user pair by user and iso", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({ iso: "ET", probability: true, stress: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should get a new symptom user pair by user and language", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + symptom_user.user_id)
          .query({ language: "Amharic", stress: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(200);
  });
  it("It should not get a nonexisting  symptom user pair", async () => {
      let response = await chai
          .request(server)
          .get("/api/symptomuser/user/" + mongoose.Types.ObjectId())
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens);
      expect(response).to.have.status(422);
  });
  it("It should update symptom user", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: symptom_user._id,
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(200);
      expect(response.body).to.be.a("object");
      expect(response.body).to.have.property("symptom_id");
      expect(response.body).to.have.property("user_id");
  });
  it("It should not update symptom user due to mismatched tokens", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens_2)
          .send({
              _id: symptom_user._id,
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(403);
  });
  it("It should not update non existing symptom user", async () => {
      let response = await chai
          .request(server)
          .patch("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
              symptom_id: symptom._id,
          });

      expect(response).to.have.status(422);
  });
  it("It should delete symptom user", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: symptom_user._id,
          });
      expect(response).to.have.status(200);
  });
  it("It should not delete symptom user as tokens are mismatched with data", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens_2)
          .send({
              _id: symptom_user._id,
          });
      expect(response).to.have.status(403);
  });
  it("It should not delete a non existing symptom user", async () => {
      let response = await chai
          .request(server)
          .delete("/api/symptomuser/")
          .query({ stress: true })
          .set("Authorization", "Bearer " + tokens)
          .send({
              _id: mongoose.Types.ObjectId(),
          });
      expect(response).to.have.status(422);
  });

});
