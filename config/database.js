require("dotenv").config();
const mongooes = require("mongoose");
const logger = require("../logger/logger");

const connectDatabase = () => {
  mongooes
    .connect(process.env.DB_URI)
    .then(() => {
      logger.info(`Database Connected`);
    })
    .catch((err) => {
      logger.error(err);
    });
};

module.exports = connectDatabase;
