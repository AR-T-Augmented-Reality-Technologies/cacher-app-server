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

// Create our Multer Storage
const storage = multer.memoryStorage();
// Create our Multer Upload
const upload = multer({ storage: storage });

// Generate a random file name
const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

// Create our PRISMA Client
const prisma = new PrismaClient();

// Create our Router
const imagesRoutes: Router = Router();

/**
 * @route   GET api/images
 * @desc    Get all images
 * @access  Public
 * @return  JSON
 * @status  200
 **/
imagesRoutes.get('/:id',  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    // Get the Imageid
    const image = await prisma.image.findFirst({
        where: {
            photo_id: id
        }

    });

    res.json({status: true, image: image});
});

/**
 * @route   GET api/images
 * @desc    Get all images
 * @access  Public
 * @return  JSON
 * @status  200
 **/
imagesRoutes.post('/:id/getlikes',  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    // Get the Imageid
    const images = await prisma.image.findFirst({
        where: {
            photo_id: id
        }
    });
    res.json({status: true, data: {image: images}});
});

/**
 * @route   GET api/images
 * @desc    Get all images
 * @access  Public
 * @return  JSON
 * @status  200
*/
imagesRoutes.post('/:id/getcomment',  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    // Get the Imageid
    const comments = await prisma.comments.findMany({
        where: {
            photo_id: id
        }
    });
    console.log('Getting comments')
    res.json({status: true, data: {comments: comments}});
});

/**
 * @route   GET api/images
 * @desc    Get all images
 * @access  Public
 * @return  JSON
 * @status  200
 */
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

imagesRoutes.post('/:id/like',  async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
  
    const image = await prisma.image.findUnique({
      where: {
        photo_id: id
      }
    });
  
    if (!image) {
      res.status(404).json({ error: 'Image not found' });
      return;
    }
  
    const updatedImage = await prisma.image.update({
      where: {
        photo_id: id
      },
      data: {
        likes: image.likes + 1
      }
    });
  
    res.json(updatedImage);
  });
  

imagesRoutes.post('/:id/dislike',  async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const image = await prisma.image.findUnique({
    where: {
      photo_id: id
    }
  });

  if (!image) {
    res.status(404).json({ error: 'Image not found' });
    return;
  }

  const updatedImage = await prisma.image.update({
    where: {
      photo_id: id
    },
    data: {
      likes: image.likes - 1
    }
  });

  res.json(updatedImage);
});


imagesRoutes.post('/upload', upload.single('image'), async (req: Request, res: Response) => {
    const file: Express.Multer.File | undefined = req.file;

    if (!file) {
        return res.status(400).json({ status: false, message: "No file uploaded" });
    }

    const fileBuffer = await sharp(file.buffer)
        .resize({ height: 1350, width: 1080, fit: "contain" })
        .toBuffer();

    // Configure the upload details to send to S3
    const fileName = generateFileName();
    const bucketName = process.env.LINODE_OBJECT_STORAGE_BUCKET_NAME;

    if (!bucketName) {
        throw new Error('LINODE_OBJECT_STORAGE_BUCKET_NAME environment variable not defined');
    }

    const uploadParams = {
        Bucket: bucketName,
        Body: fileBuffer,
        Key: fileName,
        ACL: 'public-read',
        ContentType: file.mimetype
    };

    try {
        // Create our S3 Client
        const s3Client = new S3({
            region: process.env.LINODE_OBJECT_STORAGE_REGION,
            endpoint: process.env.LINODE_OBJECT_STORAGE_ENDPOINT,
            sslEnabled: true,
            s3ForcePathStyle: false,
            credentials: new Credentials({
                accessKeyId: process.env.LINODE_OBJECT_STORAGE_ACCESS_KEY_ID || "",
                secretAccessKey: process.env.LINODE_OBJECT_STORAGE_SECRET_ACCESS_KEY || "",
            }),
        });

        // Send the upload to S3
        const response = await s3Client.upload(uploadParams).promise();

        res.json({status: true, uploadURL: response.Location});
    } catch (e) {
        console.log(e)
    }
});

imagesRoutes.post('/addImageToScrapbook', async (req: Request, res: Response) => {  
  const scrapbookID = parseInt(req.body.scrapbookID);
  const imageURL = req.body.imageURL as string;
  const caption = req.body.caption as string;
  const userID = parseInt(req.body.userID);

  // Check image is provided
  if (!imageURL) {
    return res.status(400).json({status: false, message: "No image URL provided"});
  }

  const checkScrapbookExists = await prisma.scrapbook.findUnique({
    where: {
        scrapbook_id: scrapbookID
    }
  });

  if (!checkScrapbookExists) {
    return res.status(400).json({status: false, message: `Scrapbook does not exist, supplied id was ${scrapbookID}`}); 
  }

  // Check if scrapbook has pages
  const updatedScrapbook = await prisma.scrapbook.update({
    where: {
      scrapbook_id: scrapbookID
    },
    data: {
      images: {
        create: [{
          image: imageURL,
          likes: 0,
          num_comments: 0,
          caption: caption,
          upload_date: new Date(),
          uploaded_by: {
            create: [
              {
                user_id: userID
              }
            ]
          },
        }]
      }
    },
    include: { 
      images: true
    }
  });
  
  res.json({status: true, data: {scrapbook: updatedScrapbook}});
});

export default imagesRoutes;