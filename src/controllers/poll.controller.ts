import { Request, Response } from 'express';
import { PollRepository } from '../database/repository/poll.repository';
import { generateToken } from "../utils/jwt/generate";
import { notifyPollUpdate } from "../sockets/poll.socket";

export class PollController {
    static async createPoll (req: Request, res: Response) {
        const poll = await PollRepository.createPoll (req.body);
        const token = generateToken (poll.id);

        res.status (201).json ({
            poll: {
                id: poll.id,
                question: poll.question,
                options: poll.options,
                possibleAnswers: poll.possibleAnswers,
                isCaptchaEnabled: poll.isCaptchaEnabled,
                areResultsHidden: poll.areResultsHidden,
                endDate: poll.endDate,
                createdAt: poll.createdAt
            },
            token
        });
    }

    static async getPoll (req: Request, res: Response) {
        const poll = await PollRepository.getPollByUuid (req.params.uuid);
        if (!poll) {
            return res.status (404).json ({ error: "Poll not found" });
        }

        // Calculate votes for each option
        const optionsWithVotes = poll.options.map (option => ({
            id: option.id,
            text: option.text,
            votes: option.votes ? option.votes.length : 0
        }));

        res.json ({
            id: poll.id,
            question: poll.question,
            options: optionsWithVotes,
            possibleAnswers: poll.possibleAnswers,
            isCaptchaEnabled: poll.isCaptchaEnabled,
            areResultsHidden: poll.areResultsHidden,
            endDate: poll.endDate,
            createdAt: poll.createdAt,
            totalVotes: optionsWithVotes.reduce ((sum, option) => sum + option.votes, 0)
        });
    }

    static async updatePoll (req: Request, res: Response) {
        const updatedPoll = await PollRepository.updatePoll (req.params.uuid, req.body);

        if (!updatedPoll) {
            return res.status (404).json ({ error: "Poll not found" });
        }

        res.json (updatedPoll);
    }

    static async submitVote (req: Request, res: Response) {
        const { optionsIds } = req.body;
        const { uuid } = req.params;

        const success = await PollRepository.addVote (uuid, optionsIds);

        if (!success) {
            return res.status (404).json ({ error: "Poll not found" });
        }


        res.json ({ success: true });
        notifyPollUpdate(uuid);
    }
}