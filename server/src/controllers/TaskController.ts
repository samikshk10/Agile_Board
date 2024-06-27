import { Request, Response } from 'express';
import Task from '../models/Task';

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

    public static async addTask(req: Request, res: Response): Promise<void> {
        const { content, columnId } = req.body;
        const newTask = new Task({ content, columnId });
        try {
            const savedTask = await newTask.save();
            res.status(201).json(savedTask);
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

