// models/Task.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
    content: string;
    columnId: string;
}

const TaskSchema: Schema = new Schema({
    content: { type: String, required: true },
    columnId: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
});

const Task = mongoose.model<ITask>('Task', TaskSchema);
export default Task;
