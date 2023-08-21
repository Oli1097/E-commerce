const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.get("/", async function (req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).send("You must be an admin to view this page");
    }
    const orders = await query(
      "SELECT orders.*, users.bank_ac FROM orders LEFT JOIN users ON orders.user_id = users.id"
    ); 
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(401).send("You must be an admin to view this page");
    }
    const { status, id } = req.body;
    const check = await query("UPDATE orders SET status = ? WHERE id = ?", [
      status,
      id,
    ]);//je order ashe oitar status update korbe admin
    if (check.affectedRows === 0) {
      return res.status(400).send("Bad request");
    }

    const orders = await query("SELECT * FROM orders WHERE id = ?", [id]);//je order ashe oitar information fetch
    if (orders.length === 0) {
      return res.status(400).send("Bad request");
    }
    const order = orders[0];

    const products = await query("SELECT * FROM products WHERE id = ?", [
      order.product_id,
    ]); //order_id milabo product table er sate jate hisab krte subida hoi
    if (products.length === 0) {
      return res.status(400).send("Bad request");
    }
    const product = products[0];
    const total = product.price * order.quantity;

    if (status === 1) {
      await query(
        "UPDATE users SET bank_balance = bank_balance + ? WHERE role = 'supplier'",
        [total * 0.85]
      );
      await query(
        "UPDATE users SET bank_balance = bank_balance + ? WHERE role = 'admin'",
        [total * 0.15]
      );
    } else if (status === 3) {
      await query(
        "UPDATE users SET bank_balance = bank_balance + ? WHERE id = ?",
        [total, order.user_id]
      );
    }
    res.send("OK");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
