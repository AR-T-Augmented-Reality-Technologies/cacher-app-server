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

adminRoutes.post('/getUsers',  async (req: Request, res: Response) => {
    const usercount = await prisma.users.count({
    });
    res.json({ status: true, data: { usercount: usercount }});
});

adminRoutes.post('/getCom',  async (req: Request, res: Response) => {
    const comcount = await prisma.comments.count({
    });
    res.json({ status: true, data: { comcount: comcount }});
});

adminRoutes.post('/getImage',  async (req: Request, res: Response) => {
    const imcount = await prisma.image.count({
    });
    res.json({ status: true, data: { imcount: imcount }});
});

adminRoutes.post('/getResponded',  async (req: Request, res: Response) => {
    const respcount = await prisma.reported_posts.count({
        where:{
            issue_resolved: true
        }
    });
    res.json({ status: true, data: { respcount: respcount }});
});

adminRoutes.post('/getScrap',  async (req: Request, res: Response) => {
    const scrapcount = await prisma.scrapbook.count({
    });
    res.json({ status: true, data: { scrapcount: scrapcount }});
});
export default adminRoutes;