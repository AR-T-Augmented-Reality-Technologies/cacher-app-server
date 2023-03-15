import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient()

const scrapRoutes: Router = Router();

scrapRoutes.post('/getBooks',  async (req: Request, res: Response) => {
    const scraps = await prisma.scrapbook.findMany({
    });
    res.json({ status: true, data: { books: scraps }});
});

export default scrapRoutes;