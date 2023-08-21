const mysql = require("mysql2/promise");

async function query(sql, params) {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  const [rows, _] = await connection.execute(sql, params);
  connection.end();
  if (!rows) return [];
  return rows;
}

module.exports = {
  query,
};
