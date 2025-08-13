import { Request, Response } from 'express';
import { AnswerRepository } from '../database/repository/answer.repository';
import { QuestionRepository } from '../database/repository/question.repository';
import { notifyPollUpdate } from "../sockets/poll.socket";

export class AnswerController {
    static async submitAnswer(req: Request, res: Response) {
        try {
            const question = await QuestionRepository.findOne({
                where: { uuid: req.params.questionUuid, poll: { uuid: req.params.pollUuid } }
            });

            if (!question) {
                return res.status(404).json({ error: "Question not found in this poll" });
            }

            const answer = await AnswerRepository.submitAnswer(
                req.params.questionUuid,
            );

            question.nbAnswers += 1;
            await QuestionRepository.save(question);

            await notifyPollUpdate(req.params.pollUuid);

            res.status(201).json(answer);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}