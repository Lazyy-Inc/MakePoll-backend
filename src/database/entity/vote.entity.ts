import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import type { Poll } from "./poll.entity";
import type { PollOption } from "./poll-option.entity";

@Entity()
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => require('./poll.entity').Poll, (poll: Poll) => poll.votes)
    poll: Poll;

    @ManyToOne(() => require('./poll-option.entity').PollOption, (option: PollOption) => option.votes)
    option: PollOption;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
}