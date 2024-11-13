import cors from "cors";
import { config } from "dotenv";
import express, { Request, Response } from "express";
import { QueryResult } from "pg";
import { pool } from "./db";
config();

const app = express();
app.use(cors());
app.use(express.json());

export type SignInType = {
	id: string | null;
	name: string | null;
};
app.use((req, res, next) => {
	console.log(req.method, req.path);

	next();
});

function handleErrors(err: any) {
	const error = {};

	if (err.message.includes(`duplicate key value violates unique constraint "lecturers_pkey"`)) {
		return "LecturerID is already in use";
	}
}

app.post("/sign-in", async (req: Request, res: Response) => {
	const { fullName, courseId, courseName } = req.body;
	console.log(courseId, fullName.toUpperCase(), courseName);

	try {
		const sql: QueryResult<SignInType> = await pool.query(
			`INSERT INTO LECTURERS VALUES ($1, $2, $3)`,
			[courseId, fullName.toLowerCase(), courseName.toLowerCase()]
		);
		console.log(sql.rows);

		res.json({ msg: "ok" });
	} catch (error) {
		const errors = handleErrors(error);
		console.log("🚀 ~ app.post ~ errors:", errors);
		res.status(403).json(errors);
	}
});

app.post("/save-user", async (req: Request, res: Response) => {
	const { fullName, indexNumber, courseCode } = req.body;
	console.log(fullName, indexNumber);

	try {
		const sql = await pool.query(`INSERT INTO STUDENTLIST VALUES ($1, $2, $3)`, [
			fullName,
			indexNumber,
			courseCode,
		]);
		res.json({ msg: "Hola Expresso" });
	} catch (error) {
		console.log("🚀 ~ app.post ~ error:", error);
	}
});

const { PORT } = process.env;
app.listen(PORT, () => {
	console.log("Listening to PORT ", PORT);
});
