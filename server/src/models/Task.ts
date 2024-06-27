import { Task } from '@src/interfaces';
import { Schema, model } from 'mongoose';


const taskSchema = new Schema<Task>({
    content: { type: String, required: true },
    columnId: { type: String, required: true },
});

const Task = model<Task>('Task', taskSchema);

export default Task;
