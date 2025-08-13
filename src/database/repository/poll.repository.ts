import { AppDataSource } from "../datasource";
import { Poll } from "../entity/poll.entity";

export const PollRepository = AppDataSource.getRepository(Poll).extend({
    async createPoll(pollData: Partial<Poll>): Promise<Poll> {
        const poll = this.create(pollData);
        return await this.save(poll);
    },

    async getPollByUuid(uuid: string): Promise<Poll | null> {
        return await this.findOne({
            where: { uuid },
            relations: { questions: true }
        });
    },

    async updatePoll(uuid: string, updateData: Partial<Poll>): Promise<Poll | null> {
        await this.update(uuid, updateData);
        return await this.getPollByUuid(uuid);
    }
});