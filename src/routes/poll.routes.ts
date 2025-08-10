import { Router } from 'express';
import {
    getPolls,
} from '../controllers/poll.controller';

const pollRouter = Router();

// Collection routes

/**
 * @openapi
 * /polls:
 *   get:
 *     summary: Get all polls
 *     responses:
 *       200:
 *         description: List of polls
 */
pollRouter.get('/', getPolls);

// Single resource routes
// pollRouter.get('/:id', getPollById);

export { pollRouter };
