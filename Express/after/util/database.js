const { MongoClient } = require("mongodb");

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://20it38:SBcSaXvfajjMMPL9@cluster0.ajoqr7a.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db();
      callback();
      console.log("connected!");
    })
    .catch((err) => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database Found!";
};

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
