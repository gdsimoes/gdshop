const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// User schema
let userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
    },
    firstName: String,
    lastName: String,
    password: String,
    clerk: Boolean,
});
let usersCollection;

// Meal Package Schema
let mealSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
    },
    price: Number,
    synopsis: String,
    foodCategory: String,
    numberOfMeals: Number,
    topPackage: Boolean,
    imgPath: String,
});
let mealsCollection;

// Start database connection
module.exports.initialize = function () {
    return new Promise((resolve, reject) => {
        let db = mongoose.createConnection(
            process.env.MONGO_DB_CONNECTION_STRING,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }
        );

        db.on("error", (err) => {
            reject(err);
        });

        db.once("open", () => {
            usersCollection = db.model("users", userSchema);
            mealsCollection = db.model("meals", mealSchema);
            resolve();
        });
    });
};

// Use form input to add a new user to the database
module.exports.addUser = function (data) {
    return new Promise((resolve, reject) => {
        data.clerk = data.clerk ? true : false;

        let newUser = new usersCollection(data);

        bcrypt
            .genSalt(10)
            .then((salt) => bcrypt.hash(newUser.password, salt))
            .then((hash) => {
                newUser.password = hash;
                newUser.save((err) => {
                    if (err) {
                        console.log(`Database error: ${err}`);
                        reject();
                    } else {
                        console.log(`Saved user: ${data.email}`);
                        resolve();
                    }
                });
            })
            .catch((err) => {
                console.log("Hashing error");
                reject(err);
            });
    });
};

// Get array of user with email. If no email is given return all users.
module.exports.getUsers = function (email) {
    return new Promise((resolve, reject) => {
        usersCollection
            .find(email == undefined ? undefined : { email: email })
            .exec()
            .then((users) => {
                if (users.length === 0) {
                    reject("User not found");
                } else {
                    resolve(users.map((item) => item.toObject()));
                }
            })
            .catch((err) => {
                console.log(`Error retriving users: ${err}`);
                reject(err);
            });
    });
};

module.exports.validateUser = (data) => {
    return new Promise((resolve, reject) => {
        this.getUsers(data.email)
            .then((users) => {
                bcrypt
                    .compare(data.password, users[0].password)
                    .then((result) => {
                        if (result) {
                            resolve(users);
                        } else {
                            reject("Incorrect password");
                        }
                    });
            })
            .catch((err) => {
                reject(err);
            });
    });
};

// Use form input to add a new meal package to the database
module.exports.addMeal = function (data) {
    return new Promise((resolve, reject) => {
        data.topPackage = data.topPackage ? true : false;

        let newMeal = new mealsCollection(data);

        newMeal.save((err) => {
            if (err) {
                console.log(`Database error: ${err}`);
                reject();
            } else {
                console.log(`Saved meal: ${data.title}`);
                resolve();
            }
        });
    });
};

// Get array of meal with title. If no title is given return all meals.
module.exports.getMeals = function (title) {
    return new Promise((resolve, reject) => {
        mealsCollection
            .find(title == undefined ? undefined : { title: title })
            .exec()
            .then((meals) => {
                if (meals.length === 0) {
                    reject("Meal not found");
                } else {
                    resolve(meals.map((item) => item.toObject()));
                }
            })
            .catch((err) => {
                console.log(`Error retriving meals: ${err}`);
                reject(err);
            });
    });
};

// Use form input to edit a meal package in the database
module.exports.editMeal = function (data) {
    return new Promise((resolve, reject) => {
        data.topPackage = data.topPackage ? true : false;

        mealsCollection
            .updateOne(
                { title: data.title },
                {
                    $set: {
                        price: data.price,
                        synopsis: data.synopsis,
                        foodCategory: data.foodCategory,
                        numberOfMeals: data.numberOfMeals,
                        topPackage: data.topPackage,
                        // imgPath: String,
                    },
                }
            )
            .exec()
            .then(() => {
                console.log(`Meal Package ${data.title} has been updated`);
                resolve();
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports.deleteMeal = (title) => {
    return new Promise((resolve, reject) => {
        mealsCollection
            .deleteOne({ title: title })
            .exec()
            .then(() => {
                resolve();
            })
            .catch(() => {
                reject();
            });
    });
};
