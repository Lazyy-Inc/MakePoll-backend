import { AppDataSource } from "../datasource";
import { Answer } from "../entity/answer.entity";
import { Question } from "../entity/question.entity";

export const AnswerRepository = AppDataSource.getRepository(Answer).extend({
    async submitAnswer(questionUuid: string): Promise<Answer> {
        const answer = this.create({
            question: { uuid: questionUuid } as Question
        });

        return await this.save(answer);
    }
});