import { Request, Response } from 'express';
import Column from '../models/Columns';
import Task from '../models/Task';

export class ColumnController {
    public constructor() { }

    public static async getColumns(req: Request, res: Response): Promise<void> {
        try {
            const columns = await Column.find();
            res.json(columns);
        } catch (err: any) {
            res.status(500).json({ message: err.message });
        }
    }

    public static async addColumn(req: Request, res: Response): Promise<void> {
        const { title } = req.body;

        try {
            const newColumn = new Column({ title });
            const savedColumn = await newColumn.save();
            res.status(201).json(savedColumn);
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    public static async editColumn(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        const { title } = req.body;
        try {
            const updatedColumn = await Column.findByIdAndUpdate(
                id,
                { title },
                { new: true }
            );
            if (!updatedColumn) {
                res.status(404).json({ message: 'Column not found' });
            } else {
                res.json(updatedColumn);
            }
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

    public static async deleteColumn(req: Request, res: Response): Promise<void> {
        const { id } = req.params;
        try {
            const column = await Column.findByIdAndDelete(id);
            if (column) {
                await Task.deleteMany({ columnId: id });
                res.json({ message: 'Column and related tasks deleted' });
            } else {
                res.status(404).json({ message: 'Column not found' });
            }
        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }

}
