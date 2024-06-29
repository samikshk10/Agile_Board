"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
        this.app.get("/", (req, res) => {
            res.send("Testing");
        });
        this.app.use(express_1.default.json());
        // this.app.get("*", (req: Request, res: Response, next: NextFunction) => {
        //     res.send("Bad Request");
        // })
        this.app.use("/api", routes_1.ProxyRouter.map());
    }
    databaseConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield mongoose_1.default.connect(this.mongoUri);
                console.log('Connected to MongoDB');
            }
            catch (err) {
                console.error('MongoDB connection error:', err.message);
            }
        });
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`Server listening on port ${this.port}`);
        });
    }
}
const app = new App();
app.listen();
//# sourceMappingURL=index.js.map