import { AppDataSource } from "../datasource";
import { PollOption } from "../entity/poll-option.entity";

export const PollOptionRepository = AppDataSource.getRepository(PollOption).extend({
});