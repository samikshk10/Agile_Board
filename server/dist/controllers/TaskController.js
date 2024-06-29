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
exports.TaskController = void 0;
const Task_1 = __importDefault(require("../models/Task"));
const mongoose_1 = __importDefault(require("mongoose"));
class TaskController {
    constructor() { }
    static getTasks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const tasks = yield Task_1.default.find();
                res.json(tasks);
            }
            catch (err) {
                res.status(500).json({ message: err.message });
            }
        });
    }
    static addTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { content, columnId } = req.body;
            console.log(content, columnId);
            try {
                // Validate columnId if necessary
                if (!mongoose_1.default.Types.ObjectId.isValid(columnId)) {
                    throw new Error('Invalid columnId format');
                }
                const newTask = new Task_1.default({ content, columnId });
                const savedTask = yield newTask.save();
                if (savedTask) {
                    console.log("task addedx");
                }
                ;
                res.status(201).json(savedTask);
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
    static editTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { content } = req.body;
            try {
                const updatedTask = yield Task_1.default.findByIdAndUpdate(id, { content }, { new: true });
                if (!updatedTask) {
                    res.status(404).json({ message: 'Task not found' });
                }
                else {
                    res.json(updatedTask);
                }
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
    static updateTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const { content, columnId } = req.body;
            try {
                const updatedTask = yield Task_1.default.findByIdAndUpdate(id, { content, columnId }, { new: true });
                res.json(updatedTask);
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
    static deleteTask(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                yield Task_1.default.findByIdAndDelete(id);
                res.json({ message: 'Task deleted' });
            }
            catch (err) {
                res.status(400).json({ message: err.message });
            }
        });
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map