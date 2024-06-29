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
exports.ColumnController = void 0;
const column_1 = __importDefault(require("../models/column"));
const Task_1 = __importDefault(require("../models/Task"));
class ColumnController {
    constructor() { }
    static getColumns(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const columns = yield column_1.default.find();
                res.json(columns);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    static addColumn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { title } = req.body;
            try {
                const newColumn = new column_1.default({ title });
                const savedColumn = yield newColumn.save();
                res.status(201).json(savedColumn);
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
    static editColumn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { title } = req.body;
            try {
                const updatedColumn = yield column_1.default.findByIdAndUpdate(id, { title }, { new: true });
                if (!updatedColumn) {
                    res.status(404).json({ message: 'Column not found' });
                }
                else {
                    res.json(updatedColumn);
                }
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
    static deleteColumn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const column = yield column_1.default.findByIdAndDelete(id);
                if (column) {
                    yield Task_1.default.deleteMany({ columnId: id });
                    res.json({ message: 'Column and related tasks deleted' });
                }
                else {
                    res.status(404).json({ message: 'Column not found' });
                }
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
}
exports.ColumnController = ColumnController;
//# sourceMappingURL=columnController.js.map