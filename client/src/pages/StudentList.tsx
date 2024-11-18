import Axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LocationType, StudentType } from "../exports/exports";
import useContextProvider from "../hooks/useContextProvider";
import useFunctions from "../hooks/useFunctions";

const StudentList = () => {
	const {
		studentList,
		setStudentList,
		setLecturerLatitude,
		setLecturerLongitude,
		lecturerLongitude,
		lecturerLatitude,
	} = useContextProvider();
	const { getStorageItem } = useFunctions();

	const getStudentList = async (courseCode: string, groupid: string) => {
		try {
			const res = await Axios.get(
				`http://localhost:8198/std/${courseCode + "-" + groupid.toUpperCase()}`
			);
			const data: StudentType[] = res.data;

			if (data.length >= 1) {
				setStudentList(data);
			} else {
				setEmpty("No match found for search.");
			}
		} catch (error) {
			console.log("🚀 ~ getStudentList ~ error:", error);
		}
	};

	const getLecturersLocation = async (courseCode: string, groupid: string) => {
		try {
			const res = await Axios.get(
				`http://localhost:8198/lec/${courseCode + "-" + groupid.toUpperCase()}`
			);

			const { lat, long }: LocationType = res.data;

			setLecturerLatitude(Number(lat.toFixed(2)));
			setLecturerLongitude(Number(long.toFixed(2)));
		} catch (error) {
			setEmpty("Could not get your location.");

			console.log("🚀 ~ getStudentList ~ error:", error);
		}
	};

	const lec = getStorageItem("lec", null);

	const [empty, setEmpty] = useState("");
	useEffect(() => {
		// todo = also check lecturers name and coursename
		if (lec?.coursecode && lec?.groupid) {
			getLecturersLocation(lec?.coursecode, lec?.groupid);

			if (lecturerLongitude && lecturerLatitude) {
				getStudentList(lec?.coursecode, lec?.groupid);
			} else {
				setEmpty("Could not get your location.");
			}
		}
	}, []);

	return (
		<main>
			<form onSubmit={(e) => e.preventDefault()}>
				<div className="group shared">
					<div>{lec?.coursecode}</div>
					<div>GROUP {lec?.groupid}</div>

					<button
						onClick={() => {
							if (lec?.coursecode && lec?.groupid)
								getStudentList(lec?.coursecode, lec?.groupid);
						}}
					>
						Refresh
					</button>
				</div>
			</form>

			<div className="display-list">
				<table>
					<thead>
						<tr className="list header">
							<th>No.</th>
							<th>FullName</th>
							<th>Index No.</th>
							<th>Time</th>
							<th>Present</th>
						</tr>
					</thead>
					<tbody>
						{studentList.length > 0 ? (
							studentList.map((student, index) => (
								<tr
									className="list"
									key={student.indexnumber}
								>
									<td>{index + 1}</td>
									<td>{student.fullname}</td>
									<td>{student.indexnumber}</td>
									<td>
										{formatDistanceToNow(student.time, { addSuffix: true })}
									</td>
									<td>
										{lecturerLatitude === student.lat &&
										lecturerLongitude === student.long
											? "IN"
											: "NOT IN"}
									</td>
								</tr>
							))
						) : (
							<p className="empty">{empty}</p>
						)}
					</tbody>
				</table>
			</div>

			<div className="check-in">
				<Link
					to="/std/check-in"
					className="btn"
				>
					Check In
				</Link>
			</div>
		</main>
	);
};

export default StudentList;
