import { Router, Request, Response } from "express";

const mapRoutes: Router = Router();

mapRoutes.get('', (req: Request, res: Response) => {
    res.send("...");
})

export default mapRoutes;