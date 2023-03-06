import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient()

const imagesRoutes: Router = Router();

imagesRoutes.get('/:id',  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get the Imageid
    const image = await prisma.image.findFirst({
        where: {
            photo_id: id
        }

    });

    res.json({status: true, image: image});
});

imagesRoutes.post('/getcomment',  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get the Imageid
    const comments = await prisma.comments.findFirst({
        where: {
            photo_id: id
        }
    });
    res.json({status: true, data: {comments: comments}});
});

imagesRoutes.post('/addcomment',  async (req: Request, res: Response) => {
    const { imageid, userid, comment, timestamp } = req.body;

    const comments = await prisma.comments.create({
        data: {
            user_id: userid,
            photo_id: imageid,
            comment: comment,
            timestamp: new Date(timestamp)
        }
    });
    console.log(`Comment Added!`);
    res.json({ status: true, data: { comments: comments }});
});

export default imagesRoutes;