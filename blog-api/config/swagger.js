const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'QuickBlog API',
            version: '1.0.0',
            description: 'Tài liệu API cho ứng dụng Blog. Xây dựng bằng Node.js, Express và MongoDB.',
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:8000',
                description: 'API Server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;