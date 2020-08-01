const express = require("express");
const router = express.Router();

// Load models
const product = require("../models/product");
const package = require("../models/package");

// Home Page
router.get("/", (req, res) => {
    res.render("index", {
        title: "Healthy Meal Delivery - GDShop",
        data: product.getFeaturedProducts(),
        style: "index.css",
    });
});

// Meal Packages
router.get("/mealPackages", (req, res) => {
    res.render("mealPackages", {
        title: "Meal Packages - GDShop",
        data: package.getAllPackages(),
        style: "mealPackages.css",
    });
});

// dashboard
router.get("/dashboard", (req, res) => {
    res.redirect("/dashboard");
});

module.exports = router;
