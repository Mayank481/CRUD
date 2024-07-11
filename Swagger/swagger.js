require("dotenv").config();
const YAML = require("yamljs");
const swaggerui = require("swagger-ui-express");
const swaggerjsdocs = YAML.load("./api.yaml");

module.exports = {
  swaggerServe: swaggerui.serve,
  swaggerSetup: swaggerui.setup(swaggerjsdocs),
};
