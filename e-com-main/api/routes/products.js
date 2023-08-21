const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/", async function (req, res, next) {
  try {
    const products = await query("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
