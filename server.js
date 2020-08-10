// Heroku link: https://gds-web322-final.herokuapp.com/
// GitHub link: https://github.com/gdsimoes/web322-assignment-final
// email: gds.simoes@gmail.com pw: 123456

const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const clientSessions = require("client-sessions");

// Load environment variable file
require("dotenv").config({ path: "./config/keys.env" });

// Load database
const db = require("./models/db");

// Connect to database
db.initialize()
    .then(() => {
        console.log("Successfully connected to database.");
    })
    .catch((err) => {
        console.log(`Error: ${err}`);
    });

// Begin the app
const app = express();

//Setup client-sessions
app.use(
    clientSessions({
        cookieName: "session",
        secret: process.env.CLIENT_SESSIONS_SECRET,
        duration: 2 * 60 * 1000, // two minutes
        activeDuration: 1000 * 60, // one minute
    })
);

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
const mealPackagesController = require("./controllers/mealPackages");

// Map each controller to the app object
app.use("/", generalController);
app.use("/login", loginController);
app.use("/customerRegistration", registrationController);
app.use("/mealPackages", mealPackagesController);

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Web server is up and running on port ${process.env.PORT}`);
});
