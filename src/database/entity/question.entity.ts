import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Poll } from './poll.entity';
import { Answer } from './answer.entity';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column()
    text: string;

    @Column({ default: 0 })
    nbAnswers: number;

    @ManyToOne(() => Poll, poll => poll.questions)
    poll: Poll;

    @OneToMany(() => Answer, answer => answer.question)
    answers: Answer[];
}