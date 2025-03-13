import { JwtPayload } from "jsonwebtoken";
import { z } from "zod";

export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string(),
    name: z.string()
})

export const SigninSchema = z.object({
    email: z.string().email(),
    password: z.string(),
})

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20),
})

export interface CustomRequest extends Request {
    userId: string | JwtPayload;
}