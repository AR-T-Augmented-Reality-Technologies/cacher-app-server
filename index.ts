import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";

import apiRouter from "./routes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const allowlist = ['https://cacherapp.com', 'http://cacherapp.com', 'http://localhost:3000'];

const corsOptionsDelegate = (req: Request, callback: any) => {
    let corsOptions;
    const request_origin: string = req.header('Origin') as string | "http://localhost:3000/";

    if (-1 !== allowlist.indexOf(request_origin)) {
        corsOptions = { origin: true }
    } else {
        corsOptions = { origin: false }
    }

    callback(null, corsOptions);
}

// Add API router
app.use('/api', cors(corsOptionsDelegate), apiRouter);

// Default response for GET on /
app.get('/', cors(corsOptionsDelegate), (req: Request, res: Response) => {
    res.send('<h1>Index from server</h1>');
});

app.use((req, res, next) => {
    res.status(404).json({
        message: 'Ohh you are lost, read the API documentation to find your way back home :)'
    })
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});
