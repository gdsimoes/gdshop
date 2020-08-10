const express = require("express");
const router = express.Router();

// Load database
const db = require("../models/db");

// Email functionality
function sendEmail(firstName, lastName, email) {
    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
        to: `${email}`,
        from: `gds.simoes@gmail.com`,
        subject: "Welcome to GDShop!",
        html: `Hello, ${firstName} ${lastName}! Welcome to the best site ever!`,
    };

    return sgMail.send(msg);
}

// Customer Registration
router.get("/", (req, res) => {
    res.render("register", {
        title: "Registration - GDShop",
        style: "register.css",
    });
});

router.post("/", (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Form validation
    const errors = [];
    if (!firstName) {
        errors.push("You must enter your first name");
    }

    if (!lastName) {
        errors.push("You must enter your last name");
    }

    if (!email) {
        errors.push("You must enter an email");
    }

    if (!password || password.length < 6 || password.length > 12) {
        errors.push("Password must be between 6 and 12 characters");
    }

    // If no errors were found send email using sendgrid
    if (errors.length > 0) {
        res.render("register", {
            title: "Registration - GDShop",
            errors: errors,
        });
    } else {
        db.addUser(req.body)
            .then(() => {
                sendEmail(firstName, lastName, email)
                    .then(() => {
                        db.getUsers()
                            .then((data) => {
                                req.session.user = data[data.length - 1];
                                res.redirect("/dashboard");
                            })
                            .catch((err) => {
                                res.redirect("/dashboard");
                            });
                    })
                    .catch((err) => {
                        console.log(`Email error: ${err}`);
                    });
            })
            .catch((err) => {
                console.log(`Error adding user: ${err}`);
                errors.push("Email already registered");
                res.render("register", {
                    title: "Registration - GDShop",
                    errors: errors,
                });
            });
    }
});

module.exports = router;
