const SymptomUserModel= require("../models/SymptomUser");
const LocationUserModel = require("../models/LocationUserModel");
const UserModel = require("../models/UserModel");
const { DistrictModel } = require("../models/DistrictModel");
const { Symptom } = require("../models/Symptom");
const SymptomLogModel = require("../models/SymptomLogModel");
const { requestWhitelist } = require("express-winston");
const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
const CaseInvestigationModel = require("../models/CaseInvestigation");

exports.get_most_common = async (req, res) => {
    let { SymptomUser } = demo_or_real_db(req.query);

    let filter = await build_filter(req.query);
    
    //First find appropriate documents by filter
    //Group based on distinct unique symptom ids
    //Populate/Lookup symptom values from Symptom Table
    let aggregated = await SymptomUser.aggregate([
        {
            $match: filter,
        },
        {
            $group: {
                _id: "$symptom_id",
                count: {
                    $sum: 1,
                },
            },
        },
        {
            $lookup: {
                from: "symptoms",
                localField: "_id",
                foreignField: "_id",
                as: "symptom",
            },
        },
        {
            $sort: { count: -1 }
        },
    ]);

    localized_result = await translate_symptom_users(aggregated, req.query.language);
    try { 
        res.send({
            total: localized_result.length,
            data: localized_result,
        });
    } catch (err) {
        return res.status(500).send(err.toString());
    }
};

