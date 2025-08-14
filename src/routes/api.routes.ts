import { Router } from 'express';
import { pollRouter } from './poll.routes';

const apiRouter = Router();

apiRouter.use('/polls', pollRouter);

export { apiRouter };