const mongoose = require("mongoose");
require("dotenv").config();

exports.connect = () => {
  mongoose
    .connect(process.env.MONGOURL, {})
    .then(() => {
      console.log("DB Connection Successful");
    })
    .catch((e) => {
      console.log("DB Connection Failed");
      console.error(e);
      process.exit(1);
    });
};
