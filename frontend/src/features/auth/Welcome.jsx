import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

const Welcome = () => {
	const date = new Date();
	const today = Intl.DateTimeFormat("en-US", {
		dateStyle: "full",
		timeStyle: "long",
	}).format(date);

	const { username, isAdmin, isManager } = useAuth();

	return (
		<section className="welcome">
			<p>{today}</p>
			<h1>Welcome! {username}</h1>
			<p>
				<Link to="/dash/notes">View techNotes</Link>
			</p>
			<p>
				<Link to="/dash/notes/new">Add New techNotes</Link>
			</p>
			{(isManager || isAdmin) && (
				<p>
					<Link to="/dash/users">View User Settings</Link>
				</p>
			)}
			{isManager ||
				(isAdmin && (
					<p>
						<Link to="/dash/users/new">Add New User</Link>
					</p>
				))}
		</section>
	);
};

export default Welcome;
