import jwt, { JwtPayload } from "jsonwebtoken";

import {WebSocket, WebSocketServer} from "ws";
import {JWT_SECRET} from "@repo/backend-common/config";

import prisma from "@repo/db/client";

const wss = new WebSocketServer({port:8080});

interface User {
    userId : string,
    rooms:string[],
    ws:WebSocket
}

const users :User[] = [];

// function checkUser(token:string):string | null{
//     try {
//         const decoded = jwt.verify(token,JWT_SECRET);
//         if(typeof decoded =="string"){
//             return null;
//         }
    
//         if(!decoded || !(decoded as JwtPayload).userId ){
//             return null;
//         }
//         return decoded.userId;
        
//     } catch (error) {
//         console.log(error);
//         return null;
//     }

// }
function checkUser(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded == "string") {
      return null;
    }

    if (!decoded || !decoded.userId) {
      return null;
    }
    console.log(decoded.userId);
    return decoded.userId;

  } catch(e) {
    return null;
  }
  return null;
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
      console.log("user token not found valid");
        ws.close();
        return null;
    }
    
    users.push({
        userId,
        rooms:[],
        ws
    })
    console.log("User pushed in rooms table");

    
    // ws.on('message',async function message(data){
    //     let parseData;
    //     if (typeof data !== "string") {
    //       parseData = JSON.parse(data.toString());
    //     } else {
    //       parseData = JSON.parse(data); // {type: "join-room", roomId: 1}
    //     }
    //    // const parseData = JSON.parse(data as unknown as string);

    //     if(parseData.type ==="join_room"){
    //         //check if room id exist .
    //         // check if person have authorization of joining the room 
    //         try {
    //             const user = users.find(x=>x.ws === ws);
    //             if(!user){
    //                 return null;
    //             }
    //             user?.rooms.push(parseData.roomId);

    //         } catch (error) {
    //             console.log(error);
    //             return null;
    //         }

    //     }

    //     if(parseData.type =="create_room"){
    //         // user is already pushed before connection so we should make its room only
    //         const user = users.find(x => x.ws ===ws);
    //         if(!user){
    //             return null;
    //         }
    //         user?.rooms.push(parseData.roomId);
            
    //     }

    //     if(parseData.type =="leave_room"){
    //         try {
    //             const user = users.find(x =>x.ws === ws);
    //             if(!user){
    //                 return null;
    //             }
    //             user.rooms = user?.rooms.filter(x =>x===parseData.room);   
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }

    //     if(parseData.type ==="chat"){ 
    //        try {
    //         const roomId = parseData.roomId;
    //         const message = parseData.message;

    //         users.forEach(user =>{
    //             if(user.rooms.includes(roomId)){
    //                 user.ws.send(JSON.stringify({
    //                     type:"chat",
    //                     message:message,
    //                     roomId
    //                 }))
    //             }
    //         })
            
    //         await prisma.chat.create({
    //             data: {
    //               roomId: Number(roomId),
    //               message,
    //               userId
    //             }
    //           });

    //        } catch (error) {
    //         console.log(error);
    //        }
    //     }

    // })


    ws.on('message', async function message(data) {
        let parsedData;
        if (typeof data !== "string") {
          parsedData = JSON.parse(data.toString());
        } else {
          parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
        }
    
        if (parsedData.type === "join_room") {
          const user = users.find(x => x.ws === ws);
          user?.rooms.push(parsedData.roomId);
          ws.send("Room Joined Successfully");
        }
    
        if (parsedData.type === "leave_room") {
          const user = users.find(x => x.ws === ws);
          if (!user) {
            return;
          }
          user.rooms = user?.rooms.filter(x => x === parsedData.room);
        }
    
        console.log("message received")
        console.log(parsedData);
    
        if (parsedData.type === "chat") {
          const roomId = parsedData.roomId;
          const message = parsedData.message;
          console.log(message);
          ws.send("Data sending to database");
         
          const messageSent = await prisma.chat.create({
            data: {
              roomId: Number(roomId),
              message,
              userId
            }
          });

          if(!messageSent){
            alert("Something wrong in while sending websocket message to the database");
          }

    
          users.forEach(user => {
            if (user.rooms.includes(roomId)) {
              user.ws.send(JSON.stringify({
                type: "chat",
                message: message,
                roomId
              }))
            }
          })
          ws.send("recieved to all sucessully");
        }
    
      });

})