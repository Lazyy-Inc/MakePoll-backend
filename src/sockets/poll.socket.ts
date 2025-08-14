import { Server } from 'socket.io';
import { PollRepository } from "../database/repository/poll.repository";
import { Index } from "../index";

export const initializePollSockets = (io: Server) => {
    io.on('connection', (socket) => {
        socket.on('joinPoll', (pollUuid) => {
            socket.join(pollUuid);
        });
    });
};

export const notifyPollUpdate = async (pollUuid: string) => {
    const poll = await PollRepository.findOne({
        where: { id: pollUuid },
        relations: { votes: true }
    })

    const optionsWithVotes = poll.options.map (option => ({
        id: option.id,
        text: option.text,
        votes: option.votes ? option.votes.length : 0
    }));

    if (poll) {
        Index.io.to(pollUuid).emit('pollUpdated', { questions: JSON.stringify(optionsWithVotes) });
    }
};