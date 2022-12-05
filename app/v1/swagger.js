const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sample API",
      version: "1.0.0",
    },
  },
  apis: ["./app/routes/api/user.routes.js", "./app/routes/api/auth.routes.js"], // files containing annotations as above
};

const openapiSpecification = swaggerJsdoc(options);

console.log(openapiSpecification);

module.exports = openapiSpecification;
