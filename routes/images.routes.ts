import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";
import AWS, { Credentials } from 'aws-sdk';
import multer from 'multer';
import sharp from 'sharp';
import S3 from "aws-sdk/clients/s3";
import crypto from 'crypto';

import dotenv from 'dotenv'

dotenv.config()

// Create uplod method
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3Client = new S3({
    region: process.env.LINODE_OBJECT_STORAGE_REGION,
    endpoint: process.env.LINODE_OBJECT_STORAGE_ENDPOINT,
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
        accessKeyId: process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID,
        secretAccessKey: process.env.LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY,
    }),
});

// Create our PRISMA Client
const prisma = new PrismaClient();

const imagesRoutes: Router = Router();

imagesRoutes.get('/:id',  async (req: Request, res: Response) => {
    const id = req.params.id;

    // Get the Imageid
    const image = await prisma.image.findFirst({
        where: {
            photo_id: id
        },
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

imagesRoutes.post('/getcomment',  async (req: Request, res: Response) => {
    const id = req.params.id;

    // Get the Imageid
    const comments = await prisma.comments.findMany({
        where: {
            photo_id: id
        },
        orderBy:{
            timestamp: 'desc',
        }
    });
    console.log('Getting comments')
    res.json({status: true, data: {comments: comments}});
});

imagesRoutes.post('/addcomment',  async (req: Request, res: Response) => {
    const { imageid, userid, comment, timestamp } = req.body;

    const comments = await prisma.comments.create({
        data: {
            user_id: userid,
            photo_id: imageid,
            comment: comment,
            timestamp: timestamp
        }
    });
    console.log(`Comment Added!` + timestamp);
    res.json({ status: true, data: { comments: comments }});
});

imagesRoutes.post('/:id/like',  async (req: Request, res: Response) => {
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

imagesRoutes.post('/:id/dislike',  async (req: Request, res: Response) => {
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

imagesRoutes.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    const file = req.file; 

    console.log(file);
    console.log(req);

    const fileBuffer = await sharp(file?.buffer)
        .resize({ height: 1350, width: 1080, fit: "contain" })
        .toBuffer();

    // Configure the upload details to send to S3
    const fileName = generateFileName();
    const uploadParams = {
        Bucket: process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME,
        Body: fileBuffer,
        Key: fileName,
        ACL: 'public-read',
        ContentType: file?.mimetype
    };

    // Send the upload to S3
    const response = await s3Client.upload(uploadParams).promise();
    console.log(response);
    console.log(response.Location);

    // Save the image name to the database. Any other req.body data can be saved here too but we don't need any other image data.
    // const post = await prisma.posts.create({
    //     data: {
    //         imageName
    //     }
    // })

    // res.send(post)

    res.json({status: true, uploadURL: response.Location});
});

export default imagesRoutes;