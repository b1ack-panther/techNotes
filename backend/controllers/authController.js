// const User = require("../models/User.js");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const asyncHandler = require("express-async-handler");

// const login = asyncHandler(async (req, res) => {
// 	const { userName, password } = req.body;
// 	if (!userName || !password) {
// 		return res.status(400).json({ message: "All fields are required" });
// 	}

// 	const foundUser = await User.findOne({ userName }).exec();
// 	if (!foundUser || !foundUser.active) {
// 		return res.status(401).json({ message: "Unauthorized" });
// 	}

// 	const match = await bcrypt.compare(password, foundUser.password);
// 	if (!match) {
// 		return res.status(401).json({ message: "Wrong password" });
// 	}

// 	const accessToken = jwt.sign(
// 		{
// 			UserInfo: {
// 				userName: foundUser.userName,
// 				roles: foundUser.roles,
// 			},
// 		},
// 		process.env.ACCESS_TOKEN_SECRET,
// 		{ expiresIn: "10s" }
// 	);

// 	const refreshToken = jwt.sign(
// 		{
// 			UserInfo: { userName: foundUser.userName },
// 		},
// 		process.env.REFRESH_TOKEN_SECRET,
// 		{ expiresIn: "1d" }
// 	);

// 	res.cookie("jwt", refreshToken, {
// 		httpOnly: true,
// 		secure: true,
// 		maxAge: 1000 * 60 * 60 * 24 * 7,
// 		sameSite: "none",
// 	});

// 	res.json({ accessToken });
// });

// const refresh = (req, res) => {
// 	const cookies = req.cookies;
// 	if (!cookies?.jwt) {
// 		return res.status(401).json({ message: "Unauthorized.." });
// 	}

// 	const refreshToken = cookies.jwt;
// 	jwt.verify(
// 		refreshToken,
// 		process.env.REFRESH_TOKEN_SECRET,
// 		asyncHandler(async (err, decoded) => {
// 			if (err) {
// 				return res.status(403).json({ message: "Forbidden" });
// 			}
// 			const foundUser = await User.findOne({
// 				userName: decoded.UserInfo.userName,
// 			}).exec();
// 			if (!foundUser) {
// 				return res.status(400).json({ message: "Unauthorized" });
// 			}

// 			const accessToken = jwt.sign(
// 				{
// 					userInfo: {
// 						userName: foundUser.userName,
// 						roles: foundUser.roles,
// 					},
// 				},
// 				process.env.ACCESS_TOKEN_SECRET,
// 				{ expiresIn: "10s" }
// 			);
// 			res.json({ accessToken });
// 		})
// 	);
// };

// const logout = asyncHandler(async (req, res) => {
// 	const cookies = req.cookies;

// 	if (!cookies?.jwt) {
// 		return res.sendStatus(204);
// 	}
// 	res.clearCookie("jwt", {
// 		httpOnly: true,
// 		secure: true,
// 		sameSite: "none",
// 	});
// 	res.json({ message: "cookies cleared" });
// });

// module.exports = { login, refresh, logout };

const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
	const { userName, password } = req.body;
	
	if (!userName || !password) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const foundUser = await User.findOne({ userName }).exec();

	if (!foundUser || !foundUser.active) {
		return res.status(401).json({ message: "Unauthorized" });
	}

	const match = await bcrypt.compare(password, foundUser.password);

	if (!match) return res.status(401).json({ message: "Unauthorized" });

	const accessToken = jwt.sign(
		{
			UserInfo: {
				userName: foundUser.userName,
				roles: foundUser.roles,
			},
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: "10m" }
	);

	const refreshToken = jwt.sign(
		{ userName: foundUser.userName },
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: "7d" }
	);

	// Create secure cookie with refresh token
	res.cookie("jwt", refreshToken, {
		httpOnly: true, //accessible only by web server
		secure: true, //https
		sameSite: "None", //cross-site cookie
		maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
	});

	// Send accessToken containing userName and roles
	res.json({ accessToken });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt)
		return res.status(401).json({ message: "no jwt found in cookies" });

	const refreshToken = cookies.jwt;

	jwt.verify(
		refreshToken,
		process.env.REFRESH_TOKEN_SECRET,
		async (err, decoded) => {
			if (err) return res.status(403).json({ message: "Forbidden" });

			const foundUser = await User.findOne({
				userName: decoded.userName,
			}).exec();

			if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

			const accessToken = jwt.sign(
				{
					UserInfo: {
						userName: foundUser.userName,
						roles: foundUser.roles,
					},
				},
				process.env.ACCESS_TOKEN_SECRET,
				{ expiresIn: "10m" }
			);

			res.json({ accessToken });
		}
	);
};

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
	const cookies = req.cookies;
	if (!cookies?.jwt) return res.sendStatus(204); //No content
	res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
	res.json({ message: "Cookie cleared" });
};

module.exports = {
	login,
	refresh,
	logout,
};
