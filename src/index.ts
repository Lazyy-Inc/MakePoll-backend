import "./sentry/instrument";
import express from 'express';
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import { Server } from 'socket.io';
import http from "http";
import bodyParser from "body-parser";
import { apiRouter } from "./routes/api.routes";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { initializePollSockets } from './sockets/poll.socket';
import { ErrorHandler } from "./utils/error/error-handler";
import * as Sentry from '@sentry/node';

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
                            id: { type: 'string', format: 'uuid' },
                            possibleAnswers: { type: 'integer', example: 1 },
                            isCaptchaEnabled: { type: 'boolean', example: false },
                            areResultsHidden: { type: 'boolean', example: false },
                            endDate: { type: 'string', format: 'date-time', nullable: true },
                            createdAt: { type: 'string', format: 'date-time' },
                            question: { type: 'string' },
                            options: {
                                type: 'array',
                                items: { $ref: '#/components/schemas/PollOption' }
                            }
                        }
                    },
                    PollOption: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            text: { type: 'string' }
                        }
                    },
                    Vote: {
                        type: 'object',
                        properties: {
                            id: { type: 'string', format: 'uuid' },
                            poll: { $ref: '#/components/schemas/Poll' },
                            option: { $ref: '#/components/schemas/PollOption' }
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

    static sentryConfig() {
        Sentry.setupExpressErrorHandler(Index.app);

        Index.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            ErrorHandler(err, req, res)
        });
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
        Index.sentryConfig()

        await Index.databaseConfig();
        Index.startServer();
    }
}

Index.main();