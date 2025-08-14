import { AppDataSource } from "../datasource";
import { Vote } from "../entity/vote.entity";

export const VoteRepository = AppDataSource.getRepository(Vote).extend({
});