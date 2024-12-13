import {z} from "zod"

export const messageSchema = z.object({
    content: z
    .string()
    .min(10,{message:'Content must be at least of 10'})
    .max(10,{message:'Content must be no longer than 300 characters'})
})