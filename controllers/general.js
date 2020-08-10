const express = require("express");
const router = express.Router();

// Load products
const product = require("../models/product");

// Load database
const db = require("../models/db");

// Home Page
router.get("/", (req, res) => {
    res.render("index", {
        title: "Healthy Meal Delivery - GDShop",
        data: product.getFeaturedProducts(),
        style: "index.css",
    });
});

router.get("/logout", (req, res) => {
    req.session.reset();
    res.redirect("/login");
});

function ensureLogin(req, res, next) {
    if (!req.session.user) {
        res.redirect("/login");
    } else {
        next();
    }
}

// dashboard
router.get("/dashboard", ensureLogin, (req, res) => {
    res.render("dashboard", {
        title: "Dashboard - GDShop",
        user: req.session.user,
    });
});

module.exports = router;
