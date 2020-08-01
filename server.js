const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Load environment variable file
require("dotenv").config({ path: "./config/keys.env" });

// Testing databse connection
let db = mongoose.createConnection(
    "mongodb+srv://gdsimoes:1234567890@senecaweb.p0fu3.mongodb.net/web322?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
);

db.on("error", (err) => {
    console.log("db error!");
});

db.once("open", () => {
    console.log("db success!");
});

// Begin the app
const app = express();

// Set up handlebars
app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

// Set up body parser
app.use(bodyParser.urlencoded({ extended: false }));

// Making static files available
app.use(express.static("public"));

// Load controllers
const generalController = require("./controllers/general");
const loginController = require("./controllers/login");
const registrationController = require("./controllers/registration");

// Map each controller to the app object
app.use("/", generalController);
app.use("/login", loginController);
app.use("/customerRegistration", registrationController);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Web server is up and running on port ${process.env.PORT}`);
});
