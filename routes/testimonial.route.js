const express = require("express");

const router = express.Router();

const testimonialController = require("../controllers/testimonial.controller");

router.get("/testimonial", testimonialController.get);

router.post("/testimonial/add", testimonialController.add);

router.delete("/testimonial/delete/:uuid", testimonialController.remove);

module.exports = router;