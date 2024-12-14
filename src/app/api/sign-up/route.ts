import dbConnnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcryptjs"

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request){
    
    try {
        const {username, email, password}=await request.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            },{status: 400})
        }

        const existingUserByemail = await UserModel.findOne({email})

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if(existingUserByemail){
            if (existingUserByemail.isVerified) {
                return Response.json({
                    success: true,
                message: "User registered successfully. Please verify your email"
                },{status:400})
            } else{
               const hasedPassword = await bcrypt.hash(password,10) 
               existingUserByemail.password = hasedPassword;
               existingUserByemail.verifyCode = verifyCode;
               existingUserByemail.veryifyCodeExpiry = new Date(Date.now() + 3600000)
               await existingUserByemail.save()
            }
        }else{
            const hasedPassword = await bcrypt.hash(password, 10)
            const expiryDate = new Date()
            expiryDate.setHours(expiryDate.getHours() + 1)

            const newUser =  new UserModel({
                    username,
                    email,
                    password: hasedPassword,
                    verifyCode: verifyCode,
                    veryifyCodeExpiry: expiryDate,
                    isVerified: false,
                    isAcceptingMessage: true,
                    messages: []
            })
            await newUser.save()
        }

        //send verification email
        const emailResponse  = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if (!emailResponse.success) {
           return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email"
            },{status:201})
        }
 
        return Response.json(
            {
                success: false,
                message: emailResponse.message
            },{status:500})


    } catch (error) {
        console.error('Error registering user',error)
        return Response.json({
            success: false,
            message: "Error registering user"
        },
        {
            status: 500
        }
    )
    }
}