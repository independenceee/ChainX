import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ChainX API",
      version: "1.0.0",
      description: "API for Cardano-related operations using MeshJS",
    },
    servers: [
      {
        url: !process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000",
      },
    ],
  },
  apis: ["../routes/*.ts"],
};

const specs = swaggerJsdoc(options);

export default {
  specs,
  swaggerUi,
};
