import { Router, Request, Response } from "express";
import { getHashedPassword_async } from "../middleware/users.middleware";
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

    res.send({ status: true, user: newUser });
});

userRouter.get('/:id', async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await prisma.users.findFirst({
        where: {
            user_id: parseInt(id)
        }
    });

    res.send({status: true, user: user});
});

// userRouter.post('/login', (req: Request, res: Response) => {
//     const { email, username, password_hashed } = req.body;
//     // Check passwords using salt
// });

export default userRouter;