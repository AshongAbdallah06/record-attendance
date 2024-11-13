import { yupResolver } from "@hookform/resolvers/yup";
import Axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { SignInType } from "../exports/exports";

const SignIn = () => {
	const Schema = yup.object().shape({
		courseId: yup
			.string()
			.required("This field is required")
			.matches(/^[Aa-zZ]{3,4}-[0-9]{3,4}$/, "Please enter a valid course id"),
		courseName: yup
			.string()
			.required("This field is required")
			.min(8, "name must be at least 8 characters")
			.matches(/^[^!@#$%^&*()_+=]+ [aA-zZ ]+$/, "Please enter a valid course name"),
		fullName: yup
			.string()
			.required("This field is required")
			.min(8, "name must be at least 8 characters")
			.matches(/^[^!@#$%^&*()_+=]+ [aA-zZ ]+$/, "Please enter a valid name"),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(Schema),
	});

	const [error, setError] = useState<SignInType | null>({
		courseId: "",
		courseName: "",
		fullName: "",
	});

	const formSubmit = async (data: SignInType) => {
		try {
			const response = await Axios.post(
				// "https://rock-paper-scissors-app-iybf.onrender.com/api/user/login",
				"http://localhost:8188/sign-in",
				data
			);

			const user = await response.data;

			// window.location.href = "/";
		} catch (err: any) {
			console.log(err);
		}
	};

	// useEffect(() => {
	// 	formSubmit();
	// }, []);

	return (
		<main>
			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="id">ENTER COURSE ID</label>
				<div className="group">
					<input
						type="text"
						maxLength={10}
						{...register("courseId")}
					/>
					<p className="error">{errors && errors.courseId?.message}</p>
				</div>

				<label htmlFor="course-name">ENTER COURSE NAME</label>
				<div className="group">
					<input
						type="text"
						{...register("courseName")}
					/>
					<p className="error">{errors && errors.courseName?.message}</p>
				</div>

				<label htmlFor="fullName">ENTER YOUR NAME</label>
				<div className="group">
					<input
						type="text"
						{...register("fullName")}
					/>
					<p className="error">{errors && errors.fullName?.message}</p>
				</div>

				<div className="group">
					<button>Check In</button>
				</div>
			</form>
		</main>
	);
};

export default SignIn;
