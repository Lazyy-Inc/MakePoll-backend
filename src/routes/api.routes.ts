import { Router } from 'express';
import { pollRouter } from './poll.routes';
import { answerRouter } from './answer.routes';

const apiRouter = Router();

apiRouter.use('/polls', pollRouter);
apiRouter.use('/polls/:pollUuid/questions', answerRouter);

export { apiRouter };