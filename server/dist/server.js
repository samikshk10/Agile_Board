"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const config_1 = require("./config");
const routes_1 = require("./routes");
// Load environment variables
dotenv_1.default.config();
class App {
    app;
    port;
    mongoUri;
    constructor() {
        this.app = (0, express_1.default)();
        this.port = config_1.port || 5000;
        this.mongoUri = config_1.MONGODB_URI.url;
        this.middlewares();
        this.databaseConnection();
    }
    middlewares() {
        this.app.use((0, cors_1.default)({
            origin: config_1.BASE_URL.url
        }));
        this.app.use(express_1.default.json());
        // this.app.get("*", (req: Request, res: Response, next: NextFunction) => {
        //     res.send("Bad Request");
        // })
        this.app.use("/api", routes_1.ProxyRouter.map());
    }
    async databaseConnection() {
        try {
            await mongoose_1.default.connect(this.mongoUri);
            console.log('Connected to MongoDB');
        }
        catch (err) {
            console.error('MongoDB connection error:', err.message);
        }
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
const app = new App();
app.listen();
//# sourceMappingURL=server.js.map