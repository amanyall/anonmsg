import mongoose, {Schema, Document} from "mongoose";
import { Content } from "next/font/google";


export interface Message extends Document{
    content: string;
    createdAt: Date
}

// message schema

const MessageSchema: Schema<Message>= new Schema({
      content: {
        type: String,
        required: true
      },
      createdAt:{
        type: Date,
        required: true,
        default: Date.now
      }
})


export interface User extends Document{
    username: string,
    email: string,
    password: string,
    verifyCode: string,
    veryifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[]
}

// user schema

const UserSchema: Schema<User>= new Schema({
    username: {
      type: String,
      required: [true,"Username is required"],
      trim: true,
      unique: true
    },
    email:{
      type: String,
      required: [true, " Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    veryifyCodeExpiry: {
        type: Date,
        required: [true, "Verify code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    messages: [MessageSchema]
})

// exporting usermodel - 2 cases => 1 - usermodel already exists or if doesnts then create and return 

// required = mongoose.models.User, mongoose.Model<User> is tsx => return dataype should be user

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema)

export default UserModel;