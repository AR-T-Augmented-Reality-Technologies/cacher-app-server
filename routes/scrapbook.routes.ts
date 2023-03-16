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

scrapRoutes.post('/setBooks',  async (req: Request, res: Response) => {
    const { loc } = req.body;

    const books = await prisma.scrapbook.create({
        data: {
            location: loc,
        }
    });
    res.json({ status: true, data: { books: books }});
});

scrapRoutes.post('/setBlocked',  async (req: Request, res: Response) => {
    const { loc, bestloc } = req.body;

    console.log("aDDEd blocked");
    const books = await prisma.preoccupied.create({
        data: {
            location: loc,
            closest_book: bestloc
        }
    });
    res.json({ status: true, data: { books: books }});

});

export default scrapRoutes;