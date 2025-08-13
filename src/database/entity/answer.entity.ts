import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Question } from './question.entity';

@Entity()
export class Answer {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    answeredAt: Date;

    @ManyToOne(() => require('./question.entity').Question, (question: Question) => question.answers)
    question: Question;
}