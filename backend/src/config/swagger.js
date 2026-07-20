import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mindful Study API",
      version: "1.0.0",
      description: "API documentation for the Mindful Study Backend",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local Development Server",
      },
    ],

    // Add this section
    tags: [
      {
        name: "Authentication",
        description: "User authentication and onboarding APIs",
      },
      {
        name: "Tasks",
        description: "Task management APIs",
      },
      {
        name: "Study Sessions",
        description: "Study session management APIs",
      },
      {
        name: "Analytics",
        description: "Analytics and burnout monitoring APIs",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;