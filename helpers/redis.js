const { Redis } = require("ioredis");
const redisClient = new Redis();
const logger = require("../logger/logger");

const redisSet = async (data) => {
  try {
    redisClient.set(`${data._id}`, JSON.stringify(data), "EX", 3600); // Cache data for 1 hour
    logger.info("New user created and cached in Redis");
  } catch (error) {
    logger.error(error.message);
  }
};

module.exports = {
  redisSet,
};
