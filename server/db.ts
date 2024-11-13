import dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env

import { Pool } from "pg";

export const pool = new Pool({
	host: process.env.HOST,
	database: process.env.DATABASE,
	port: Number(process.env.DBPORT),
	user: process.env.DB_USER,
	password: process.env.PASSWORD,
});
