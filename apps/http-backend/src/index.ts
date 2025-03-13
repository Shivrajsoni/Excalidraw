import express from "express";
import { auth } from "./auth";
import jwt from "jsonwebtoken";

import {JWT_SECRET} from "@repo/backend-common/config";
import { CreateUserSchema} from "@repo/common/types";

const app = express();

app.post('/signup',async(req,res)=>{
    const {name,email,password} = req.body;

    const parsedData = CreateUserSchema.safeParse(req.body);

    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }

    // db call
    res.json({
        "message":"User is successfully signup"
    })
})

app.post('/signin',async (req,res)=>{
    const{name,password} = req.body;
    
    // check in db and if present return with userId and token 

        // db call
    const userId = 1;
    const token = jwt.sign({
        userId,
    },JWT_SECRET);

    res.json({
        "message":"User is successfully signup",
        "token":token
     })

})

app.post('/room',auth,async(req,res)=>{
   // token logic authentication part
    const token = req.params?.token;
    
    if(token){
        res.json({
            "message":"Room created"
        })
    }

})


app.listen(3001);
console.log("hello");