import { useSelector } from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice.js";
import { jwtDecode } from "jwt-decode";

const useAuth = () => {
	const token = useSelector((state) => selectCurrentToken(state));
	let isAdmin = false;
	let isManager = false;
	let status = "Employee";

	if (token) {
		const decoded = jwtDecode(token);
		const { userName: username, roles } = decoded.UserInfo;

		isManager = roles.includes("Manager");
		isAdmin = roles.includes("Admin");

		if (isManager) status = "Manager";
		if (isAdmin) status = "Admin";

		return { username, roles, isAdmin, isManager, status };
	}

	return { username: "", roles: [], status, isAdmin, isManager };
};

export default useAuth;
