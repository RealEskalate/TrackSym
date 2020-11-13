const SymptomUserModel = require("./../models/SymptomUser");
const UserModels = require("./../models/UserModel");
const SymptomUserHistoryModel = require("./../models/SymptomUserHistoryModel");
const { Symptom } = require("../models/Symptom");
const jwt = require("jsonwebtoken");
const ProbabilityCalculator = require("../services/ProbabilityCalculator");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const SymptomLogRegistration = require("../services/SymptomLogRegistration.js");

// Post a symptomuser
exports.post_symptomuser = async (req, res) => {
  let { SymptomUser } = demo_or_real_db(req.query);
  
  let validation_status = await validate_symptom_user(req.query, req.body);
  if (validation_status.status != 200){
    return res.status(validation_status.status).send(validation_status.message);
  }
  
  try {
    let { symptom_id, loggedInUser } = req.body;
    const existingSymptoms = await SymptomUser.find({ user_id: loggedInUser })
      .populate('symptom_id');

    let history = await move_old_symptoms_to_symptom_history(req.query, [symptom_id], existingSymptoms, loggedInUser);

    await process_and_insert_symptoms(req.query, [symptom_id], loggedInUser, existingSymptoms, history)
    await log_changes(req.query, loggedInUser, [symptom_id], req.body);

    return res.status(201).send("Symptoms registered successfully");
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function validate_symptom_user(query, body){
  const { User } = demo_or_real_db(query);
  const user = await User.findById(body.loggedInUser);
  const symptom = await Symptom.findById(body.symptom_id);
  if (!user) {
    return { status: 422, message: "Invalid login token" };
  } else if (!body.symptom_id){
    return { status: 422, message: "symptom_id not sent" }
  } else if (!symptom){
    return { status: 422, message: "symptom_id is incorrect" }
  }
  return {status: 200, message: "Successful"}
}

async function move_old_symptoms_to_symptom_history(demo_data_query, current_symptoms, existingSymptoms, userID){
  let { SymptomUser } = demo_or_real_db(demo_data_query);
  const difference = existingSymptoms.filter(
    (x) =>
      x.symptom_id != null && !current_symptoms.includes(x.symptom_id._id.toString())
  );
  let history = await add_symptoms_to_user_history(demo_data_query, difference, userID);
  
  let symptoms_to_be_removed = difference.map(symptom_user => symptom_user._id) 
  await SymptomUser.deleteMany({ _id: {$in: symptoms_to_be_removed} });
  await history.markModified("events");
  await history.save();
  return history;
}

async function add_symptoms_to_user_history(demo_data_query, symptoms, user){
  let { SymptomUserHistory } = demo_or_real_db(demo_data_query);
  let history = await SymptomUserHistory.findOne({ user_id: user });
  if (!history) {
    history = new SymptomUserHistory({
      user_id: user,
      events: [],
    });
  }

  const currentDate = new Date(Date.now());
  symptoms.forEach(symptom => {
    history.events.push({
      symptom_id: symptom.symptom_id._id,
      start: symptom.timestamp,
      end: currentDate,
      relevance: symptom.symptom_id.relevance,
      type: "TERMINATED",
    })
  });
  return history;
}

// for each symptom, remove it from the today's history if exists and save symptom_user  
async function process_and_insert_symptoms(query, symptoms, userID, existingSymptoms, history){
  let { SymptomUser, SymptomUserHistory } = demo_or_real_db(query);
  const existingSymptomIDs = existingSymptoms.map(
    (symptomuser) => symptomuser.symptom_id._id.toString()
  );

  let todaySymptoms = find_symptoms_on_date(history, new Date());
  let todaySymptomIDs = todaySymptoms.map(symptom => symptom.symptom_id);
  
  symptoms.forEach(async (symptom_id) => {
    if (!existingSymptomIDs.includes(symptom_id)){
      let symptomuser = new SymptomUser({
        symptom_id,
        user_id: userID,
      });
  
      if (todaySymptomIDs.includes(symptom_id)){
        let symptom_to_be_removed = todaySymptoms[todaySymptomIDs.find(symptom_id)];
        await SymptomUserHistory.findByIdAndUpdate(history._id, 
          {"$pull": {"events": {_id: symptom_to_be_removed._id}}},
          { safe: true, upsert: true });
        symptomuser.timestamp = symptom_to_be_removed.start;
      } 
  
      await symptomuser.save();
    }
  })
}

function find_symptoms_on_date(history, date){
  return history.events.filter(
    (symptom) =>
      symptom.end.getDate() == date.getDate() &&
      symptom.end.getMonth() == date.getMonth() &&
      symptom.end.getFullYear() == date.getFullYear()
    );
}

async function log_changes(query, user_id, symptoms, body){
  let { User } = demo_or_real_db(query);
  let today_date = new Date(Date.now());
  await User.findByIdAndUpdate(user_id, {last_symptom_update: today_date})
  await SymptomLogRegistration.registerLog(query, user_id, symptoms, today_date, body.source);
}

// Post multiple symptoms given userId  and list of symptomsIds
exports.post_multiple_symptoms = async (req, res) => {
  let { SymptomUser } = demo_or_real_db(req.query);
  
  let validation_status = await validate_multiple_symptom_user(req.query, req.body);
  if (validation_status.status != 200){
    return res.status(validation_status.status).send(validation_status.message);
  }
  
  try {
    let { symptoms, loggedInUser } = req.body;
    const existingSymptoms = await SymptomUser.find({ user_id: loggedInUser })
    .populate('symptom_id');

    let history = await move_old_symptoms_to_symptom_history(req.query, symptoms, existingSymptoms, loggedInUser);

    await process_and_insert_symptoms(req.query, symptoms, loggedInUser, existingSymptoms, history)
    await log_changes(req.query, loggedInUser, symptoms, req.body);

    return res.status(201).send("Symptoms registered successfully");
  } catch (err) {
    return res.status(500).send(err.toString());
  }
};

async function validate_multiple_symptom_user(query, body){
  const { User } = demo_or_real_db(query);
  const user = await User.findById(body.loggedInUser);
  const symptoms = (await Symptom.find({_id: {$in: body.symptoms}}))
                                .map(symptom => symptom._id);
  if (!user) {
    return { status: 422, message: "Invalid login token" };
  } else if (!body.symptoms){
    return { status: 422, message: "symptoms not sent" }
  } else if (!Array.isArray(body.symptoms)){
    return { status: 422, message: "syptoms should be an array"}
  }else if (symptoms.length < body.symptoms.length){
    return { 
      status: 422, 
      message: {
        error:"Following symptoms are incorrect",
        incorrect_symptoms: body.symptoms.filter(symptom => !symptoms.includes(symptom))
      }
    }
  }
  return {status: 200, message: "Successful"}
}
//Get a symptomuser by symptom_id
exports.get_symptomuser_by_symptom_id = async (req, res) => {
  let { SymptomUser } = demo_or_real_db(req.query);
  try {
    const symptomuser = await SymptomUser.find({
      symptom_id: req.params.symptom_id,
    });
    if (!symptomuser || symptomuser.length==0) {
      return res.status(422).send("Symptom User Pair not found");
    }
    let result = [];
    for (let i = 0; i < symptomuser.length; i++) {
      let symptom = await Symptom.findById(symptomuser[i].symptom_id);
      result.push({
        _id: symptomuser[i]._id,
        symptom_id: symptomuser[i].symptom_id,
        user_id: symptomuser[i].user_id,
        timestamp: symptomuser[i].timestamp,
        _v: symptomuser[i].__v,
        Symptom: symptom,
      });
    }
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Get a symptomuser by user_id
exports.get_symptomuser_by_user_id = async (req, res) => {
  let { SymptomUser, User } = demo_or_real_db(query);

  try {
    const symptomuser = await SymptomUser.find({
      user_id: req.params.user_id,
    }).populate("user_id");
    if (!symptomuser || symptomuser.length==0) {
      return res.status(422).send("Symptom User Pair not found");
    }
    let result = [];
    let language = null;

    if (req.query.language) {
      language = await StatisticsResource.findOne({
        language: req.query.language,
        title: "sypmtom-list",
      });
      if (language) {
        language = language.fields[0];
      }
    }
    let symptoms_name = [];

    for (let i = 0; i < symptomuser.length; i++) {
      let symptom = await Symptom.findById(symptomuser[i].symptom_id);
      symptoms_name.push(symptom.name);
      if (language && language[symptom._id]) {
        symptom.name = language[symptom._id].name;
        symptom.description = language[symptom._id].description;
        symptom.relevance = language[symptom._id].relevance;
      }

      result.push({
        _id: symptomuser[i]._id,
        symptom_id: symptomuser[i].symptom_id,
        user_id: symptomuser[i].user_id._id,
        gender: symptomuser[i].user_id.gender,
        age_group: symptomuser[i].user_id.age_group,
        timestamp: symptomuser[i].timestamp,
        _v: symptomuser[i].__v,
        Symptom: symptom,
      });
    }

    // sending probability
    let country;
    if (req.query.iso == null){
      const user = await User.findById(req.params.user_id);
      country = user.current_country;
    }
    if (req.query.probability != null) {
      let probability = await ProbabilityCalculator.calculateProbability(
        symptoms_name,
        req.query.iso ? req.query.iso : country
      );
      return res.status(200).send({ probability: probability, symptom_info: result });
    }
    // sending normal one
    return res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

//Update a symptomuser by id
exports.update_symptomuser = async (req, res) => {
  let { SymptomUser } = demo_or_real_db(query);

  try {
    const symptomuserCheck = await SymptomUser.findById(req.body._id);
    if (!symptomuserCheck) {
      return res.status(422).send("Symptom not found");
    }
    if (symptomuserCheck.user_id.toString() !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " +
            req.body.loggedInUser
        );
    }
    const symptomuser = await SymptomUser.findByIdAndUpdate(
      req.body._id,
      req.body
    );
    let symptom = await Symptom.findById(symptomuser.symptom_id);
    let result = {
      _id: symptomuser._id,
      symptom_id: symptomuser.symptom_id,
      user_id: symptomuser.user_id,
      timestamp: symptomuser.timestamp,
      _v: symptomuser.__v,
      Symptom: symptom,
    };
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Deleting a symptomuser
exports.delete_symptomuser = async (req, res) => {
  let { SymptomUser } = demo_or_real_db(query);
  
  try {
    const symptomuserCheck = await SymptomUser.findById(req.body._id);
    if (!symptomuserCheck) {
        return res.status(422).send("Symptom User Pair not found");
    }
    if (symptomuserCheck.user_id.toString() !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " +
            req.body.loggedInUser
        );
    }
    const symptomuser = await SymptomUser.findByIdAndDelete(req.body._id);
    let symptom = await Symptom.findById(symptomuser.symptom_id);
    let result = {
      _id: symptomuser._id,
      symptom_id: symptomuser.symptom_id,
      user_id: symptomuser.user_id,
      timestamp: symptomuser.timestamp,
      _v: symptomuser.__v,
      Symptom: symptom,
    };
    res.status(200).send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

function demo_or_real_db(query){
  if (query.demo && query.demo == "true"){
    return {
      User: UserModels.DemoUser,
      SymptomUser: SymptomUserModel.DemoSymptomUser,
      SymptomUserHistory: SymptomUserHistoryModel.DemoSymptomUserHistory
    }
  } else if (query.stress && query.stress == "true"){
    return {
      User: UserModels.StressUser,
      SymptomUser: SymptomUserModel.StressSymptomUser,
      SymptomUserHistory: SymptomUserHistoryModel.StressSymptomUserHistory
    }
  } else {
    return {
      User: UserModels.User,
      SymptomUser: SymptomUserModel.SymptomUser,
      SymptomUserHistory: SymptomUserHistoryModel.SymptomUserHistory
    }
  }
}