const express = require("express");
const router = express.Router();

// Load database
const db = require("../models/db");

// Login page
router.get("/", (req, res) => {
    res.render("login", {
        title: "Login - GDShop",
        style: "login.css",
    });
});

// Login
router.post("/", (req, res) => {
    const errors = [];

    if (!req.body.email) {
        errors.push("You must enter an email");
    }

    if (!req.body.password) {
        errors.push("You must enter a password");
    }

    if (errors.length > 0) {
        res.render("login", {
            title: "Login - GDShop",
            errors: errors,
        });
    } else {
        db.validateUser(req.body)
            .then((users) => {
                req.session.user = users[0];
                res.redirect("/dashboard");
            })
            .catch((err) => {
                console.log(err);
                errors.push(
                    "Sorry, you entered the wrong email and/or password"
                );
                res.render("login", {
                    title: "Login - GDShop",
                    errors: errors,
                });
            });
    }
});

module.exports = router;
