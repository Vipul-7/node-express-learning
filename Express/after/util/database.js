const Sequelize = require("sequelize");

const sequelize = new Sequelize("learning-node", "root", "12345", {
  host: "localhost",
  dialect:"mysql"
});

module.exports = sequelize;
