import express from "express";
import { auth } from "./auth";
import jwt from "jsonwebtoken";
import { CustomRequest } from "@repo/common/types";
import {JWT_SECRET} from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SigninSchema} from "@repo/common/types";
import cors from "cors";

import prisma from "@repo/db/client";

const app = express();

app.use(cors());

app.use(express.json());

app.post('/signup',async(req,res)=>{

    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    try {
        const user = await prisma.user.create({
            data: {
                email: parsedData.data?.email,
                // TODO: Hash the pw
                password: parsedData.data.password,
                name: parsedData.data.name
            }
        })
        res.json({
            userId: user.id
        })
        console.log("Succesully User uploadded in Database");
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }
})

app.post('/signin',async (req,res)=>{
    const parsedData = SigninSchema.safeParse(req.body);

    if (!parsedData.success) {
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    // check in db and if present return with userId and token 

        // db call
    const user = await prisma.user.findFirst({
        where:{
            email: parsedData.data.email,
            password: parsedData.data.password
        }
    })   
    if (!user) {
        res.status(403).json({
            message: "Not authorized"
        })
        return;
    } 
    const token = jwt.sign({
        userId: user?.id
    }, JWT_SECRET);

    res.json({
        token
    })
})


app.post('/room',auth,async(req,res)=>{
   // token logic authentication part

   const parsedData = CreateRoomSchema.safeParse(req.body);

   if (!parsedData.success) {
    res.json({
        message: "Incorrect inputs"
    })
    return;
    }

    // const userId = (req as unknown as CustomRequest).userId;
    //@ts-ignore
    const userId = (req as CustomRequest as string).userId;
    console.log(userId);
    try {
        const room = await prisma.room.create({
            data: {
                slug: parsedData.data.slug,
                adminId: userId
            }
        })

        res.json({
            roomId: room.id
        })
    } catch(e) {
        console.log(e);
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }

})

app.get('/chats/:roomId',async (req,res)=>{
    const roomId = Number(req.params.roomId);

    try {
        const messages = await prisma.chat.findMany({
            where:{
                roomId :roomId
            },
            orderBy:{
                id:"desc"
            },
            take:100
        });
    
        res.json({
            messages
        })
    } catch (error) {
        console.log(error);
        res.json({
            messages:[]
        })
    }


})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await prisma.room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})




app.listen(4000);
console.log("hello");