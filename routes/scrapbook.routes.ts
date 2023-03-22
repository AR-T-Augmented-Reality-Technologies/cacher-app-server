import { Router, Request, Response } from "express";
import {
    getHashedPassword_async,
    checkPassword,
    generateAccessToken,
} from "../middleware/users.middleware";
import { PrismaClient } from "@prisma/client";
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient();

const scrapRoutes: Router = Router();

scrapRoutes.get('/:id', async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const scrapbook = await prisma.scrapbook.findUnique({
        where: {
            scrapbook_id: id
        },
        include: {
          images: true
        }
    });

    if (!scrapbook) {
        res.status(404).json({status: false, error: 'Scrapbook not found' });
        return;
    }

    res.json({ status: true, data: { scrapbook: scrapbook } });
});

scrapRoutes.post("/getBooks", async (req: Request, res: Response) => {
    const scraps = await prisma.scrapbook.findMany({});
    res.json({ status: true, data: { books: scraps } });
});

scrapRoutes.post("/setBooks", async (req: Request, res: Response) => {
    const { loc } = req.body;
  
    try {
      const books = await prisma.scrapbook.create({
        data: {
          location: loc,
        },
      });
      res.json({ status: true, data: { books: books } });
    } catch (error: any) {
      if (error.code === "P2002") {
        // If the error code is P2002, it means that the unique constraint on the `location` field has been violated
        res.json({
          status: false,
          data: {
            message: `Book with location ${loc} already exists`,
          },
        });
      } else {
        // Otherwise, it's an unexpected error and we just return the error message
        res.json({ status: false, data: { message: error.message } });
      }
    }
  });

scrapRoutes.post("/setBlocked", async (req: Request, res: Response) => {
    const { loc, bestloc } = req.body;

    console.log("blocked ", loc);
    try {
        const books = await prisma.preoccupied.create({
            data: {
                location: loc,
                closest_book: bestloc,
            },
        });
        res.json({ status: true, data: { books: books } });
    } catch (error) {
        res.json({ status: false, data: { books: error } });
    }
});

scrapRoutes.post("/getBlocked", async (req: Request, res: Response) => {
    const books = await prisma.preoccupied.findMany({});
    res.json({ status: true, data: { books: books } });
});

export default scrapRoutes;
