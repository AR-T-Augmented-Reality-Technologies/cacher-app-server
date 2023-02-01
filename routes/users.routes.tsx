import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken, authenticateToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient()

const userRouter: Router = Router();

userRouter.post('/create', async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, dob, username } = req.body;

    // Create password hash.
    const hashedPassword = await getHashedPassword_async(password);

    // Create 
    const newUser = await prisma.users.create({
        data: {
            user_firstname: firstname,
            user_lastname: lastname,
            user_email: email,
            user_password: hashedPassword,
            user_username: username
        }
    });

    // Create age record
    const newAge = await prisma.ages.create({
        data: {
            user_id: newUser.user_id,
            dob: new Date(dob),
            age: calculateUserAge(dob)
        }
    });

    res.json({ status: true, user: newUser, newAge: newAge });
});

userRouter.get('/:id',  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get the User
    const user = await prisma.users.findFirst({
        where: {
            user_id: parseInt(id)
        }
    });

    // Get the Users age
    const age = await prisma.ages.findFirst({
        where: {
            user_id: parseInt(id)
        }
    });

    // Get the Users roles
    const roles = await prisma.roles.findMany({
        where: {
            user_id: parseInt(id)
        }
    });

    console.log({status: true, user: user, age: age, roles: roles});

    res.json({status: true, user: user, age: age, roles: roles});
});

userRouter.post('/login', async (req: Request, res: Response) => {
    const { email, username, password_unhashed } = req.body;
    var accessToken: string = "";

    // Get the password hash from database
    const user = await prisma.users.findFirst({
        where: {
            user_email: email
        },
        select: {
            user_password: true
        }
    });

    console.log(user);

    // Check passwords using salt
    const check = await checkPassword(password_unhashed, user.user_password);

    if (check) {
        // Create access token
        accessToken = generateAccessToken({ email: email });
    }

    res.json({status: check, data: { success: check, token: accessToken || ""}});
});

export default userRouter;