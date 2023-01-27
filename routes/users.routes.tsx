import { Router, Request, Response } from "express";
import { getHashedPassword_async } from "../middleware/users.middleware";
// TODO: import our database connection

const userRouter: Router = Router();

userRouter.post('/create', async (req: Request, res: Response) => {
    const { email, username, password } = req.body

    // Create password hash.
    // const hashedPassword = getHashedPassword(password);
    const hashedPassword = await getHashedPassword_async(password);
    console.log(`after getHashedPassword(): ${hashedPassword}`);

    // Create a JWT Token for Bearer Authorization.
    
    // Insert the new user to the database.
    res.send({ status: true, password: hashedPassword});
});

// userRouter.post('/login', (req: Request, res: Response) => {
//     const { email, username, password_hashed } = req.body;
//     // Check passwords using salt
// });

export default userRouter;