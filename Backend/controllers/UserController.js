var UserModels = require("../models/UserModel.js");
var mongoose = require("mongoose");
const Bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const emailSender = require("../services/EmailSender");
const { DistrictModel } = require("../models/DistrictModel.js");
const { SymptomLog } = require("../models/SymptomLogModel");
const { TestReport } = require("../models/TestReportModel.js");
const LocationUserModel = require("../models/LocationUserModel.js");

// get all users
exports.get_all_users = async (req, res) => {
  const { User } = demo_or_real_db(req.query);

  const filter = await build_filter(req.query);

  let page = parseInt(req.query.page) || 1;
  let size = parseInt(req.query.size) || 15;

  const users = await User.find(
    filter,
    {},
    { skip: (page - 1) * size, limit: size * 1 }
  );

  let result = {
    data_count: await User.countDocuments(filter),
    page_size: size,
    current_page: page,
    data: users,
  };

  try {
    res.send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function build_filter(query){
  let { LocationUser } = demo_or_real_db(query);
  let filter = {};

  if(query.username){
      filter.username = {$regex: query.username, $options: 'i'};
  }

  if(query.country){
      filter.current_country = query.country;
  }

  if(query.role_type){
    filter.role = query.role_type;
  }

  if(query.start_date){
    filter.created_at = {$gte : new Date(query.start_date)}
  }
  if(query.end_date){
    let date = new Date(query.end_date)
    date.setHours(23)

    if(filter.created_at!=undefined){
      Object.assign(filter.created_at, {$lte : date});
    }else{
      filter.created_at =  {$lte : date}
    }
  }

  if(query.district){
    let district = await DistrictModel.findOne({name: query.district});
    let locationUsers = await LocationUser.find({'location.district': district._id}).distinct("user_id");
    filter._id = {$in : locationUsers};
  }

  if(query.region){
    let districts = await DistrictModel.find({state : query.region}).distinct("_id");
    let locationUsers = await LocationUser.find({'location.district' : {$in : districts}}).distinct("user_id");
    filter._id = {$in : locationUsers};
  }
  return filter;
}

// get user detail info
exports.get_detail_info= async(req,res)=>{
  const { User } = demo_or_real_db(req.query);

  let userDetails ={}
  userDetails.basicInfo = await User.findById(req.params.id)
    .populate("latest_location_user");

  userDetails.symptomHistory = await SymptomLog.findOne({user_id : req.params.id})
    .populate("user_id").populate({
      path: "current_symptoms.symptoms",
      model: "Symptom"
    }).populate({
        path: "history.symptoms",
        model: "Symptom"
    });
  
  userDetails.testReports = await TestReport.find({user_id: req.params.id})
    .populate("user_id")
    .populate("healthcare_worker_id");
  try {
    res.send(userDetails);
  } catch (err) {
    res.status(500).send(err.toString());
  }

}

// Get high level stat
exports.get_role_stat= async (req,res) =>{
  const { User } = demo_or_real_db(req.query);
  let result= {}

  result.allUsers= await User.countDocuments({});

  let date = new Date();
  date.setDate(date.getDate()-7)
  result.thisWeekNewUsers = await User.countDocuments({ created_at: {$gte : date }});

  result.healthcareWorkers = await User.countDocuments({ role: 'healthcare_worker'});
  result.ephiUsers = await User.countDocuments({ role: 'ephi_user'});

  result.systemAdmins = await User.countDocuments({ role: 'sysadmin'});

  try {
    res.send(result);
  } catch (err) {
    res.status(500).send(err.toString());
  }

}

// Get User by ID.
exports.get_user_by_id = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  if (req.params.id !== req.body.loggedInUser) {
    return res
      .status(403)
      .send(
        "User not authorized to access this endpoint with id: " + req.params.id
      );
  }
  const user = await User.findById(req.params.id);
  try {
    res.send(user);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Get User by Username and Password.
exports.get_user_by_credentials = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  let user = await User.findOne({
    username: { $eq: req.body.username },
  });
  try {
    if (!user || !Bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(404).send("Username and Password combination doesn't exist");
    }
    let country = await find_country_name(req)
    user.set({
      current_country: country,
    });
    await user.save();

    let token = jwt.sign({ user }, process.env.APP_SECRET_KEY)
    return res.json({
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function find_country_name(req){
  let country = "";
  await axios
    .get(
      "http://www.geoplugin.net/json.gp?ip=" +
        req.connection.remoteAddress.substring(2)
    )
    .then((response) => {
      if (response.data) {
        country = response.data.geoplugin_countryName;
      }
    })
    .catch((error) => {
      console.error(error.toString());
    });
  return country;
}

// Post a User
exports.post_user = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    age_group: req.body.age_group,
  });
  try {
    const check = await User.findOne({ username: user.username });
    if (check) {
      return res
        .status(500)
        .send("Username and Password combination already exists");
    }
    if (user.password.length < 5) {
      res.status(500).send("Password Length Too Short");
    } else {
      user.password = Bcrypt.hashSync(user.password, 10);
      await user.save();
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// Update User by ID.
exports.update_user = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  try {
    // Change user info by _id
    let to_be_changed = await User.findOne({ _id: req.body._id });

    let validation_status = await validate_user_update(req.query, req.body);
    if (validation_status.status != 200){
      return res.status(validation_status.status).send(validation_status.message)
    }

    assign_document_fields(to_be_changed, req.body);
    await to_be_changed.save();
    res.send(to_be_changed);
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function validate_user_update(query, update_doc){
  const { User } = demo_or_real_db(query);
  let exists = await User.findOne({ username: update_doc.username });

  if (exists && exists._id != update_doc._id) {
    return {status: 400, message: "Username already exists"};
  } else if (update_doc._id !== update_doc.loggedInUser) {
    return {
      status: 403,
      message: "User not authorized to access this endpoint with id: " + update_doc._id
    }
  }

  if (update_doc.password) {
    if (update_doc.password.length < 5) {
      return {status: 500, message: "Password Length Too Short"};
    }
    update_doc.password = Bcrypt.hashSync(update_doc.password, 10);
  }
  return {status: 200, message: "Successful"}
}

function assign_document_fields(document, update_doc){
  document.username = update_doc.username || document.username;
  document.password = update_doc.password || document.password;
  document.gender = update_doc.gender || document.gender;
  document.age_group = update_doc.age_group || document.age_group;
  document.email = update_doc.email || document.email;
}

// Delete User by ID.
exports.delete_user = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  try {
    if (req.body._id !== req.body.loggedInUser) {
      return res
        .status(403)
        .send(
          "User not authorized to access this endpoint with id: " + req.body._id
        );
    }
    const user = await User.findByIdAndDelete(req.body._id);
    if (!user) {
      return res.status(404).send("No item found");
    }
    return res.status(201).send(user);
  } catch (err) {
    return res.status(500).send(err.toString());
  }
};

// send invitation link to user
exports.send_invitation_link = async (req, res) => {
  try {
    let validation_status = await validate_invite_request(req.query, req.body);
    if (validation_status.status != 200){
      return res.status(validation_status.status).send(validation_status.message)
    }

    let { email, loggedInUser } = req.body;

    let signed_email = jwt.sign({ email:email,creator_id:loggedInUser }, process.env.APP_SECRET_KEY, {expiresIn:'6h'})
    let invitationLink = `${process.env.APP_WEB_CREATE_ACC_LINK}${signed_email}`;

    const usersData=[{ email : email, activationLink: invitationLink }]
    try {
      await emailSender.sendActivationLink(req, usersData);
      return res.status(200).send('Invitation message sent successfully.');
    } catch (error) {
      return res.status(500).send('Unable to sent invitation link.');
    }
    
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function validate_invite_request(query, body){
  const { User } = demo_or_real_db(query);
  if (body.email == undefined){
    return {
      status: 422,
      message: "The email is required."
    };
  }
  const check = await User.findOne({ email: body.email });
  if (check) {
    return {
      status: 422,
      message: "The email already exists."
    };
  }
  return { status:200, message: "Successful" };
}

// send  invitation links for multiple users
exports.send_multiple_invitation_link = async (req, res) => {
  try {
    let validation_status = await validate_multiple_invites(req.query, req.body); 
    if (validation_status.status != 200){
      return res.status(validation_status.status).send(validation_status.message)
    }

    let emails = req.body.emails;
    let creator_id = req.body.loggedInUser;
    let usersData = sign_emails(creator_id, emails) 
    try {
      await emailSender.sendActivationLink(req, usersData);
      return res.status(200).send('Invitation message sent to all users successfully.');
    } catch (error) {
      return res.status(500).send('Unable to sent invitation link to all users.');
    }
    
  } catch (err) {
    res.status(500).send(err.toString());
  }
};

async function validate_multiple_invites(query, body){
  let { User } = demo_or_real_db(query);
  let { emails } = body;
  if ( emails == undefined ){
    return {
      status: 422,
      message: "The email is required."
    };
  }

  let existingEmails= (await User.find({ email: { $in: emails }}))
                                  .map(user => user.email);
  if (existingEmails.length > 0) {
    return {
      status: 422,
      message: { "error": "These emails already exist.", "emails": existingEmails }
    };
  }
  return { status:200, message: "Successful" }
}

function sign_emails(creator_id, emails){
  return emails.map(email => {
    let signed_email = jwt.sign({email:email,creator_id:creator_id}, process.env.APP_SECRET_KEY, {expiresIn:'6h'})
    let invitationLink = `${process.env.APP_WEB_CREATE_ACC_LINK}${signed_email}`;
    return {
      email : email,
      activationLink: invitationLink
    }
  });
}

// verify and create account.
exports.create_invited_user = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  let signature = req.body.signature
  let email = null;
  let creator_id = null;
 
  jwt.verify(signature, process.env.APP_SECRET_KEY, (err, decodedEmail) => {
      if (err) {
        res.status(401).send("Incorrect signature");
      } else {
        email = decodedEmail.email
        creator_id = decodedEmail.creator_id
      }
  });
  // return if jwt sends error response
  if (res.headersSent){
    return
  }
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    username: req.body.username,
    password: req.body.password,
    gender: req.body.gender,
    age_group: req.body.age_group,
    role: "ephi_user",
    created_by:creator_id,
    email:email
  });
  
  try {
    const check = await User.findOne({ username: user.username });
    if (check) {
      return res
        .status(422)
        .send("The username already exists");
    }
    if (user.password.length < 5) {
      res.status(422).send("The password length must be above 5");
    } else {
      user.password = Bcrypt.hashSync(user.password, 10);
      await user.save();
      res.send(user);
    }
  } catch (err) {
    res.status(500).send(err.toString());
  }
  
};

// reset password.
exports.send_reset_link = async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  let email = req.body.email;
  try {
    if (email == undefined){
      return res
        .status(422)
        .send("The email is required.");
    }
    const check = await User.findOne({ email: email });
    if (!check) {
      return res
        .status(401)
        .send("The email address doesn't exist.");
    };
    let signed_email = jwt.sign({email},process.env.APP_SECRET_KEY,{expiresIn:'6h'})
    let invitationLink = `${process.env.APP_WEB_RESET_ACC_LINK}${signed_email}`;

    const usersData = {
      activationLink: invitationLink,
      email:email,
    };

    try {
      await emailSender.sendResetPassword(req, usersData);
      return res.status(200).send('Password reset link sent successfully.');
    } catch (error) {
      return res.status(500).send('Unable to password reset link.');
    }

  } catch (err) {
    res.status(500).send(err.toString());
  }
};

// verify and reset password.
exports.save_new_password= async (req, res) => {
  const { User } = demo_or_real_db(req.query);
  let signature = req.body.signature
  let email = null;

  if (!req.body.password || req.body.password.length < 5) {
    return res.status(422).send("Invalid password.");
  }

  jwt.verify(signature, process.env.APP_SECRET_KEY, (err, decodedEmail) => {
      if (err) {
        res.status(401).send("Incorrect signature");
      } else {
        email = decodedEmail.email
      }
  });
  // return if jwt sends error response
  if (res.headersSent){
    return
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(401)
      .send("The email address doesn't exist.");
  }

  try {
    user.password = Bcrypt.hashSync(req.body.password, 10);
    await user.save()
    
    res.send(user)
  } catch (err) {
    res.status(500).send(err.toString());
  }
  
};

function demo_or_real_db(query){
  if (query.demo && query.demo == "true"){
    return {
      User: UserModels.DemoUser,
      LocationUser: LocationUserModel.DemoLocationUser
    }
  } else if (query.stress && query.stress == "true"){
    return {
      User: UserModels.StressUser,
      LocationUser: LocationUserModel.StressLocationUser
    }
  } 
  else {
    return {
      User: UserModels.User,
      LocationUser: LocationUserModel.LocationUser
    }
  }
}