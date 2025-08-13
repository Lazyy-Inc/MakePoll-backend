import { Request, Response } from 'express';
import { PollRepository } from '../database/repository/poll.repository';
import { generateToken } from "../utils/jwt/generate";

export class PollController {
    static async createPoll(req: Request, res: Response) {
        try {
            const poll = await PollRepository.createPoll(req.body);
            const token = generateToken(poll.uuid);
            res.status(201).json({ poll, token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async getPoll(req: Request, res: Response) {
        try {
            const poll = await PollRepository.getPollByUuid(req.params.id);
            if (!poll) {
                return res.status(404).json({ error: "Poll not found" });
            }
            res.json(poll);
        } catch (error) {
            res.status(404).json({ error: error.message });
        }
    }

    static async updatePoll(req: Request, res: Response) {
        try {
            const updatedPoll = await PollRepository.updatePoll(req.params.id, req.body);
            if (!updatedPoll) {
                return res.status(404).json({ error: "Poll not found" });
            }
            res.json(updatedPoll);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}