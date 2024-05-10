const User = require("../models/User.js");
const Note = require("../models/Note.js");
const asyncHandler = require("express-async-handler");

const getAllNotes = asyncHandler(async (req, res) => {
	const notes = await Note.find().lean();
	if (!notes?.length) {
		return res.status(400).json({ message: "No Note Found" });
	}

	const notesWithUser = await Promise.all(
		notes.map(async (note) => {
			const user = await User.findById(note.user).lean().exec();
			return { ...note, userName: user.userName };
		})
	);
	return res.json(notesWithUser);
});

const createNewNote = asyncHandler(async (req, res) => {
	const { title, text, user } = req.body;

	if (!title || !text || !user) {
		return res.status(400).json({ message: "All fields are required" });
	}

	const duplicate = await Note.findOne({ title: new RegExp("^" + title + "$", "i") }).lean().exec();
	if (duplicate) {
		return res.status(400).json({ message: "Duplicate note title" });
	}

	const noteObj = { title, text, user };
	const note = await Note.create(noteObj);

	if (!note) {
		return res.status(500).json({
			message: "Internal server error occured while creating the note",
		});
	}

	return res.status(200).json(note);
});

const updateNote = asyncHandler(async (req, res) => {
	const { title, text, completed, user, id } = req.body;
	if (!id || !text || !user || !title || typeof completed !== "boolean") {
		return res.status(400).json({ message: "All fields are required" });
	}

	const note = await Note.findById(id).exec();
	if (!note) {
		return res.status(400).json({ message: "Note not found" });
	}

	const duplicate = await Note.findOne({
		$and: [{ title: new RegExp("^" + title + "$", "i") }, { _id: { $ne: id } }],
	})
		.lean()
		.exec();
	if (duplicate) {
		return res.status(400).json({ message: "Duplicate note title" });
	}

	note.title = title;
	note.text = text;
	note.completed = completed;
	note.user = user;

	const updatedNote = await note.save();
	return res.status(200).json(`${updatedNote.title} updated successfully`);
});

const deleteNote = asyncHandler(async (req, res) => {
	const { id } = req.body;
	if (!id) {
		return res.status(400).json({ message: "Note ID missing" });
	}

	// const note = await Note.findById(id).exec();
	// if (!note) {
	// 	return res.status(400).json({ message: "No note found" });
	// }

  const result = await Note.findByIdAndDelete(id);
  if(!result)return res.status(400).json({message: "note not found"})
	const reply = `Note ${result.title} with ID ${result._id} deleted successfully`;
	res.json(reply);
});

module.exports = { getAllNotes, createNewNote, deleteNote, updateNote };
