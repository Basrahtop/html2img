const express = require("express");
const presets = require("../utils/presets.json");

const router = express.Router();

router.get("/", (req, res) => {
  res.json(presets);
});

module.exports = router;
