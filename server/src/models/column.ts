import mongoose, { Schema, Document } from 'mongoose';

export interface IColumn extends Document {
    title: string;
}

const ColumnSchema: Schema = new Schema({
    title: { type: String, required: true },
});

const Column = mongoose.model<IColumn>('Column', ColumnSchema);
export default Column;
