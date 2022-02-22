const WBModel = require("../models/wb.model");

const get = (req, res, next) => {
    WBModel.get(req.params.wb_id).then((resp) => {
        const status = resp?.is_wb_id_found === false ? 404 : 200;
        res.status(status).json({ ...resp, status });
    }, err => {
        console.error("Error while getting wb data:::::::::::::::::\n", err);
        res.status(400).json({ ...err });
    });
};

const add = (req, res, next) => {
    WBModel.add(req.body).then((resp) => {
        const status = resp?.is_wb_id_found === false ? 404 : 200;
        res.status(200).json({ ...resp, status });
    }, err => {
        console.error("Error while adding wb data:::::::::::::::::\n", err);
        res.status(400).json({ ...err });
    });
};

module.exports = { get, add };
