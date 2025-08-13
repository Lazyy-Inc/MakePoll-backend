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
        where: { uuid: pollUuid },
        relations: { questions: true }
    })

    if (poll) {
        Index.io.to(pollUuid).emit('pollUpdated', { questions: JSON.stringify(poll.questions) });
    }
};