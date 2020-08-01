const express = require("express");
const router = express.Router();

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
        res.redirect("/");
    }
});

module.exports = router;
