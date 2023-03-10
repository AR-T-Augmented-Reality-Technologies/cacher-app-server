// Users middleware methods
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const getHashedPassword = (unhashed_password: string) => {
    const hashed_password = bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error(err);
            return "";
        }

        bcrypt.hash(unhashed_password, salt, (err, encrypted) => {
            if (err) {
                console.error(err);
                return "";
            }

            console.log(encrypted);
            return encrypted;
        });
    });

    return hashed_password;
};

const getHashedPassword_async = async function (unhashed_password: string) {
    // Generate salt
    const salt = await bcrypt.genSalt(10);

    const hashed_password = await bcrypt.hash(unhashed_password, salt);

    return hashed_password;
};

const checkPassword = async (unhashed_password: string, hashed_password: string) => {
    return await bcrypt.compare(unhashed_password, hashed_password);
};

const generateAccessToken = (user: any) => {
    // Check token exists
    if (process.env.TOKEN_SECRET == undefined || process.env.TOKEN_SECRET == null) {
        console.log("TOKEN_SECRET not loaded!! please check this.");
    } else {
        return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
    }
}

const authenticateToken = (req: Request, res: Response, next: Function) => {
    const authHeader = req.headers['authorization'];
    if (authHeader == undefined || authHeader == null) return res.sendStatus(401);

    const token: string = authHeader && (<string>authHeader).split(' ')[1];
    console.log(`Token: ${token}`);

    if(token == null || token == undefined) return res.sendStatus(401);

    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err);
        if(err) return res.sendStatus(403);

        req.params.user = user;

        next();
    });
 };


export {
    getHashedPassword,
    getHashedPassword_async,
    checkPassword,
    generateAccessToken,
    authenticateToken
};
