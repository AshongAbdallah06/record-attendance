import { yupResolver } from "@hookform/resolvers/yup";
import Axios from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { StudentType } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";

const CheckIn = () => {
	const { studentList, setStudentList } = useContextProvider();

	const Schema = yup.object().shape({
		fullName: yup
			.string()
			.matches(/^[^!@#$%^&*()_+=]+ [aA-zZ ]+$/, "Please enter your full name")
			.required(),
		indexNumber: yup
			.string()
			.matches(/^[0-9]{10}$/, "Please enter a valid index number")
			.required(),
		courseCode: yup
			.string()
			.matches(/^[Aa-zZ]{3,4}-[0-9]{3,4}$/, "Please enter a valid course code")
			.required(),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(Schema),
	});

	const formSubmit = async (data: Omit<StudentType, "time" | "long" | "lat">) => {
		if (!data) return;

		const newFormInput: StudentType = {
			fullName: data.fullName,
			indexNumber: data.indexNumber,
			time: new Date(),
			long: 0,
			lat: 0,
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;

					newFormInput.lat = Number(latitude.toFixed(2));
					newFormInput.long = Number(longitude.toFixed(2));

					const found = studentList.findIndex((i) => i.indexNumber === data.indexNumber);

					if (found !== -1) {
						console.log(found);
						alert("You have already checked in");
					} else {
						console.log(found);
						setStudentList([...(studentList || []), newFormInput]);
					}
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);

			return true;
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
		const res = await Axios.post("http://localhost:8188/save-user", data);
		const userData = res.data;
		console.log(data);
	};

	useEffect(() => {
		localStorage.setItem("studentList", JSON.stringify(studentList));
	}, [studentList]);

	return (
		<main>
			<form
				className="flex"
				onSubmit={handleSubmit(formSubmit)}
			>
				<label htmlFor="full-name">Course Code</label>
				<div className="group">
					<input
						type="text"
						placeholder="e.g., ENG-271"
						{...register("courseCode")}
					/>
					<p className="error">{errors && errors.courseCode?.message}</p>
				</div>

				<label htmlFor="full-name">Full Name</label>
				<div className="group">
					<input
						type="text"
						{...register("fullName")}
					/>
					<p className="error">{errors && errors.fullName?.message}</p>
				</div>

				<label htmlFor="full-name">Index Number</label>
				<div className="group">
					<input
						type="text"
						maxLength={10}
						{...register("indexNumber")}
					/>
					<p className="error">{errors && errors.indexNumber?.message}</p>
				</div>

				<div className="group">
					<button>Check In</button>
				</div>
			</form>
		</main>
	);
};

export default CheckIn;
