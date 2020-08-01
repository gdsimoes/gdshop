const package = {
    fakeDB: [],
    initDB() {
        this.fakeDB.push({
            title: "Weight Loss",
            price: "145",
            foodCategory: "Edible",
            numberOfMeals: 100,
            synopsis:
                "High protein, low-calorie meals with a nutrient profile tuned for weight loss",
            imgPath: "weightLoss.jpg",
            topPackage: true,
        });

        this.fakeDB.push({
            title: "Muscle Gain",
            price: "159",
            foodCategory: "Edible",
            numberOfMeals: 100,
            synopsis:
                "Higher protein and calorie portions to support your muscle gain momentum",
            imgPath: "muscleGain.jpg",
            topPackage: true,
        });

        this.fakeDB.push({
            title: "Keto",
            price: "159",
            foodCategory: "Edible",
            numberOfMeals: 100,
            synopsis:
                "High fat, low carb meals with moderate protein to achieve and sustain ketosis",
            imgPath: "keto.jpg",
            topPackage: false,
        });
        this.fakeDB.push({
            title: "Fat Burner",
            price: "159",
            foodCategory: "Edible",
            numberOfMeals: 100,
            synopsis:
                "Low carb, nutrient-rich meals with fat-burning profiles to support fat loss",
            imgPath: "fatBurner.jpg",
            topPackage: true,
        });
    },

    getAllPackages() {
        return this.fakeDB;
    },
};

package.initDB();
module.exports = package;
