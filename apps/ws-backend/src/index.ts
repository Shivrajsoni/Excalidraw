import jwt, { JwtPayload } from "jsonwebtoken";

import {WebSocket, WebSocketServer} from "ws";
import {JWT_SECRET} from "@repo/backend-common/config";
import { partialDeepStrictEqual } from "assert";

const wss = new WebSocketServer({port:8080});

interface User {
    userId : string,
    rooms:string[],
    ws:WebSocket
}

const users :User[] = [];

function checkUser(token:string):string | null{
    const decoded = jwt.verify(token,JWT_SECRET);
    if(typeof decoded =="string"){
        return null;
    }

    if(!decoded || !(decoded as JwtPayload).userId ){
        return null;
    }
    return decoded.userId;
}



wss.on('connection',function connection(ws,request){

    const url = request.url;
    if(!url){
        return ;
    }
    const queryParams = new URLSearchParams(url.split('?')[1]);
    const token = queryParams.get('token')|| "";

    const userId = checkUser(token);
    if(!userId){
        ws.close();
        return null;
    }
    
    users.push({
        userId,
        rooms:[],
        ws: ws as unknown as WebSocket
    })

    
    ws.on('message',function message(data){
        const parseData = JSON.parse(data as unknown as string);

        if(parseData.type =="join_room"){

            //check if room id exist .
            // check if person have authorization of joining the room 
            const user = users.find(x=>x.ws === ws);
            if(!user){
                return null;
            }
            user?.rooms.push(parseData.rooomId);
        }
        if(parseData.type =="create_room"){



        }
        if(parseData.type =="leave_room"){
            const user = users.find(x =>x.ws === ws);
            if(!user){
                return null;
            }
            user.rooms = user?.rooms.filter(x =>x===parseData.rooom);
        }

        if(parseData.type ==="chat"){ 
            const roomId = parseData.roomId;
            const message = parseData.message;

            users.forEach(user =>{
                if(user.rooms.includes(roomId)){
                    user.ws.send(JSON.stringify({
                        type:"chat",
                        message:message,
                        roomId
                    }))
                }
            })


        }
    })

})