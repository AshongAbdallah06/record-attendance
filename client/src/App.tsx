import { Navigate, Route, Routes } from "react-router-dom";
import Nav from "./components/Nav";
import CheckIn from "./pages/CheckIn";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";

const App = () => {
	return (
		<>
			<Nav />
			<Routes>
				<Route
					path="/"
					element={<Navigate to="/l/home" />}
				/>
				<Route
					path="/l/home"
					element={<Home />}
				/>
				<Route
					path="/l/sign-in"
					element={<SignIn />}
				/>
				<Route
					path="/check-in"
					element={<CheckIn />}
				/>
			</Routes>
		</>
	);
};

export default App;
