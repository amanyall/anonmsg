import dbConnnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {z} from "zod"
import {usernameValidation} from "@/schemas/signUpSchema"
import { use } from "react";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request:Request) {
    await dbConnnect()
   
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username : searchParams.get('username')
        }
        // validate with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result) // remove
        if (!result.success) {
          const usernameErrors = result.error.format().username?._errors  || []
          return Response.json({
            success: false,
            message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters',
          }, {status: 400})
        }

        


    } catch (error) {
        console.error("Error checking username", error)
        return Response.json({
            success: false,
            message: "Error checking username"
        },
         {status: 500}
       )
    }
    
}