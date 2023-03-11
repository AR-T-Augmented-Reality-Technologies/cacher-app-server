import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient()

const adminRoutes: Router = Router();

adminRoutes.post('/getReports',  async (req: Request, res: Response) => {
    const reports = await prisma.reported_posts.findMany();
    console.log('We made it to the rouite');
    res.json({ status: true, data: { reported_posts: reports }});
});

export default adminRoutes;