exports.get_people_with_symptoms = async (req, res) => {
    let { SymptomUser } = demo_or_real_db(req.query);

    let filter = await build_filter(req.query);

    let symptomUsers = await SymptomUser.find(filter).distinct("user_id");

    try {
        res.send({ result: symptomUsers.length });
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

exports.get_symptom_logs_by_healthcare_worker = async (req, res) => {
    let { CaseInvestigation, SymptomLog, name_ } = demo_or_real_db(req.query);
    
    if (!req.params.assigned_to){
        return res.status(400).send("Healthcare worker ID not sent");
    }

    let filter = await build_detailed_filter(req.query);
    let selected_user_id = (await CaseInvestigation.find({
        assigned_to: req.params.assigned_to
    })).map(investigation => investigation.user_id);
    filter.user_id = {$in: selected_user_id}

    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;
    let logs = await SymptomLog.find(
        filter,
        {},
        { skip: (page - 1) * size, limit: size * 1 }
    )
        .populate({
            path: "user_id",
            model: name_ + "users",
        })
        .populate({
            path: "current_symptoms.symptoms",
            model: "Symptom",
        })
        .populate({
            path: "history.symptoms",
            model: "Symptom",
        })
        .sort({ "current_symptoms.date": -1 });

    await translate_symptom_log(logs, req.query.language);
    assign_risk_scores(logs);
    
    let result = {
        data_count: await SymptomLog.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: logs,
    };
    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
}

exports.get_symptom_logs = async (req, res) => {
    let { SymptomLog, name_ } = demo_or_real_db(req.query);
    let filter = await build_detailed_filter(req.query);
    filter.status = { $ne: "SYMPTOMS_REMOVED" }

    let page = parseInt(req.query.page) || 1;
    let size = parseInt(req.query.size) || 15;
    let logs = await SymptomLog.find(
        filter,
        {},
        { skip: (page - 1) * size, limit: size * 1 }
    )
        .populate({
            path: "user_id",
            model: name_ + "User",
        })
        .populate({
            path: "current_symptoms.symptoms",
            model: "Symptom",
        })
        .populate({
            path: "history.symptoms",
            model: "Symptom",
        })
        .sort({ "current_symptoms.date": -1 });

    await translate_symptom_log(logs, req.query.language);
    assign_risk_scores(logs);

    let result = {
        data_count: await SymptomLog.countDocuments(filter),
        page_size: size,
        current_page: page,
        data: logs,
    };
    try {
        res.send(result);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};

exports.get_logs_by_user_id = async (req, res) => {
    let { SymptomLog } = demo_or_real_db(req.query);
    let log = await SymptomLog.findOne({ user_id: req.params.user_id });
    if (!log) {
        res.status(404).send("Log Not Found");
    } else {
        try {
            assign_risk_scores([log]);
            res.send(log);
        } catch (err) {
            res.status(500).send(err.toString());
        }
    }
};


// check if demo=true in request
function demo_or_real_db(query) {
    if (query.demo && query.demo == "true"){
        return {
            User: UserModel.DemoUser,
            SymptomLog: SymptomLogModel.SymptomLogDemo,
            LocationUser: LocationUserModel.DemoLocationUser,
            CaseInvestigation: CaseInvestigationModel.CaseInvestigationDemo,
            SymptomUser: SymptomUserModel.DemoSymptomUser,
            name_: "Demo "
        }
    } else {
        return {
            User: UserModel.User,
            SymptomLog: SymptomLogModel.SymptomLog,
            LocationUser: LocationUserModel.LocationUser,
            CaseInvestigation: CaseInvestigationModel.CaseInvestigation,
            SymptomUser: SymptomUserModel.SymptomUser,
            name_: ""
        }
    }
};

// create and return a filter object based on country, district, date
async function build_filter (query) {
    let { User, LocationUser } = demo_or_real_db(query);

    let filter = {};

    if (query.date) {
        let date = new Date(query.date);
        filter.timestamp = { $gt: date };
    }

    if (query.district) {
        let district = await DistrictModel.findOne({
            name: query.district,
        });
        if (district) {
            let locationUsers = await LocationUser.find({
                "location.district": district._id,
            }).distinct("user_id", { user_id: { $ne: null } });
            filter.user_id = { $in: locationUsers };
        }
    } else if (query.region) {
        let districts = await DistrictModel.find({
            state: query.region,
        }).distinct("_id", { "_id": { $ne: null } });
        if (districts) {
            let locationUsers = await LocationUser.find({
                "location.district": { $in: districts },
            }).distinct("user_id", { user_id: { $ne: null } });
            filter.user_id = { $in: locationUsers };
        }
    } else if (query.country) {
        let users = await User.find({
            current_country: query.country,
        }).distinct("_id", {"_id": {$ne: null}});
        filter.user_id = { $in: users };
    } 

    return filter
};

// create object based on many params - not merged with build filter because of conflicting query naming
async function build_detailed_filter(query) {
    let { User } = demo_or_real_db(query);
    let filter = {};

    if (query.status) {
        filter.status = query.status;
    }

    if (query.username) {
        let users = await User.find({
            username: { $regex: query.username, $options: "i" },
        }).distinct("_id");
        filter.user_id = { $in: users };
    }

    if (query.country) {
        filter["current_symptoms.location.country"] = query.country;
    }

    if (query.district) {
        let district = await DistrictModel.findOne({
            name: query.district,
        });
        filter["current_symptoms.location.district"] = district._id;
    }

    if (query.region) {
        let districts = await DistrictModel.find({
            state: query.region,
        }).distinct("_id");
        filter["current_symptoms.location.district"] = { $in: districts };
    }

    if (query.start_date) {
        filter["current_symptoms.date"] = {
            $gte: new Date(query.start_date),
        };
    } else {
        let date = new Date();
        date.setHours(date.getHours() - 24);
        filter["current_symptoms.date"] = { $gte: date };
    }

    if (query.end_date) {
        let date = new Date(query.end_date);
        date.setHours(23);
        Object.assign(filter["current_symptoms.date"], { $lte: date });
    }

    if (query.risk_level) {
        filter["current_symptoms.risk_score"] = {};
        if (query.risk_level.toLowerCase() == "low") {
            filter["current_symptoms.risk_score"]["$gte"] = 0;
            filter["current_symptoms.risk_score"]["$lt"] = 0.33;
        } else if (query.risk_level.toLowerCase() == "medium") {
            filter["current_symptoms.risk_score"]["$gt"] = 0.33;
            filter["current_symptoms.risk_score"]["$lte"] = 0.66;
        } else if (query.risk_level.toLowerCase() == "high") {
            filter["current_symptoms.risk_score"]["$gt"] = 0.66;
            filter["current_symptoms.risk_score"]["$lte"] = 1;
        }
    }

    return filter
}

// translate symptom_users to specified language
async function translate_symptom_users(content, language) {
    if (language) {
        language = await StatisticsResource.findOne({
            language: language,
            title: "sypmtom-list",
        });
        if (language) {
            language = language.fields[0];
        }
    }
    common = []
    for (var index = 0 in content) {
        let symptom = content[index].symptom;
        if (symptom.length == 1 && symptom[0]) {
            symptom = symptom[0];
            let key = symptom._id;
            content[index].symptom = content[index].symptom[0];
            if (language && language[key]) {
                content[index].symptom.name = language[key].name;
                content[index].symptom.description = language[key].description;
                content[index].symptom.relevance = language[key].relevance;
            }
            common.push(content[index]);
        }
    }

    return common;
};

async function translate_symptom_log(content, language) {
    let genderNames = null;
    if (language) {
        language = await StatisticsResource.findOne({
            language: language,
            title: "sypmtom-list",
        });
        genderNames = await StatisticsResource.findOne({
            language: language,
            title: "symptoms-name-list",
        });
        if (language) {
            language = language.fields[0];
        }
        if (genderNames) {
            genderNames = genderNames.criteria[0];
        }
    }

    if (language) {
        for (var index = 0; index < content.length; index++) {
            let symptoms = content[index].current_symptoms.symptoms;
            for (var symptomIndex in symptoms) {
                let symptom = symptoms[symptomIndex];
                let key = symptom._id;
                if (language[key]) {
                    symptom.name = language[key].name;
                    symptom.description = language[key].description;
                    symptom.relevance = language[key].relevance;
                }
            }
            if (genderNames) {
                content[index].user_id.gender =
                    genderNames[content[index].user_id.gender];
            }
        }
    }
}

function assign_risk_scores(logs){
    for (var index = 0; index < logs.length; index++) {
        let risk = logs[index].current_symptoms.risk_score || 0;
        let risk_lvl = "Low";
        if (risk <= 0.33) {
            risk_lvl = "Low";
        } else if (risk <= 0.66) {
            risk_lvl = "Medium";
        } else {
            risk_lvl = "High";
        }
        logs[index].current_symptoms.risk_score = risk;
        logs[index].current_symptoms.risk_score_level = risk_lvl;
    }
}
