const User = require("../models/User.js");
const Note = require("../models/Note.js");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

const getAllUsers = asyncHandler(async (req, res) => {
	const users = await User.find().select("-password").lean();
	if (!users?.length)
		return res.status(400).json({ message: "No User found." });
	res.json(users);
});

const createNewUser = asyncHandler(async (req, res) => {
	const { userName, password, roles } = req.body;
	if (!userName || !password) {
		return res.status(400).json({ message: "Missing required data" });
	}

	const duplicate = await User.findOne({ userName: new RegExp("^" + userName + "$", "i") }).lean().exec();
	if (duplicate) {
		return res.status(409).json({ message: "User already exists" });
	}

	const hashedPwd = await bcrypt.hash(password, 10);
	const userObj = (!Array.isArray(roles) || !roles.length) ? { userName, password: hashedPwd }: { userName, password: hashedPwd, roles };
	const user = await User.create(userObj);
	if (user) {
		return res
			.status(201)
			.json({ message: `New user ${user.userName} created successfully` });
	} else {
		return res.status(400).json({ message: "Invalid User data received" });
	}
});

const updateUser = asyncHandler(async (req, res) => {
	const { userName, password, roles, active, id } = req.body;
	if (
		!userName ||
		!Array.isArray(roles) ||
		!roles.length ||
		!id ||
		typeof active !== "boolean"
	) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const user = await User.findById(id).exec();
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const duplicate = await User.findOne({
		userName: new RegExp("^" + userName + "$", "i"),
	})
		.lean()
		.exec();
	if (duplicate && duplicate?._id.toString() !== id) {
		return res.status(409).json({ message: "Duplicate UserName " });
	}

	user.userName = userName;
	user.roles = roles;
	user.active = active;

	if (password) {
		user.password = await bcrypt.hash(password, 10);
	}
	const updatedUser = await user.save();
	res.status(200).json(`${updatedUser.userName} updated successfully`);
});

const deleteUser = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: "UserId required" });
	}

	const user = await User.findById(id).exec();
	if (!user) {
		return res.status(400).json({ message: "User not found" });
	}

	const note = await Note.findOne({ user: id }).lean().exec();
	if (note) {
		return res.status(400).json({ message: "User has assigned notes" });
	}

	const result = await User.findByIdAndDelete(id);
	const reply = `UserName ${result.userName} with ID ${result._id} deleted successfully`;
	res.json(reply);
});


module.exports = { getAllUsers, createNewUser, updateUser, deleteUser };
