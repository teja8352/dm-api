const testimonialModel = require("../models/testimonial.model");

const get = (req, res, next) => {
    testimonialModel.get(req.params.wb_id).then((resp) => {
        res.status(200).json({ ...resp });
    }, err => {
        console.error("Error while getting testimonials:::::::::::::::::\n", err);
        res.status(400).json({ ...err });
    });
};

const add = (req, res, next) => {
    testimonialModel.add(req.body).then((resp) => {
        res.status(200).json({ ...resp });
    }, err => {
        console.error("Error while adding testimonial:::::::::::::::::\n", err);
        res.status(400).json({ ...err });
    });
};

const remove = (req, res, next) => {
    testimonialModel.remove(req.params.uuid).then((resp) => {
        res.status(200).json({ ...resp });
    }, err => {
        console.error("Error while removing testimonial:::::::::::::::::\n", err);
        res.status(400).json({ ...err });
    });
};

module.exports = { get, add, remove };
