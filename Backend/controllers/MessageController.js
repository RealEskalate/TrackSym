const { Message } = require("../models/MessageModel.js");
const _ = require('lodash')

exports.getAllMessages = async (req, res) => {
    const messages = await Message.find({});
    try {
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send("Error " + error.toString());
    }
};

exports.postMessage = async (req, res) => {
    const message = new Message(_.pick(req.body, ["name", "email", "message"]))
    try {
        await message.save();
        res.status(201).send(message);
    } catch (error) {
        res.status(500).send("Invalid request " + error.toString());
    }
};

exports.getMessageById = async (req, res) => {
    try {
        let message = await Message.findById(req.params.id);
        if (!message) {
            return res.status(404).send("Message Not Found");
        }
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send("Error " + error.toString());
    }
};

exports.getMessageByEmail = async (req, res) => {
    try {
        let messages = await Message.find({ email: req.params.email });
        res.status(200).send(messages);
    } catch (error) {
        res.status(500).send("Error " + error.toString());
    }
};


exports.deleteMessages = async (req, res) => {
    try {
        let message = await Message.findByIdAndRemove(req.body._id);
        if (!message) {
            return res.status(404).send("Message not found");
        }
        res.status(200).send(message);
    } catch (error) {
        res.status(500).send("Error " + error.toString());
    }
};