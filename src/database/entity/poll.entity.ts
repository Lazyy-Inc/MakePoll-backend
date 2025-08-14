import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { PollOption } from './poll-option.entity';
import { Vote } from './vote.entity';

@Entity()
export class Poll {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ default: 1 })
    possibleAnswers: number;

    @Column({ default: false })
    isCaptchaEnabled: boolean;

    @Column({ default: false })
    areResultsHidden: boolean;

    @Column({ type: 'timestamp', nullable: true })
    endDate: Date | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column()
    question: string;

    @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
    options: PollOption[];

    @OneToMany(() => Vote, (vote) => vote.poll)
    votes: Vote[];
}