import { AppDataSource } from "../datasource";
import { Poll } from "../entity/poll.entity";
import { PollOption } from "../entity/poll-option.entity";
import { Vote } from "../entity/vote.entity";
import { VoteRepository } from "./vote.repository";

export const PollRepository = AppDataSource.getRepository(Poll).extend({
    async createPoll(pollData: {
        question: string,
        options: string[],
        possibleAnswers: number,
        isCaptchaEnabled: boolean,
        endDate: string,
        areResultsHidden: boolean
    }): Promise<Poll> {
        const poll = this.create({
            question: pollData.question,
            possibleAnswers: pollData.possibleAnswers,
            isCaptchaEnabled: pollData.isCaptchaEnabled,
            areResultsHidden: pollData.areResultsHidden,
            endDate: pollData.endDate ? new Date(pollData.endDate) : null
        });

        // Create poll options
        poll.options = pollData.options.map(text => {
            const option = new PollOption();
            option.text = text;
            return option;
        });

        await this.save(poll);

        return poll;
    },

    async getPollByUuid(uuid: string): Promise<Poll | null> {
        return await this.findOne({
            where: { id: uuid },
            relations: {
                options: {
                    votes: true
                }
            }
        });
    },

    async updatePoll(uuid: string, updateData: Partial<Poll>): Promise<Poll | null> {
        await this.update(uuid, updateData);

        return await this.getPollByUuid(uuid);
    },

    async addVote(pollId: string, optionIds: string[]): Promise<boolean> {
        const poll = await this.getPollByUuid(pollId);
        if (!poll) {
            return false;
        }

        if (optionIds.length === 0 || optionIds.length > poll.possibleAnswers) {
            return false;
        }

        const validOptionIds: string[] = poll.options.map((opt: PollOption) => opt.id);
        const allOptionsValid = optionIds.every(id => validOptionIds.includes(id));

        if (!allOptionsValid) {
            return false;
        }

        const votesToCreate = optionIds.map(optionId => {
            const vote = new Vote();
            vote.poll = poll;
            vote.option = poll.options.find((opt: PollOption) => opt.id === optionId)!;
            return vote;
        });

        await VoteRepository.save(votesToCreate);

        return true;
    }
});