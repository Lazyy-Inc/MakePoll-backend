import express from 'express';
import cors from 'cors';
import { AppDataSource } from "./database/datasource";
import { Server } from 'socket.io';
import http from "http";
import bodyParser from "body-parser";
import { apiRouter } from "./routes";
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import basicAuth from 'express-basic-auth';

export class Index {
    static jwtKey = process.env.JWT_SECRET;
    static app = express ()
    static server = http.createServer (Index.app); // Créez un serveur HTTP à partir de votre application Express
    static io = new Server (Index.server, { cors: { origin: '*' } });

    static globalConfig () {
        Index.app.set ('trust proxy', '127.0.0.1'); // Ready to trust you're nginx proxy :))
        Index.app.disable ('x-powered-by');
        Index.app.use (cors ())
        Index.app.use (bodyParser.json ({ limit: '10mb' })); // Pour les données JSON
        Index.app.use (bodyParser.urlencoded ({ extended: true, limit: '10mb' })); // Pour les données encodées dans l'URL
    }

    static routeConfig () {
        Index.app.use('/api', apiRouter);
    }

    static swaggerConfig () {
        const swaggerDefinition = {
            openapi: '3.0.0',
            info: {
                title: 'Polls API',
                version: '1.0.0',
                description: 'Documentation API pour le module Polls'
            }
        };

        const swaggerSpec = swaggerJSDoc({
            swaggerDefinition,
            apis: ['./src/routes/*.ts'],
        });

        Index.app.use(
            '/docs',
            basicAuth({
                users: { [process.env.DOCUSERNAME]: process.env.DOCPASSWORD },
                challenge: true
            }),
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
        );
    }

    static async databaseConfig () {
        await AppDataSource.initialize ().then (async () => {
            console.log ("DB Connecté")
        });
    }

    static startServer () {
        Index.server.listen (process.env.PORT, () => {
            console.log (`API démarrée sur le port ${ process.env.PORT }....`);
            Index.app.emit ("ready");
        });
    }

    static async main () {
        Index.swaggerConfig ()
        Index.globalConfig ()
        Index.routeConfig ()

        await Index.databaseConfig ()
        Index.startServer ()
    }

}

Index.main ()