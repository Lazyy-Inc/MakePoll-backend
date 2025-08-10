import { Request, Response } from "express";

export function ErrorHandler(error:any, req:Request , res:Response) {
    let  code = 500;
    let errorString = error.toString();
    const regex = /'([^']*)'/;

    if (errorString.indexOf('EntityNotFoundError') > -1) {
        code = 404;
    } else if (errorString.indexOf('[WARNING]') > -1) {
        code = 403;
    } else if (errorString.indexOf('Invalid token') > -1 || errorString.indexOf('SigningKeyNotFoundError') > -1) {
        code = 422;
    } else if (errorString.indexOf('Duplicate entry') > -1 && errorString.match(regex)) {
        const duplicateField = errorString.match(regex)[1];
        code = 422;
    } else {
        console.log(error.toString())
    }

    return res.sendStatus(code)
}