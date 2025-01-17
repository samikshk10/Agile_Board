import { Request, Response } from 'express';
import Task from '../models/Task';
import mongoose from 'mongoose';

export class TaskController {
    public constructor() { }

    public static async getTasks(req: Request, res: Response): Promise<void> {
        try {
            const tasks = await Task.find();
            res.json(tasks);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }
    public static async addTask(req: Request, res: Response) {
        const { content, columnId } = req.body;

        console.log(content, columnId);

        try {
            // Validate columnId if necessary
            if (!mongoose.Types.ObjectId.isValid(columnId)) {
                throw new Error('Invalid columnId format');
            }

            const newTask = new Task({ content, columnId });
            const savedTask = await newTask.save();
            if (savedTask) { console.log("task addedx") };
            res.status(201).json(savedTask);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
    public static async editTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { content } = req.body;
        try {
            const updatedTask = await Task.findByIdAndUpdate(
                id,
                { content },
                { new: true }
            );
            if (!updatedTask) {
                res.status(404).json({ message: 'Task not found' });
            } else {
                res.json(updatedTask);
            }
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    public static async updateTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { content, columnId } = req.body;
        try {
            const updatedTask = await Task.findByIdAndUpdate(
                id,
                { content, columnId },
                { new: true }
            );
            res.json(updatedTask);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    public static async deleteTask(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            await Task.findByIdAndDelete(id);
            res.json({ message: 'Task deleted' });
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }
}
