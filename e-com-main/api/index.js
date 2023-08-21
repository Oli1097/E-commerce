require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { query } = require("./db");

const app = express();

const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async function (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      req.user = null;
      return next();
    }

    const token = await query("SELECT * FROM tokens WHERE token = ?", [
      authHeader,
    ]);

    if (token.length === 0) {
      req.user = null;
      return next();
    }

    const result = await query(
      "SELECT id, role, name, email, bank_ac, bank_balance, bank_secret FROM users WHERE id = ?",
      [token[0].user_id]
    );

    if (result.length === 0) {
      req.user = null;
      return next();
    }

    req.user = result[0];
    return next();
  } catch (err) {
    req.user = null;
    return next();
  }
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});//the route handler function. 

app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/carts", require("./routes/carts"));
app.use("/admin", require("./routes/admin"));
app.use("/supplier", require("./routes/supplier"));

app.use((err, _, res, __) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
