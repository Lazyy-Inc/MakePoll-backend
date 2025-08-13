import { AppDataSource } from "../datasource";
import { Question } from "../entity/question.entity";

export const QuestionRepository = AppDataSource.getRepository(Question).extend({

})