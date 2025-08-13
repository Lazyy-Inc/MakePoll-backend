import express from 'express';
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import { Server } from 'socket.io';
import http from "http";
import bodyParser from "body-parser";
import { apiRouter } from "./routes/api.routes";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';
import { initializePollSockets } from './sockets/poll.socket'; // Ajout de l'import

export class Index {
    static jwtKey = process.env.JWT_SECRET;
    static app = express();
    static server = http.createServer(Index.app);
    static io = new Server(Index.server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    static globalConfig() {
        Index.app.set('trust proxy', '127.0.0.1');
        Index.app.disable('x-powered-by');
        Index.app.use(cors());
        Index.app.use(bodyParser.json({ limit: '10mb' }));
        Index.app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
    }

    static routeConfig() {
        Index.app.use('/api', apiRouter);
    }

    static swaggerConfig() {
        const swaggerDefinition = {
            openapi: '3.0.0',
            info: {
                title: 'Polls API',
                version: '1.0.0',
                description: 'Documentation API pour le module Polls',
            },
            components: {
                schemas: {
                    Poll: {
                        type: 'object',
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            possibleAnswers: { type: 'integer', example: 1 },
                            pollDuration: { type: 'integer', nullable: true, description: 'Durée en heures' },
                            hideResults: { type: 'boolean', example: false },
                            createdAt: { type: 'string', format: 'date-time' },
                            questions: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Question' }
                            }
                        }
                    },
                    Question: {
                        type: 'object',
                        properties: {
                            uuid: { type: 'string', format: 'uuid' },
                            text: { type: 'string' },
                            nbAnswers: { type: 'integer', example: 0 },
                            poll: { $ref: '#/components/schemas/Poll' },
                            answers: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/Answer' }
                            }
                        }
                    },
                    Answer: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            answeredAt: { type: 'string', format: 'date-time' },
                            question: { $ref: '#/components/schemas/Question' }
                        }
                    }
                }
            }
        };

        const swaggerSpec = swaggerJSDoc({
            swaggerDefinition,
            apis: ['./src/routes/*.ts'],
        });

        Index.app.use(
            '/docs',
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
        );

        Index.app.get('/docs.json', (req, res) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(swaggerSpec);
        });
    }

    static async databaseConfig() {
        await AppDataSource.initialize().then(async () => {
            console.log("DB Connecté");
        });
    }

    static initializeSockets() {
        initializePollSockets(Index.io); // Initialisation des sockets pour les sondages
        console.log("Socket.io initialisé");
    }

    static startServer() {
        Index.server.listen(process.env.PORT, () => {
            console.log(`API démarrée sur le port ${process.env.PORT}....`);
            Index.initializeSockets(); // Initialisation des sockets après le démarrage du serveur
            Index.app.emit("ready");
        });
    }

    static async main() {
        Index.swaggerConfig();
        Index.globalConfig();
        Index.routeConfig();

        await Index.databaseConfig();
        Index.startServer();
    }
}

Index.main();