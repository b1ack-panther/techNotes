import { faHouse } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const DashFooter = () => {
	const navigate = useNavigate();
	const { pathName } = useLocation();
	const { username, status } = useAuth();

	const onGoHomeClicked = () => navigate("/dash");

	let goHomeButton = null;
	if (pathName !== "/dash") {
		goHomeButton = (
			<button
				className="dash-footer__button icon-button"
				title="Home"
				onClick={onGoHomeClicked}
			>
				<FontAwesomeIcon icon={faHouse} />
			</button>
		);
	}

	return (
		<div className="dash-footer">
			{goHomeButton}
			<p>Current User: {username}</p>
			<p>Status: {status}</p>
		</div>
	);
};

export default DashFooter;
