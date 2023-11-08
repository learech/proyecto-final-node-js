import swaggerJsdoc from 'swagger-jsdoc'

const options = {
  definition: {
      openapi: "3.0.0", 
      info: {
          title: "Express API with Swagger",
          description: "A simple CRUD API application made with Express and documented with Swagger"
      }
  },
  apis: ['./src/docs/**/*.yaml'] // Especificaciones de apis
}

const swaggerSpecs = swaggerJsdoc(options);

export default { swaggerSpecs }