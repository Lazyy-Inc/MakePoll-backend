import { Router } from 'express';
import { PollController } from '../controllers/poll.controller';
import { verifyToken } from "../utils/jwt/generate";

const pollRouter = Router();

/**
 * Middleware pour vérifier que l'utilisateur est le propriétaire du sondage.
 */
const verifyPollOwner = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Token required' });

        const { pollUuid } = verifyToken(token);
        if (pollUuid !== req.params.uuid) {
            return res.status(403).json({ error: 'Not authorized' });
        }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

/**
 * @openapi
 * /api/polls:
 *   post:
 *     summary: Créer un nouveau sondage
 *     tags: [Polls]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               possibleAnswers:
 *                 type: number
 *               isCaptchaEnabled:
 *                 type: boolean
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               areResultsHidden:
 *                 type: boolean
 *             required:
 *               - question
 *               - options
 *     responses:
 *       201:
 *         description: Sondage créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 poll:
 *                   $ref: '#/components/schemas/Poll'
 *                 token:
 *                   type: string
 */
pollRouter.post('/', PollController.createPoll);

/**
 * @openapi
 * /api/polls/{uuid}:
 *   get:
 *     summary: Récupérer un sondage par son uuid
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *         description: uuid du sondage
 *     responses:
 *       200:
 *         description: Sondage trouvé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 question:
 *                   type: string
 *                 options:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       text:
 *                         type: string
 *                       votes:
 *                         type: number
 *                 possibleAnswers:
 *                   type: number
 *                 isCaptchaEnabled:
 *                   type: boolean
 *                 areResultsHidden:
 *                   type: boolean
 *                 endDate:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 totalVotes:
 *                   type: number
 *       404:
 *         description: Sondage non trouvé
 */
pollRouter.get('/:uuid', PollController.getPoll);

/**
 * @openapi
 * /api/polls/{uuid}:
 *   put:
 *     summary: Met à jour un sondage (propriétaire uniquement)
 *     tags: [Polls]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *               possibleAnswers:
 *                 type: number
 *               isCaptchaEnabled:
 *                 type: boolean
 *               endDate:
 *                 type: string
 *                 format: date-time
 *               areResultsHidden:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Sondage mis à jour
 *       401:
 *         description: Token manquant ou invalide
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Sondage introuvable
 */
pollRouter.put('/:uuid', verifyPollOwner, PollController.updatePoll);

/**
 * @openapi
 * /api/polls/{uuid}/answer:
 *   post:
 *     summary: Soumettre un vote
 *     tags: [Polls]
 *     parameters:
 *       - in: path
 *         name: uuid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               optionsIds:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - optionsIds
 *     responses:
 *       200:
 *         description: Vote enregistré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       404:
 *         description: Sondage non trouvé
 *       500:
 *         description: Erreur serveur
 */
pollRouter.post('/:uuid/answer', PollController.submitVote);

export { pollRouter };