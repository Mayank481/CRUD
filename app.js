require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const PORT = process.env.PORT || 4000;
const { swaggerServe, swaggerSetup } = require("./Swagger/swagger");
const logger = require("./logger/logger");

const connectDatabase = require("./config/database");

connectDatabase();

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  message: (req, res) => {
    return `Too many requests from this ${req.ip}, please try again later`;
  },
});

app.use(
  helmet({
    contentSecurityPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    xssFilter: true,
    noSniff: true,
  })
);

app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.get("/user", (req, res) => {
  res.json({
    message: "Welcome to CRUD Operation",
  });
});

app.use("/api", require("./routes"));

app.use("/api-docs", swaggerServe, swaggerSetup);

app.listen(PORT, () => {
  logger.info(`server is running on http://localhost:${PORT}`);
});
