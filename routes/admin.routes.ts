import { Router, Request, Response } from "express";
import { getHashedPassword_async, checkPassword, generateAccessToken } from "../middleware/users.middleware";
import { PrismaClient } from '@prisma/client'
import { calculateUserAge } from "../helpers/users.helper";

// Create our PRISMA Client
const prisma = new PrismaClient()

const adminRoutes: Router = Router();

adminRoutes.post('/getReports',  async (req: Request, res: Response) => {
    const reports = await prisma.reported_posts.findMany({
        where: {
            NOT: {
                issue_resolved: true
            },
        }
    });
    res.json({ status: true, data: { reported_posts: reports }});
});

adminRoutes.post('/resolve',  async (req: Request) => {
    const id  = parseInt(req.body.repid);
    const updatereport = await prisma.reported_posts.update({
        where: {
            reportid: id
        },
        data: {
            issue_resolved:{
                set: true
            },
        },
    })
});

export default adminRoutes;