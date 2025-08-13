import { Router } from 'express';
import { AnswerController } from '../controllers/answer.controller';

const answerRouter = Router();

/**
 * @openapi
 * /api/polls/{pollUuid}/questions/{questionUuid}/answers:
 *   post:
 *     summary: Soumettre une réponse à une question
 *     tags: [Answer]
 *     parameters:
 *       - in: path
 *         name: pollUuid
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: questionUuid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Réponse enregistrée
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Answer'
 *       404:
 *         description: Question non trouvée
 */
answerRouter.post('/:questionUuid/answers', AnswerController.submitAnswer);

export { answerRouter };