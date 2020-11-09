const { StatisticsResource } = require("../models/StatisticsResourceModel.js");
var mongoose = require("mongoose");

exports.postStatisticsResource = async(req, res) => {
    let statisticsResource = new StatisticsResource({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        description: req.body.description,
        language: req.body.language,
        fields: req.body.fields,
        criteria: req.body.criteria,
    });

    try {
        await statisticsResource.save();
        res.status(200).send(statisticsResource);

    } catch (error) {
        console.log("error isss " + error);
        res.status(500).send("Invalid request " + error);
    }
};

exports.getStatisticsResourceById = async(req, res) => {
    try {
        let statisticsResource = await StatisticsResource.findById({ _id: req.params.id });
        res.status(200).send(statisticsResource);
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getStatisticsResourceByFields = async(req, res) => {
    let filters = {language:"English"}

    if(req.query.language){
        filters.language = req.query.language
    }

    if(req.query.title){
        filters.title = req.query.title
    }

    let statisticsResource = await StatisticsResource.find(filters);
    return res.status(200).send(statisticsResource);
};


exports.updateStatisticsResource = async(req, res) => {
    try {
        let updatedStatisticsResource = await StatisticsResource.findByIdAndUpdate(req.params.id, req.body,{new: true});
        return res.send(updatedStatisticsResource);
      
    } catch (error) {
        console.log("error is " + error);
        return res.status(500).send(error);
    }
};


exports.deleteStatisticsResource = async(req, res) => {
    try {
        let statisticsResource = await StatisticsResource.findByIdAndRemove(req.params.id);
        if (!statisticsResource) {
            res.status(404).send("stat resource not found");
        }
        res.status(200).send(statisticsResource);
    } catch (error) {
        console.log("Encountered an error " + error);
        res.status(500).send(error);
    }
};