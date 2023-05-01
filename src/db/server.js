const mongoose = require("mongoose");
require("dotenv").config();
const db = process.env.LOCAL_SERVER;

const serverConnection = async () => {
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("connected to server successfully");
    })
    .catch((err) => {
      console.log("connection to server failed because :", err.message);
    });
};

module.exports = serverConnection;
