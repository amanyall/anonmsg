import dbConnnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {z} from "zod"
import {usernameValidation} from "@/schemas/signUpSchema"
import { use } from "react";


export async function POST(request: Request){
    await dbConnnect()
    try {
        const {username, code} = await request.json()
        
        // getting the username from the url
       const decodedUsername = decodeURIComponent(username)
       const user = await UserModel.findOne({username: decodedUsername})

       if (!user) {
        return Response.json({
            success: false,
            message: "User not found"
        },
         {status: 500}
       )
       }

       // to check validity of the code
       const isCodeValid = user.verifyCode === code
       const isCodeNotExpired = new Date(user.veryifyCodeExpiry) > new Date()

       if(isCodeValid && isCodeNotExpired){
        user.isVerified = true
        await user.save()
        return Response.json({
            success: true,
            message: "Account verified successfully"
        },
         {status: 200}
       )
       } else if(!isCodeNotExpired){
        return Response.json({
            success: false,
            message: "Verification code has expired, please signup again to get a new code"
        },
         {status: 400}
       )
       } else{
        return Response.json({
            success: false,
            message: "Incorrect verification code"
        },
         {status: 400}
       )
       }

    } catch (error) {
        console.error("Error verifying user", error)
        return Response.json({
            success: false,
            message: "Error verifying user"
        },
         {status: 500}
       )
    }
}