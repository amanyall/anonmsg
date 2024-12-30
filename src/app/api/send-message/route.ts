import dbConnnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { Message } from "@/model/user";

export async function POST(request: Request){
    await dbConnnect()

    const{username, content} = await request.json()

    try {
        const user = await UserModel.findOne({username})
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                },
                {status: 404 }
            )
        }

        // is user accepting the messages
        if (!user.isAcceptingMessage) {
            return Response.json({
                success: false,
                message: "User is not accepting the messages",
            },
            {status:403}
        )
        }

        const newMessage = {content, createdAt: new Date()}
        user.messages.push(newMessage as Message)
        await user.save()
    } catch (error) {
        console.log("Error adding messages", error)
        return Response.json({
            success: false,
            message: "Internal server error",
        },
        {status:500}
    )
    }
}