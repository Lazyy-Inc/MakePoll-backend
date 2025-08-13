import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '24h';

export const generateToken = (pollUuid: string): string => {
    return jwt.sign({ pollUuid }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const verifyToken = (token: string): { pollUuid: string } => {
    return jwt.verify(token, JWT_SECRET) as { pollUuid: string };
};