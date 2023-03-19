// Users middleware methods
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

/**
 * Get the hashed password
 * @param unhashed_password 
 * @returns 
 * @constructor
 * @deprecated
 * @see getHashedPassword_async
 */
const getHashedPassword = (unhashed_password: string) => {
    // Generate a salt
    const hashed_password = bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error(err);
            return "";
        }

        // Hash password
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

/**
 * Get the hashed password
 * @param unhashed_password
 * @returns hashed_password
 */
const getHashedPassword_async = async function (unhashed_password: string) {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);

    // Hash password
    const hashed_password = await bcrypt.hash(unhashed_password, salt);

    // Return hashed password
    return hashed_password;
};

const checkPassword = async (unhashed_password: string, hashed_password: string) => {
    return await bcrypt.compare(unhashed_password, hashed_password);
};

/**
 * Generate a token
 * @param user
 * @returns
 * @constructor
 */
const generateAccessToken = (user: any) => {
    // Check token exists
    if (process.env.TOKEN_SECRET == undefined || process.env.TOKEN_SECRET == null) {
        console.log("TOKEN_SECRET not loaded!! please check this.");
    } else {
        return jwt.sign(user, process.env.TOKEN_SECRET, { expiresIn: '86400s' });
    }
}

/**
 * Authenticate the user token
 * @param req
 * @param res
 * @param next
 * @returns
    */
const authenticateToken = (req: Request, res: Response, next: Function) => {
    // Get the token from the header
    const authHeader = req.headers['authorization'];

    // Check if token exists
    if (authHeader == undefined || authHeader == null) return res.sendStatus(401);

    // Get the token
    const token: string = authHeader && (<string>authHeader).split(' ')[1];
    console.log(`Token: ${token}`);

    // Check if token is valid
    if(token == null || token == undefined) return res.sendStatus(401);

    // Verify the token
    jwt.verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
        console.log(err);
        // Check if token is valid
        if(err) return res.sendStatus(403);

        // Set the user
        req.params.user = user;

        // Continue
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
