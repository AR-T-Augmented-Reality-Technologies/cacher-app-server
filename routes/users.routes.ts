import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { UpdateUserType, UserService } from "../services/user.service";

// Create our PRISMA Client
const prisma = new PrismaClient()

// Create the router
const usersRoutes: Router = Router();

// Create an instance of our service and pass the db client
const userService = new UserService(prisma);

// Create a new user
usersRoutes.post('/create', async (req: Request, res: Response) => {
    const { firstname, lastname, email, password, dob, username } = req.body;

    const query_response = await userService.CreateUser({
        username: username,
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
        dob: dob
    });

    res.json(query_response);
});

// Get user by `user_id`
usersRoutes.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const query_response = await userService.ReadUser(id);

    res.json(query_response);
});

// Update user data

usersRoutes.post('/:id/updateProfileData', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const updateData: UpdateUserType = req.body;
    console.log(updateData);

    const query_response = await userService.UpdateUser(id, updateData);

    res.json(query_response);
});

// Delete user
usersRoutes.delete('/:id', async (req: Request, res: Response)  => {
    const id = parseInt(req.params.id);

    const query_response = userService.DeleteUser(id);

    res.json(query_response);
});

// Make user private
usersRoutes.put('/:id/togglePrivateUser', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const query_response = await userService.TogglePrivateUser(id);

    res.json(query_response);
});

// Login user
usersRoutes.post('/login', async (req: Request, res: Response) => {
    const { email, password_unhashed } = req.body;

    const query_response = await userService.Login({
        email: email,
        unhashed_password: password_unhashed
    });

    res.json(query_response);
});

export default usersRoutes;
