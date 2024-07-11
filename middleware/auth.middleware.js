require("dotenv").config();
const jwt = require("jsonwebtoken");
const logger = require("../logger/logger");

module.exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader == null || authHeader == undefined) {
    logger.error("Auth Middleware UnAuthorized");
    return res.status(401).json({
      status: 401,
      message: "UnAuthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  //* verify token

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      logger.error("Auth Middleware UnAuthorized", err);
      return res.status(401).json({
        status: 401,
        message: "UnAuthorized",
      });
    }

    req.user = payload;
    next();
  });
};
