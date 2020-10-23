const CitizenSymptom = require("../models/CitizenSymptomsModel");

function setStartDate(req) {
    if (req.query.start_date != null) {
        return "" + new Date(req.query.start_date).toISOString().slice(0, 10);
    } else {
        const date = new Date();
        date.setDate(date.getDate() - 7);
        return "" + date.toISOString().slice(0, 10);
    }
}

function setEndDate(req) {
    let end_date = new Date(req.query.end_date);
    let date = new Date();
    date.setHours(date.getHours() - 7 + date.getTimezoneOffset() / 60);

    if (req.query.end_date != null && end_date < date) {
        return "" + end_date.toISOString().slice(0, 10);
    } else {
        return "" + date.toISOString().slice(0, 10);
    }
}

exports.get_citizens_with_symptoms = async (req, res) => {
    try {
        let startDate = new Date(
            Date.parse(setStartDate(req) + "T21:00:00.000Z")
        );
        let endDate = new Date(Date.parse(setEndDate(req) + "T21:00:00.000Z"));

        const citizens = await CitizenSymptom.find({
            date: {
                $gte: startDate,
                $lte: endDate,
            },
        }).sort("date");
        res.send(citizens);
    } catch (err) {
        res.status(500).send(err.toString());
    }
};
