import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useContextProvider from "../hooks/useContextProvider";

const Home = () => {
	const { studentList } = useContextProvider();

	const [lecturerLongitude, setLecturerLongitude] = useState(0);
	const [lecturerLatitude, setLecturerLatitude] = useState(0);

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const latitude = position.coords.latitude;
					const longitude = position.coords.longitude;

					setLecturerLongitude(Number(longitude.toFixed(2)));
					setLecturerLatitude(Number(latitude.toFixed(2)));
					console.log(
						`LECTURER'S Latitude: ${latitude.toFixed(
							2
						)}, Longitude: ${longitude.toFixed(2)}`
					);
				},
				(error) => {
					console.error("Error getting location:", error);
				}
			);
		} else {
			console.error("Geolocation is not supported by this browser.");
		}
	}, []);
	return (
		<main>
			{/* <h3>Student List</h3> */}

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
						{studentList &&
							studentList.map((student, index) => (
								<tr
									className="list"
									key={student.indexNumber}
								>
									<td>{index + 1}</td>
									<td>{student.fullName}</td>
									<td>{student.indexNumber}</td>
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
							))}
					</tbody>
				</table>
			</div>

			<div className="check-in">
				<Link
					to="/check-in"
					className="btn"
				>
					Check In
				</Link>
			</div>
		</main>
	);
};

export default Home;
