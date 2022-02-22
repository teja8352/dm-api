const express = require("express");

const router = express.Router();

const WBController = require("../controllers/wb.controller");

router.get("/wb/:wb_id", WBController.get);

router.post("/wb/add", WBController.add);

module.exports = router;