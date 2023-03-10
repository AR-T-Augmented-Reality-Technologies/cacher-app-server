import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient()

const imagesRoutes: Router = Router();

imagesRoutes.get('/:id',  async (req: Request, res: Response) => {
    const id = req.params.id;

    // Get the Imageid
    const image = await prisma.image.findFirst({
        where: {
            photo_id: id
        }

    });

    res.json({status: true, image: image});
});

imagesRoutes.post('/getlikes',  async (req: Request, res: Response) => {
    const { id } = req.params;

    // Get the Imageid
    const images = await prisma.image.findFirst({
        where: {
            photo_id: id
        }
    });
    res.json({status: true, data: {image: images}});
});

imagesRoutes.post('/:id/getComments',  async (req: Request, res: Response) => {
    const id = req.params.id;

    // Get the Imageid
    const comments = await prisma.comments.findMany({
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

imagesRoutes.post(':id/like',  async (req: Request, res: Response) => {
    // const { imageid, likenum} = req.body;
    const id = req.params.id;

    const likeout = await prisma.image.update({
        where: {
            photo_id: id,
        },
        data: {  
                likes: {
                    increment: 1
                }      
        }
    });
    res.json({ status: true, data: { likeout: likeout }});
});

imagesRoutes.post(':id/dislike',  async (req: Request, res: Response) => {
    // const { imageid, likenum} = req.body;
    const id = req.params.id;

    const likeout = await prisma.image.update({
        where: {
            photo_id: id,
        },
        data: {  
                likes: {
                    decrement: 1
                }      
        }
    });
    res.json({ status: true, data: { likeout: likeout }});
});

export default imagesRoutes;