import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import path from "path";
import cors from "cors";

//import routes
import apiRouter from "./routes";

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

// Add API router
app.use('/api', apiRouter);

// Default response for GET on /
app.get('/', (req: Request, res: Response) => {
    res.send('<h1>Index from server</h1>');
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
console.log(`Example app listening on port ${port}`)
});