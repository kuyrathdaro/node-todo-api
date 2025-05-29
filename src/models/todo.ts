import mongoose, { Model, Document } from "mongoose";
import { ITodo } from "@/interfaces/ITodo";

const Todo = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
}, {timestamps: true});

export type TodoModel = Model<ITodo & Document>;
export default mongoose.model<ITodo & mongoose.Document>("Todo", Todo);