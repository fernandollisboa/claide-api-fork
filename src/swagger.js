const swaggerAutogen = require("swagger-autogen")();

const outputFile = "../swagger/swagger_output.json";
const endpointsFiles = ["./routes/index.js"];

swaggerAutogen(outputFile, endpointsFiles);
