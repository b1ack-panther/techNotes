require("dotenv").config();
const express = require("express");
const path = require("path");
const { logger, logEvents } = require("./middleware/logger.js");
const errorHandler = require("./middleware/errorHandler.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions.js");
const connectDB = require("./config/dbConnection.js");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3500;

connectDB();
app.use(logger);


app.use((req, res, next) => {
	// res.setHeader("Access-Control-Allow-Origin", "http://example.com"); // Replace with your client's origin
	res.setHeader("Access-Control-Allow-Credentials", true);
	// res.setHeader(
	// 	"Access-Control-Allow-Methods",
	// 	"GET, POST, PUT, DELETE, OPTIONS"
	// );
	// res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});

app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());

app.use("/", express.static(path.join(__dirname, "/public")));
// app.use(express.static("/public"));

app.use("/", require("./routes/root.js"));
app.use("/users", require("./routes/userRoutes.js"));
app.use("/notes", require("./routes/noteRouter.js"));
app.use("/auth", require("./routes/authRoutes.js"));

app.all("*", (req, res) => {
	res.status(404);
	if (req.accepts("html")) {
		res.sendFile(path.join(__dirname, "views", "404.html"));
	} else if (req.accepts("json")) {
		res.json({ message: "404 Not Found" });
	} else {
		res.type("txt").send("404 Not Found");
	}
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
	console.log("Connected to MongoDB");
	app.listen(PORT, () =>
		console.log(`Server running on port ${PORT} \n http://localhost:3500`)
	);
});

mongoose.connection.on("error", (error) => {
	console.log(error);
	logEvents(
		`${error?.errorResponse?.errmsg}: ${error?.code}\t${error?.codeName}\t${error?.hostname}`,
		"mongoErrLog.log"
	);
});
