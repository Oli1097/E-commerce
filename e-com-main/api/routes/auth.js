const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();
const { query } = require("../db");

router.post("/", async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Invalid password" });
    }

    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const results = await query("SELECT * FROM users WHERE email = ?", [email]);
    if (results.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    const result = results[0];

    const check = bcrypt.compareSync(password, result.password);//return boolean value wether the pass is mathced

    if (!check) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const salt = await bcrypt.genSalt(10);
    const tokenHash = await bcrypt.hash(email, salt);

    const token = await query(
      "INSERT INTO tokens (user_id, token) VALUES (?, ?)",
      [result.id, tokenHash]
    );

    if (token.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to create token" });
    }

    return res.json({ user: result, token: tokenHash });
  } catch (err) {
    next(err);
  }
});

router.get("/", async function (req, res) {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  return res.json(req.user);
});

router.post("/signup", async function (req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (name.length < 4) {
      return res
        .status(400)
        .json({ message: "Name must be at least 4 characters long" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (email.length < 5 || !email.includes("@")) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await query(
      "INSERT INTO users (name, email, password, role, bank_balance) VALUES (?, ?, ?, 'customer', 500)",
      [name, email, hashedPassword]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to create user" });
    }

    const tokenHash = await bcrypt.hash(email, salt);

    const token = await query(
      "INSERT INTO tokens (user_id, token) VALUES (?, ?)",
      [result.insertId, tokenHash]
    );

    if (token.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to create token" });
    }

    const users = await query("SELECT * from users WHERE email = ?", [email]);
    if (users.length === 0) {
      res.status(400, { message: "Refresh and log in" });
    }
    const user = users[0];
    res.json({ user:user, token: tokenHash });
  } catch (err) {
    next(err);
  }
});

router.post("/bank", async function (req, res, next) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { bank_ac, bank_secret } = req.body;

    if (!bank_ac || !bank_secret) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (bank_ac.length < 8) {
      return res
        .status(400)
        .json({ message: "Bank AC must be at least 8 characters long" });
    }
    if (bank_secret.length < 6) {
      return res
        .status(400)
        .json({ message: "Bank secret must be at least 6 characters long" });
    }

    const result = await query(
      "UPDATE users SET bank_ac = ?, bank_secret = ? WHERE id = ?",
      [bank_ac, bank_secret, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Failed to update bank details" });
    }

    return res.json({ ...req.user, bank_ac, bank_secret });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
