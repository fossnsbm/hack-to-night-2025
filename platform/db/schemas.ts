import mongoose from "mongoose"

import { ObjectId, Schema } from "./utils"

export const Member = mongoose.model("Member", new Schema({
    id: ObjectId,
    sid: Number,
    name: String
}))

export const Team = mongoose.model("Team", new Schema({
    id: ObjectId,
    leader: ObjectId,
    members: [ObjectId],
    name: String
}))
