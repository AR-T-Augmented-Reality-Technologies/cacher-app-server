import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'

// Create our PRISMA Client
const prisma = new PrismaClient()

const userRouter: Router = Router();

userRouter.post('/create', async (req: Request, res: Response) => {
    const { firstname, lastname, email, password } = req.body;

    // Create password hash.
    const hashedPassword = await getHashedPassword_async(password);

    // TODO: Create a JWT Token for Bearer Authorization. -- maybe only on login
    
    const newUser = await prisma.users.create({
        data: {
            user_firstname: firstname,
            user_lastname: lastname,
            user_email: email,
            user_password: hashedPassword
        }
    });

    res.json({ status: true, user: newUser });
});

userRouter.get('/:id', async (req: Request, res: Response) => {
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

    res.json({status: true, user: user, age: age, roles: roles});
});

userRouter.post('/login', async (req: Request, res: Response) => {
    const { email, username, password_unhashed } = req.body;

    // Get the password hash from database
    const password_hash = await prisma.users.findFirst({
        where: {
            user_email: email
        },
        select: {
            user_password: true
        }
    });

    // Check passwords using salt
    const check = await checkPassword(password_unhashed, password_hash.user_password);

    res.json({status: check, data: { success: check, token: "", refresh_token: ""}});
});

export default userRouter;