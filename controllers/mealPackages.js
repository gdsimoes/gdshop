const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

function ensureClerk(req, res, next) {
    if (!req.session.user || !req.session.user.clerk) {
        res.redirect("/login");
    } else {
        next();
    }
}

// multer
const storage = multer.diskStorage({
    destination: "./public/img/",
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const imageFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        return cb(null, true);
    } else {
        return cb(
            new Error("Not an image! Please upload an image.", 400),
            false
        );
    }
};

// tell multer to use the diskStorage function for naming files instead of the default.
const upload = multer({ storage: storage, fileFilter: imageFilter });

// Load database
const db = require("../models/db");

// Old meal packages
// router.get("/", (req, res) => {
//     res.render("mealPackages", {
//         title: "Meal Packages - GDShop",
//         data: package.getAllPackages(),
//         style: "mealPackages.css",
//     });
// });

// Meal Packages
router.get("/", (req, res) => {
    db.getMeals()
        .then((data) => {
            res.render("mealPackages", {
                title: "Meal Packages - GDShop",
                // data: package.getAllPackages(),
                data: data,
                style: "mealPackages.css",
            });
        })
        .catch((err) => {
            console.log("Error retrieving meal packages");
            res.render("mealPackages", {
                title: "Meal Packages - GDShop",
                // data: package.getAllPackages(),
                data: undefined,
                style: "mealPackages.css",
            });
        });
});

// Edit Meal Packages
router.get("/edit", ensureClerk, (req, res) => {
    db.getMeals()
        .then((data) => {
            res.render("mealPackagesEdit", {
                title: "Edit Meal Packages - GDShop",
                data: data,
                style: "mealPackages.css",
                meal: data.find((meal) => meal.title === req.query.title),
            });
        })
        .catch((err) => {
            console.log("Error retrieving meal packages");
            res.render("mealPackagesEdit", {
                title: "Edit Meal Packages - GDShop",
                data: undefined,
                style: "mealPackages.css",
            });
        });
});

// Add Meal Package
router.post("/add", ensureClerk, upload.single("photo"), (req, res) => {
    req.body.imgPath = req.file.filename;

    const {
        title,
        price,
        synopsis,
        foodCategory,
        numberOfMeals,
        topPackage,
    } = req.body;

    // Form validation
    const errors = [];
    if (!title) {
        errors.push("You must enter the title");
    }
    if (!price) {
        errors.push("You must enter the price");
    }
    if (!synopsis) {
        errors.push("You must enter the synopsis");
    }
    if (!foodCategory) {
        errors.push("You must enter the food category");
    }
    if (!numberOfMeals) {
        errors.push("You must enter the number of meals");
    }

    if (errors.length > 0) {
        res.render("mealPackagesEdit", {
            title: "Edit Meal Packages - GDShop",
            data: package.getAllPackages(),
            style: "mealPackages.css",
            errors: errors,
        });
    } else {
        db.addMeal(req.body)
            .then(() => {
                res.redirect("/mealPackages/edit");
            })
            .catch(() => {
                console.log("Error adding meal package");
                res.redirect("/mealPackages/edit");
            });
    }
});
// Edit Meal Package
router.post("/edit", ensureClerk, (req, res) => {
    const {
        price,
        synopsis,
        foodCategory,
        numberOfMeals,
        topPackage,
    } = req.body;

    // Form validation
    const errors = [];
    if (!price) {
        errors.push("You must enter the price");
    }
    if (!synopsis) {
        errors.push("You must enter the synopsis");
    }
    if (!foodCategory) {
        errors.push("You must enter the food category");
    }
    if (!numberOfMeals) {
        errors.push("You must enter the number of meals");
    }

    if (errors.length > 0) {
        res.render("mealPackagesEdit", {
            title: "Edit Meal Packages - GDShop",
            data: package.getAllPackages(),
            style: "mealPackages.css",
            errors: errors,
        });
    } else {
        db.editMeal(req.body)
            .then(() => {
                res.redirect("/mealPackages/edit");
            })
            .catch(() => {
                console.log("Error editing meal package");
                res.redirect("/mealPackages/edit");
            });
    }
});

// Delete Meal Package
router.get("/delete", ensureClerk, (req, res) => {
    if (req.query.title) {
        db.deleteMeal(req.query.title)
            .then(() => {
                res.redirect("/mealPackages/edit");
            })
            .catch(() => {
                console.log("Could not delete");
                res.redirect("/mealPackages/edit");
            });
    } else {
        console.log("No query");
        res.redirect("/mealPackages/edit");
    }
});

module.exports = router;
