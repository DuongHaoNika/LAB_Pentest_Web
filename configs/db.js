import { Pool } from 'pg';
require('dotenv').config()
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // default Postgres port
  database: process.env.DATABASE
});
const query = (text, params) => pool.query(text, params)
export {
  query
};