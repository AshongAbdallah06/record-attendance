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
	courseCode: string | null;
	name: string | null;
};
app.use((req, res, next) => {
	console.log(req.method, req.path);

	next();
});

function handleErrors(err: any) {
	const error = {};

	if (err.message.includes('violates unique constraint "lecturers_pkey"')) {
		return "An entry with the same course code already exists. Please use a unique value and try again.";
	}

	if (err.message.includes(' violates unique constraint "studentlist_pkey"')) {
		return "An entry with the same index number already exists. Please use a unique value and try again.";
	}

	if (err.message.includes('violates unique constraint "unq_name"')) {
		return "An entry with the same course title already exists. Please use a unique value and try again.";
	}
}

app.get("/std/:courseCode", async (req, res) => {
	const { courseCode } = req.params;
	const splitCode = courseCode.split("-");
	const newCourseCode = splitCode[0].toUpperCase() + "-" + splitCode[1];
	const groupid = splitCode[splitCode.length - 1];

	try {
		const sql = await pool.query(
			`SELECT * FROM STUDENTLIST WHERE COURSECODE = $1 AND GROUPID = $2`,
			[newCourseCode.toUpperCase(), groupid.toUpperCase()]
		);

		res.status(200).json(sql.rows);
	} catch (error) {
		console.log("🚀 ~ app.get ~ error:", error);
	}
});

app.get("/lec/:courseCode", async (req, res) => {
	const { courseCode } = req.params;
	const splitCode = courseCode.split("-");
	const newCourseCode = splitCode[0].toUpperCase() + "-" + splitCode[1];
	const groupid = splitCode[splitCode.length - 1];

	console.log(newCourseCode, groupid);

	try {
		const sql = await pool.query(
			`SELECT LAT, LONG FROM LECTURERS WHERE COURSECODE = $1 AND GROUPID = $2`,
			[newCourseCode.toUpperCase(), groupid.toUpperCase()]
		);

		res.status(200).json(sql.rows[0]);
	} catch (error) {
		console.log("🚀 ~ app.get ~ error:", error);
	}
});

app.post("/sign-in", async (req: Request, res: Response) => {
	const { fullName, courseCode, courseName, lat, long, time, groupid } = req.body;

	const check = await pool.query(
		`SELECT * FROM LECTURERS WHERE FULLNAME = $1 AND COURSENAME = $2 AND GROUPID = $3 AND COURSECODE = $4`,
		[
			fullName.toUpperCase(),
			courseName.toUpperCase(),
			groupid.toUpperCase(),
			courseCode.toUpperCase(),
		]
	);

	if (check.rowCount === 1) {
		res.status(403).json("An entry with the same details exists. Please try again.");
	} else {
		try {
			await pool.query(`INSERT INTO LECTURERS VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
				courseCode.toUpperCase(),
				fullName.toUpperCase(),
				lat,
				long,
				time,
				groupid.toUpperCase(),
				courseName.toUpperCase(),
			]);
			const sql: QueryResult<SignInType> = await pool.query(
				`SELECT * FROM LECTURERS WHERE COURSECODE = $1 `,
				[courseCode]
			);

			res.status(200).json(sql.rows[0]);
		} catch (error) {
			const errors = handleErrors(error);
			console.log(error);
			res.status(403).json(errors);
		}
	}
});

app.post("/save-user", async (req: Request, res: Response) => {
	const { fullName, indexNumber, groupid, courseCode, lat, long, time } = req.body;

	try {
		const validCourseID = await pool.query(
			`SELECT COURSECODE FROM LECTURERS WHERE COURSECODE = $1 AND GROUPID = $2`,
			[courseCode.toUpperCase(), groupid.toUpperCase()]
		);

		if (validCourseID.rowCount === 1) {
			const check = await pool.query(
				`SELECT * FROM STUDENTLIST WHERE FULLNAME = $1 AND INDEXNUMBER = $2 AND GROUPID = $3 AND COURSECODE = $4`,
				[
					fullName.toUpperCase(),
					indexNumber,
					groupid.toUpperCase(),
					courseCode.toUpperCase(),
				]
			);

			if (check.rowCount === 1) {
				res.status(403).json("An entry with the same details exists. Please try again.");
			} else {
				await pool.query(`INSERT INTO STUDENTLIST VALUES ($1, $2, $3, $4, $5, $6, $7)`, [
					fullName.toUpperCase(),
					courseCode.toUpperCase(),
					lat,
					long,
					time,
					groupid.toUpperCase(),
					indexNumber,
				]);

				res.status(200).json({ msg: "Student checked in." });
			}
		} else {
			res.status(403).json(
				"Invalid course code or group id entered. You have either entered a wrong code/ID or it has not been registered by your lecturer."
			);
		}
	} catch (error) {
		const errors = handleErrors(error);
		console.log("🚀 ~ app.post ~ errors:", error);
		console.log("🚀 ~ app.post ~ errors:", errors);
		res.status(403).json(errors);
	}
});

// todo; Add foreign key to student table. Add id's to both tables

const { PORT } = process.env;
app.listen(PORT, () => {
	console.log("Listening to PORT ", PORT);
});
