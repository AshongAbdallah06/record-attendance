import { Link } from "react-router-dom";
import searchIcon from "../images/search-outline.svg";

const Nav = () => {
	return (
		<header className="flex">
			<nav className="flex">
				<Link to="/">
					<h1>GROUP E</h1>
				</Link>

				<div className="middle flex">
					<input
						type="text"
						placeholder="Search name"
					/>
					<button>
						<img
							src={searchIcon}
							alt="search button"
							className="search-icon"
						/>
					</button>
				</div>

				<div className="right">
					<p>Course Name</p>
					<p>Lecturer Name</p>
				</div>
			</nav>
		</header>
	);
};

export default Nav;
