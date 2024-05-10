const mongoose = require("mongoose");

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.DATABASE_URI + "techNotesDB");
	} catch (error) {
		console.log("Error while connecting to database:", error);
	}
};

module.exports = connectDB;
