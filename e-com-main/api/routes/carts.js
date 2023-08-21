const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.post("/", async function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).send("You must be logged in to add to cart");
    }
    const { product_id, quantity } = req.body;

    const carts = await query(//jegula akno order hoini mane just cart e add krsi
      "SELECT * FROM carts WHERE user_id = ? AND product_id = ? AND ordered = 0",
      [req.user.id, product_id]
    );

    if (carts.length > 0) {
      const cart = carts[0];
      const result = await query("UPDATE carts SET quantity = ? WHERE id = ?", [
        cart.quantity + quantity,
        cart.id,
      ]);//id er sate match kore cart er quantity update
      if (result.affectedRows === 0) {
        return res.status(400).send("Bad request");
      }
      return res.send("OK");
    }

    const result = await query(
      "INSERT INTO carts (product_id, quantity, user_id) VALUES (?, ?, ?)",
      [product_id, quantity, req.user.id]
    );//user er id,pro_id oigula cart e add krbo
    if (result.affectedRows === 0) {
      return res.status(400).send("Bad request");
    }
    res.send("OK");
  } catch (err) {
    next(err);
  }
});

router.get("/", async function (req, res, next) { // to show product name
  try {
    if (!req.user) {
      return res.status(401).send("You must be logged in to add to cart");
    }
    const carts = await query(
      "SELECT product_id as id, quantity FROM carts WHERE user_id = ? AND ordered = 0",
      [req.user.id]
    );

    return res.json(carts);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async function (req, res, next) { // for deleting from cart
  try {
    if (!req.user) {
      return res.status(401).send("You must be logged in to add to cart");
    }
    const result = await query(
      "DELETE FROM carts WHERE product_id = ? AND user_id = ?",
      [req.params.id, req.user.id]
    );
    console.log(req.params.id, result);
    if (result.affectedRows === 0) {
      return res.status(400).send("Bad request");
    }
    res.send("OK");
  } catch (err) {
    next(err);
  }
});

router.get("/orders", async function (req, res, next) { //History
  try {
    if (!req.user) {
      return res.status(401).send("You must be logged in to add to cart");
    }
    const orders = await query("SELECT * FROM orders WHERE user_id = ?", [
      req.user.id,
    ]);
    return res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.post("/orders", async function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).send("You must be logged in to add to cart");
    }

    const carts = await query(
      "SELECT * FROM carts WHERE user_id = ? AND ordered = 0",
      [req.user.id]
    );
    if (carts.length === 0) {
      return res.status(400).send("Bad reques (no cart)");
    }
    carts.forEach(async (cart) => {
      const orders = await query(
        "INSERT INTO orders (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [req.user.id, cart.product_id, cart.quantity]
      );
      if (orders.affectedRows === 0) {
        return res.status(400).send("Bad request (order update failed)");
      }
    });

    const products = await query("SELECT * FROM products");

    if (products.length === 0) {
      return res.status(400).send("Bad request (product fetch failed)");
    }

    const total = carts.reduce((acc, cart) => {
      return (
        acc +
        products.find((product) => product.id === cart.product_id).price *
          cart.quantity
      );
    }, 0);

    await query(
      "UPDATE users SET bank_balance = bank_balance - ? WHERE id = ?",
      [total, req.user.id]
    );

    const result = await query(
      "UPDATE carts SET ordered = 1 WHERE user_id = ?",
      [req.user.id]
    );
    if (result.affectedRows === 0) {
      return res.status(400).send("Bad request");
    }

    res.send("OK");
  } catch (err) {
    next(err);
  }
});

module.exports = router;//exports the router instance from the module.makes the router instance available to other parts of your application that import this module.
