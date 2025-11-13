import swaggerJsdoc from "swagger-jsdoc";
// Swagger UI options
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Apartment Listing API",
      version: "1.0.0",
      description:
        "API documentation for the Apartment Listing App built with Next.js, Prisma, and PostgreSQL.",
      contact: {
        name: "Mohamed Samy",
        email: "mohamedadel74@gmail.com",
        url: "https://mohamedsamy911.github.io",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local development server",
      },
    ],
    tags: [
      {
        name: "Apartments",
        description:
          "APIs related to managing apartments (CRUD, search, pagination).",
      },
      {
        name: "Uploads",
        description: "APIs related to image uploads for apartments.",
      },
      {
        name: "Files",
        description:
          "APIs related to file management (retrieval, existence check).",
      },
    ],
  },
  apis: ["src/app/api/**/*.ts", "src/app/docs/components.yaml"],
};

export const swaggerSpec = swaggerJsdoc(options);
