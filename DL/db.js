const mongoose = require("mongoose");
const MONGO_URL = process.env.MONGODB_URI;
const connectToMongo = async () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(MONGO_URL);
    console.log("Connected to Mongo Successfully!");
  } catch (error) {
    console.log(error);
  }
};
exports.myConnect = connectToMongo;
