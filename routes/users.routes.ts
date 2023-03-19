import { Router, Request, Response } from "express";
import { PrismaClient } from '@prisma/client'
import { UpdateUserType, UserService } from "../services/user.service";
import { authenticateToken } from "../middleware/users.middleware";

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

/**
 * Get all users
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @route GET /users
 * @access Public
 * @description Get all users
 * @example http://localhost:3000/users
 **/
usersRoutes.get('/:id', authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const query_response = await userService.ReadUser(id);

    res.json(query_response);
});

// Update user data
/**
 * Update user data
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @route PUT /users/:id/updateProfileData
 * @access Private
 * @description Update user data
 * @example http://localhost:3000/users/1/updateProfileData
 * @example http://localhost:3000/users/2/updateProfileData
    **/
usersRoutes.post('/:id/updateProfileData', authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const updateData: UpdateUserType = req.body;
    console.log(updateData);

    const query_response = await userService.UpdateUser(id, updateData);

    res.json(query_response);
});

/**
 * Delete user
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @route DELETE /users/:id
 * @access Private
 * @description Delete user
 * @example http://localhost:3000/users/1
  **/
usersRoutes.delete('/:id', authenticateToken, async (req: Request, res: Response)  => {
    const id = parseInt(req.params.id);

    const query_response = userService.DeleteUser(id);

    res.json(query_response);
});

// Make user private
/**
 * Make user private
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @route PUT /users/:id/togglePrivateUser
 * @access Private
 * @description Make user private
 * @example http://localhost:3000/users/1/togglePrivateUser
 **/
usersRoutes.put('/:id/togglePrivateUser', authenticateToken, async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const query_response = await userService.TogglePrivateUser(id);

    res.json(query_response);
});

/**
 * Get all users
 * @param {Request} req
 * @param {Response} res
 * @returns {Promise<Response>}
 * @route GET /users
 * @access Public
 * @description Get all users
 * @example http://localhost:3000/users
 **/
usersRoutes.post('/login', async (req: Request, res: Response) => {
    const { email, password_unhashed } = req.body;

    const query_response = await userService.Login({
        email: email,
        unhashed_password: password_unhashed
    });

    res.json(query_response);
});

export default usersRoutes;
