"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BASE_URL = exports.MONGODB_URI = exports.environment = exports.appName = exports.port = void 0;
const dotenv = __importStar(require("dotenv"));
const mustExist = (value, name) => {
    if (!value) {
        console.error(`Missing Config: ${name} !!!`);
        process.exit(1);
    }
    return value;
};
dotenv.config();
exports.port = mustExist(+process.env.PORT, "PORT"), exports.appName = mustExist(process.env.APP_NAME, "APP_NAME"), exports.environment = process.env.ENVIRONMENT || "development", 
// Providers base url
exports.MONGODB_URI = {
    url: mustExist(process.env.MONGODB_URI, "MONGODB_URI"),
}, exports.BASE_URL = {
    url: mustExist(process.env.BASE_URL, "BASE_URL"),
};
//# sourceMappingURL=index.js.map