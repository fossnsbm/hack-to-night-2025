import mongoose from "mongoose";

export const Schema = mongoose.Schema;
export const ObjectId = Schema.ObjectId;

export const db = mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_HOST}/retryWrites=true&w=majority&appName=Cluster0`)
