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

const allowlist = ['http://localhost:3000', 'localhost', 'http://127.0.0.1:3000'];

const corsOptionsDelegate = (req: Request, callback: any) => {
  let corsOptions;

  if (-1 !== allowlist.indexOf(req.header('Origin'))) {
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

const port = process.env.PORT || 4000;

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
}
);
