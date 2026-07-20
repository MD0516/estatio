import swaggerJSDoc from "swagger-jsdoc";

const APP_URL = `${process.env.APP_URL}`;
const options: swaggerJSDoc.Options = {
    definition: {
        openApi: "3.0.0",
        info: {
            title: "Estatio API",
            version: "1.0.0",
            description: "Real estate listing platform API"
        },
        servers: [
            { url: APP_URL }
        ],
        components: {
            securitySchemas: {
                cookieAuth: {
                    type: "apiKey",
                    in: "cookie",
                    name: "sessionCookie"
                }
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string" },
                        phone: { type: "string" },
                        role: { type: "string", enum: ["seeker", "owner"] },
                        emailVerified: { type: "boolean" },
                    }
                },

                Property: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        title: { type: "string" },
                        city: { type: "string" },
                        price: { type: "integer" },
                        bedroom: { type: "integer" },
                        type: { type: "string", enum: ["rent", "lease", "sale"] },
                        status: { type: "string", enum: ["active", "sold", "rented", "inactive"] },
                    },
                },
            }
        },
    },
    apis: ["./src/modules/**/*.route.ts"],
}

export default swaggerJSDoc(options);