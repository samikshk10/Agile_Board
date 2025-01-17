import express, { Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { BASE_URL, MONGODB_URI, port } from './config';
import { ProxyRouter } from './routes';
import { Request, Response, NextFunction } from 'express';

// Load environment variables
dotenv.config();

class App {
    public app: Application;
    private port: number | string;
    private mongoUri: string;

    constructor() {
        this.app = express();
        this.port = port || 5000;
        this.mongoUri = MONGODB_URI.url;
        this.middlewares();
        this.databaseConnection();
    }

    private middlewares(): void {
        var corsOptions = {
            origin: BASE_URL.url,
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        }

        this.app.use(cors(corsOptions));
        this.app.get("/", (req: Request, res: Response) => {
            res.send("Testing");
        });
        this.app.use(express.json());
        // this.app.get("*", (req: Request, res: Response, next: NextFunction) => {
        //     res.send("Bad Request");

        // })
        this.app.use("/api", ProxyRouter.map());
    }



    private async databaseConnection(): Promise<void> {
        try {
            await mongoose.connect(this.mongoUri);
            console.log('Connected to MongoDB');
        } catch (err: any) {
            console.error('MongoDB connection error:', err.message);
        }
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}

const app = new App();
app.listen();
