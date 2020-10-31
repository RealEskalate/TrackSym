process.env.NODE_ENV = "test";

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../index");
let { User, DemoUser } = require("../models/UserModel");
let mongoose = require("mongoose");

const jwt = require("jsonwebtoken");
const { response } = require("../index");
const { expect } = chai;
chai.use(chaiHttp);

describe("User API", () => {
  let user;
  let user2;
  let user3;
  let tokens;
  let tokens2;
  let tokens3;
  let emailToken;
  let emailToken2;
  beforeEach(async () => {
    user = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      age_group: "21-30",
      role: "basic"
    });

    try {
      jwt.sign({ user }, process.env.APP_SECRET_KEY, (err, token) => {
        tokens = token;
      });
    } catch (err) {
      console.log("err " + err.toString());
    }
    await user.save();

    user2 = new User({
      _id: mongoose.Types.ObjectId(),
      username: `${Date.now().toString()} ${Math.random()}`,
      password: "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
      gender: "FEMALE",
      age_group: "21-30",
      current_country: "Ethiopia",
      role: "healthcare_worker",
      email: "IAmAppUsermailercom"
    });

    try {
      jwt.sign({ user: user2 }, process.env.APP_SECRET_KEY, (err, token) => {
        tokens2 = token;
      });
    } catch (err) {
      console.log("err " + err.toString());
    }
    await user2.save();
    user3 = new DemoUser({
        _id: mongoose.Types.ObjectId(),
        username: `${Date.now().toString()} ${Math.random()}`,
        password:
            "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
        role: "basic",
    });

    try {
        jwt.sign({ user:user3 }, process.env.APP_SECRET_KEY, (err, token) => {
            tokens3 = token;
        });
    } catch (err) {
        console.log("err " + err.toString());
    }
    await user3.save();
    let emailTokenCredentials = { 
      email: "workEmail@xbox.live.com", 
      creator_id: user2._id 
    }
    try {
      jwt.sign(emailTokenCredentials, process.env.APP_SECRET_KEY, (err, token) => {
        emailToken = token;
      });
    } catch (err) {
      console.log("err " + err.toString());
    }

    try {
      jwt.sign({email: user2.email}, process.env.APP_SECRET_KEY, (err, token) => {
        emailToken2 = token;
      });
    } catch (err) {
      console.log("err " + err.toString());
    }
  });

  afterEach(async () => {
    await User.findByIdAndDelete(user._id);
    await User.findByIdAndDelete(user2._id);
    await User.findByIdAndDelete(user3._id);
  });


  it("It should Get all users", async () => {
    let response = await chai
      .request(server)
      .get("/api/users")
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("object");
    expect(response.body.data).to.have.length.greaterThan(1);
  });

  it("It should get filtered users", async () => {
    let response = await chai
      .request(server)
      .get("/api/users")
      .set("Authorization", "Bearer " + tokens)
      .query({username: user.username, gender: user.gender});
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("object");
    expect(response.body.data).to.have.lengthOf(1);
  });

  it("It should get all demo users", async () => {
    let response = await chai
      .request(server)
      .get("/api/users")
      .set("Authorization", "Bearer " + tokens3)
      .query({username: user.username, demo: true});
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("object");
    expect(response.body.data).to.have.lengthOf(0);
  });

  it("It should get filtered user", async () => {
    let response = await chai
      .request(server)
      .get("/api/users")
      .set("Authorization", "Bearer " + tokens)
      .query({end_date: new Date(), role_type: user2.role, country: user2.current_country});
    expect(response).to.have.status(200);
    expect(response.body).to.be.an("object");
    expect(response.body.data).to.have.length.greaterThan(0);
  });

  //   //Get All Users - Invalid Route
  it("It should not Get all users", async () => {
    let response = await chai.request(server).get("/api/userss");
    expect(response).to.have.status(404);
  });

  it("It should get detail info", async() => {
    let response = await chai
      .request(server)
      .get("/api/users-detail/" + user._id)
      .set("Authorization", "Bearer " + tokens);

      expect(response).to.have.status(200);
      expect(response.body).to.have.keys(["basicInfo", "symptomHistory", "testReports"])
  });

  it("It should get user count by roles", async() => {
    let response = await chai
    .request(server)
    .get("/api/users-stat")
    .set("Authorization", "Bearer " + tokens);

    expect(response).to.have.status(200);
    expect(response.body).to.be.an("object");
    expect(response.body).to.have.keys([
      "allUsers", "thisWeekNewUsers", "healthcareWorkers", "ephiUsers", "systemAdmins"
    ]);
  })

  it("It should Get user By ID", async () => {
    let response = await chai
      .request(server)
      .get("/api/users/" + user._id)
      .set("Authorization", "Bearer " + tokens);
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  it("It should not Get user By ID", async () => {
    let response = await chai
      .request(server)
      .get("/api/users/5e904cce7a1c6b627ae9f507")
      .set("Authorization", "Bearer " + tokens);
    expect(response.body).to.not.have.property("username");
  });

  it("It should authenticate user", async () => {
    let response = await chai.request(server).post("/api/auth/login").send({
      username: user.username,
      password: "10000",
    });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.nested.property("user.username");
    expect(response.body).to.have.nested.property("user.password");
    expect(response.body).to.have.nested.property("user.gender");
    expect(response.body).to.have.nested.property("user.age_group");
  });

  it("It should register user", async () => {
    let response = await chai
      .request(server)
      .post("/api/auth/register")
      .send({
        username: "Testing " + Date.now(),
        password: "UnitTesting",
        gender: "MALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  it("It should register demo user", async () => {
    let response = await chai
      .request(server)
      .post("/api/auth/register?demo=true")
      .send({
        username: "Testing " + Date.now(),
        password: "UnitTesting",
        gender: "MALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  it("It should register stress user", async () => {
    let response = await chai
      .request(server)
      .post("/api/auth/register?stress=true")
      .send({
        username: "Testing " + Date.now(),
        password: "UnitTesting",
        gender: "MALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  it("It should not register user due to password length", async () => {
    let response = await chai
      .request(server)
      .post("/api/auth/register")
      .send({
        username: "Testing " + Date.now(),
        password: "U",
        gender: "MALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(500);
  });

  it("It should not register user due to missing fields", async () => {
    let response = await chai
      .request(server)
      .post("/api/auth/register")
      .send({
        username: "Testing " + Date.now(),
      });
    expect(response).to.have.status(500);
  });

  it("It should not register user due to already existing user", async () => {
    let response = await chai.request(server).post("/api/auth/register").send({
      username: user.username,
      password: "10000",
    });
    expect(response).to.have.status(500);
  });

  it("It should update user", async () => {
    let response = await chai
      .request(server)
      .patch("/api/users")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: user._id,
        username: "Testing " + Date.now(),
        password: "10000",
        gender: "FEMALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  it("It should not update user due to wrong user token", async () => {
    let response = await chai
      .request(server)
      .patch("/api/users")
      .set("Authorization", "Bearer " + tokens2)
      .send({
        _id: user._id,
        username: "Testing " + Date.now(),
        password: "10000",
        gender: "FEMALE",
        age_group: "21-30",
      });
    expect(response).to.have.status(403);
  })

  // //Update User - Invalid User - Duplicate Username
  describe("PATCH /api/users", () => {
    let newUser;
    beforeEach(async () => {
      newUser = new User({
        _id: mongoose.Types.ObjectId(),
        username: "Testing " + Date.now(),
        password:
          "$2a$10$efmxm5o1v.inI.eStGGxgO1zHk.L6UoA9LEyYrRPhWkmTQPX8.NKO",
        gender: "FEMALE",
        age_group: "21-30",
      });
      await newUser.save();
    });
    afterEach(async () => {
      await User.findByIdAndDelete(newUser._id);
    });
    it("It should not update user", async () => {
      let response = await chai
        .request(server)
        .patch("/api/users")
        .set("Authorization", "Bearer " + tokens)
        .send({
          _id: user._id,
          username: newUser.username,
          password: "10000",
          gender: "FEMALE",
          age_group: "21-30",
        });
      expect(response).to.have.status(400);
    });
  });

  it("It should delete user", async () => {
    let username = "Testing " + Date.now();
    let saved_response = await chai
      .request(server)
      .post("/api/auth/register")
      .send({
        username,
        password: "UnitTesting",
        gender: "MALE",
        age_group: "21-30",
      });
    let request = await chai.request(server).post("/api/auth/login").send({
      username,
      password: "UnitTesting",
    });
    let response = await chai
      .request(server)
      .delete("/api/users")
      .set("Authorization", "Bearer " + request.body.token)
      .send({
        _id: saved_response.body._id,
      });
    expect(response).to.have.status(201);
  });

  it("It should not delete user", async () => {
    let response = await chai
      .request(server)
      .delete("/api/users")
      .set("Authorization", "Bearer " + tokens)
      .send({
        _id: "5e904cce7a1c6b627ae9f507",
      });
    expect(response).to.have.status(403);
  });

  it("It should not send invitation link due to no email", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite")
      .set("Authorization", "Bearer " + tokens2);
    expect(response).to.have.status(422);
  });

  it("It should not send invite due to email already existing", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite")
      .set("Authorization", "Bearer " + tokens2)
      .send({
        email: user2.email
      });
    expect(response).to.have.status(422);
  });

  it("It should not send invite due to user privilage", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite")
      .set("Authorization", "Bearer " + tokens)
      .send({
        email: "gmail@yahoo.gov.et"
      });
    expect(response).to.have.status(401);
  });

  it("It should not send invite due to bad email", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite")
      .set("Authorization", "Bearer " + tokens2)
      .send({
        email: "+251959205222"
      });
    expect(response).to.have.status(500);
  });

  it("It should not send multiple invitation links due to no emails", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite-multiple")
      .set("Authorization", "Bearer " + tokens2);
    expect(response).to.have.status(422);
  });

  it("It should not send multiple invites due to email already existing", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite-multiple")
      .set("Authorization", "Bearer " + tokens2)
      .send({
        emails: [user2.email]
      });
    expect(response).to.have.status(422);
  });

  it("It should not send multiple invites due to user privilage", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite-multiple")
      .set("Authorization", "Bearer " + tokens)
      .send({
        emails: ["gmail@yahoo.gov.et"]
      });
    expect(response).to.have.status(401);
  });

  it("It should not send multiple invites due to bad email", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/invite-multiple")
      .set("Authorization", "Bearer " + tokens2)
      .send({
        emails: ["+251959205222"]
      });
    expect(response).to.have.status(500);
  });

  it("It should save invited user", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/create-invited-user")
      .send({ 
        signature: emailToken,
        username: `${Math.random()}`,
        password: "beepboopglip"
       });
      expect(response).to.have.status(200);
      expect(response.body).to.be.an("object");
      expect(response.body).to.have.property("_id");
      await User.findByIdAndDelete(response.body._id);
  });

  it("It should not send reset link due to invalid email", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/reset-password")
      .send({
        email: ""
      });
    expect(response).to.have.status(401)
  });

  it("It should not send reset link due to bad email", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/reset-password")
      .send({
        email: "IAmAppUsermailercom"
      });
    expect(response).to.have.status(500)
  });

  it("It should save new password", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/change-password")
      .send({
        signature: emailToken2,
        password: "IPromiseNotToForgetThisOne"
      });
    expect(response).to.have.status(200);
    expect(response.body).to.be.a("object");
    expect(response.body).to.have.property("username");
    expect(response.body).to.have.property("password");
    expect(response.body).to.have.property("gender");
    expect(response.body).to.have.property("age_group");
  });

  it("It should not save new password due to invalid token", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/change-password")
      .send({
        signature: "",
        password: "IPromiseNotToForgetThisOne"
      });
    expect(response).to.have.status(401);
  });

  it("It should not save new password due to invalid email", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/change-password")
      .send({
        signature: emailToken,
        password: "IPromiseNotToForgetThisOne"
      });
    expect(response).to.have.status(401);
  });

  it("It should not save new password due to invalid password", async () => {
    let response = await chai
      .request(server)
      .post("/api/user/change-password")
      .send({
        signature: emailToken2,
        password: "Oops"
      });
    expect(response).to.have.status(422);
  });
});
