import {model, Schema, Document} from "mongoose";
import { UserModelInterface } from "./UserModel";

export interface TweetModelInterface {
    _id?: string,
    text: string,
    // user: Schema.Types.ObjectId | string
    user: UserModelInterface
}

export type UserModelDocumentInterface = TweetModelInterface & Document

const TweetModelSchema = new Schema<TweetModelInterface>({
    text: {
        required: true,
        type: String
    },
    user: {
        required: true,
        ref: 'User',
        type: Schema.Types.ObjectId
    }
}, {timestamps: true})

export const TweetModel = model<UserModelDocumentInterface>('Tweet', TweetModelSchema)