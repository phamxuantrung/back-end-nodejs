const homeRoute = require("./home.route.js")
const productRoute = require("./product.route.js")

module.exports = (app) => {
    // Home
    app.use("/", homeRoute);

    // Product
    app.use("/product", productRoute)
}