import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import type { Vote } from "./vote.entity";
import type { Poll } from "./poll.entity";

@Entity()
export class PollOption {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    text: string;

    @ManyToOne(() => require('./poll.entity').Poll, (poll: any) => poll.options)
    poll: Poll;

    @OneToMany(() => require('./vote.entity').Vote, (vote: any) => vote.option)
    votes: Vote[];
}