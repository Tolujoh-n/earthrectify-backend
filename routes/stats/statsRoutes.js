const express = require("express");
const router = express.Router();
const { getStats } = require("./statsController");

router.get("/", getStats);

module.exports = router;
