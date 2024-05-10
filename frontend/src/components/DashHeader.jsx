// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useSendLogoutMutation } from "../features/auth/authApiSlice";
// import { useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";

// const DASH_REGEX = /^\/dash(\/)?$/;
// const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
// const USERS_REGEX = /^\/dash\/users(\/)?$/;

// const DashHeader = () => {
// 	const [sendLogout, {
// 		isLoading, isSuccess, isError, error
// 	}] = useSendLogoutMutation()
// 	const navigate = useNavigate();
// 	const { pathname } = useLocation();

// 	useEffect(() => {
// 		if (isSuccess) {
// 			navigate("/")
// 		}
// 	}, [isSuccess, navigate])

// 	if (isLoading) return <p>Logging Out...</p>;

// 	if (isError) return <p>Error: {error.data?.message}</p>;

// 	let dashClass = null;
// 	if (
// 		!DASH_REGEX.test(pathname) &&
// 		!NOTES_REGEX.test(pathname) &&
// 		!USERS_REGEX.test(pathname)
// 	) {
// 		dashClass = "dash-header__container--small";
// 	}
// 	const logoutButton = (
// 		<button className="icon-button" title="Logout" onClick={sendLogout}>
// 			<FontAwesomeIcon icon={faRightFromBracket} />
// 		</button>
// 	);
//    const content = (
// 			<header className="dash-header">
// 				<div className={`dash-header__container ${dashClass}`}>
// 					<Link to="/dash">
// 						<h1 className="dash-header__title">techNotes</h1>
// 					</Link>
// 					<nav className="dash-header__nav">
// 						{/* add more buttons later */}
// 						{logoutButton}
// 					</nav>
// 				</div>
// 			</header>
// 	);
// 	return content;
// };

// export default DashHeader;

import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faRightFromBracket,
	faUserPlus,
	faFileCirclePlus,
	faUserGear,
	faFile,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, Link, useLocation } from "react-router-dom";

import { useSendLogoutMutation } from "../features/auth/authApiSlice";
import useAuth from "../hooks/useAuth";

const DASH_REGEX = /^\/dash(\/)?$/;
const NOTES_REGEX = /^\/dash\/notes(\/)?$/;
const USERS_REGEX = /^\/dash\/users(\/)?$/;

const DashHeader = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const [sendLogout, { isLoading, isSuccess, isError, error }] =
		useSendLogoutMutation();
	const { isManager, isAdmin } = useAuth();

	console.log("isSuccess", isSuccess);
	useEffect(() => {
		if (isSuccess) navigate("/");
	}, [isSuccess, navigate]);

	let dashClass = null;
	if (
		!DASH_REGEX.test(pathname) &&
		!NOTES_REGEX.test(pathname) &&
		!USERS_REGEX.test(pathname)
	) {
		dashClass = "dash-header__container--small";
	}

	const onNewNoteClicked = () => navigate("/dash/notes/new");
	const onNewUserClicked = () => navigate("/dash/users/new");
	const onUsersClicked = () => navigate("/dash/users");
	const onNotesClicked = () => navigate("/dash/notes");

	let newNoteButton = null;
	if (NOTES_REGEX.test(pathname)) {
		newNoteButton = (
			<button
				className="icon-button"
				title="New Note"
				onClick={onNewNoteClicked}
			>
				<FontAwesomeIcon icon={faFileCirclePlus} />
			</button>
		);
	}

	let newUserButton = null;
	if (USERS_REGEX.test(pathname)) {
		newUserButton = (
			<button
				className="icon-button"
				title="New User"
				onClick={onNewUserClicked}
			>
				<FontAwesomeIcon icon={faUserPlus} />
			</button>
		);
	}

	let userButton = null;
	if (isManager || isAdmin) {
		if (!USERS_REGEX.test(pathname) && pathname.includes("/dash")) {
			userButton = (
				<button className="icon-button" title="Users" onClick={onUsersClicked}>
					<FontAwesomeIcon icon={faUserGear} />
				</button>
			);
		}
	}

	let noteButton = null;
	if (!NOTES_REGEX.test(pathname) && pathname.includes("/dash")) {
		noteButton = (
			<button className="icon-button" title="Notes" onClick={onNotesClicked}>
				<FontAwesomeIcon icon={faFile} />
			</button>
		);
	}

	const logoutButton = (
		<button className="icon-button" title="Logout" onClick={sendLogout}>
			<FontAwesomeIcon icon={faRightFromBracket} />
		</button>
	);

	const errClass = isError ? "errMsg" : "offscreen";

	let buttonContent = null;
	if (isLoading) {
		buttonContent = <p>Logging Out...</p>;
	} else {
		buttonContent = (
			<>
				{newNoteButton}
				{newUserButton}
				{noteButton}
				{userButton}
				{logoutButton}
			</>
		);
	}

	const content = (
		<>
			<p className={errClass}>{error?.data?.message}</p>
			<header className="dash-header">
				<div className={`dash-header__container ${dashClass}`}>
					<Link to="/dash">
						<h1 className="dash-header__title">techNotes</h1>
					</Link>
					<nav className="dash-header__nav">{buttonContent}</nav>
				</div>
			</header>
		</>
	);

	return content;
};
export default DashHeader;
