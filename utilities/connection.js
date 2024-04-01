const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/virtualization_dashboard_db";

//connectionPromise is a promise which resolves with undefined when the connection is successful and rejects with the mongodb error, when it is not
const connectionPromise = mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connection to DB created succesfully.");
  })
  .catch((err) => {
    console.log("Connection to DB failed!");
    throw err;
  });

function disconnect() {
  mongoose.connection.close();
}

module.exports.connect = connectionPromise;
module.exports.disconnect = disconnect;
