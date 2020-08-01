const product = {
    fakeDB: [],
    initDB() {
        this.fakeDB.push({
            title: "Noodles with Shrimp",
            price: "11.95",
            imgPath: "noodlesWithShrimp.jpg",
            featured: true,
        });

        this.fakeDB.push({
            title: "Pasta al Pomodoro",
            price: "10.95",
            imgPath: "pastaAlPomodoro.jpg",
            featured: true,
        });

        this.fakeDB.push({
            title: "Beef Gratin",
            price: "11.95",
            imgPath: "beefGratin.jpg",
            featured: false,
        });
        this.fakeDB.push({
            title: "Salmon Salad",
            price: "11.95",
            imgPath: "salmonSalad.jpg",
            featured: true,
        });
        this.fakeDB.push({
            title: "Risotto",
            price: "9.99",
            imgPath: "risotto.jpg",
            featured: false,
        });
        this.fakeDB.push({
            title: "Chicken Burrito",
            price: "9.99",
            imgPath: "chickenBurrito.jpg",
            featured: true,
        });
    },

    getAllProducts() {
        return this.fakeDB;
    },

    getFeaturedProducts() {
        return this.fakeDB.filter((x) => x.featured);
    },
};

product.initDB();
module.exports = product;
