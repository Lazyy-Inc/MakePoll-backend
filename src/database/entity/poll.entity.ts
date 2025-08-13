import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import type { Question } from './question.entity';

@Entity()
export class Poll {
    @PrimaryGeneratedColumn('uuid')
    uuid: string;

    @Column({ default: 1 })
    possibleAnswers: number;

    @Column({ type: 'int', nullable: true })
    pollDuration: number | null; // en heures

    @Column({ default: false })
    hideResults: boolean;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @OneToMany(
        () => require('./question.entity').Question,
        (question: Question) => question.poll,
        { cascade: true }
    )
    questions: Question[];
}