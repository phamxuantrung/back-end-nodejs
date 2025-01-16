const mongoose = require("mongoose")

module.exports.connectDB =  async (url) => {
    try {
        await mongoose.connect(url);
        console.log("Connet database successfully");
    } catch (error) {
        console.log("Connet database failure");
    }
}