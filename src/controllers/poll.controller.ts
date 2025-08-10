import { Request, Response } from 'express';
import { ErrorHandler } from '../utils/error/error-handler';

export async function getPolls(req: Request, res: Response) {
    try {
        res.send('ok');
    } catch (e) {
        return ErrorHandler(e, req, res);
    }
}