"use client";


import { useEffect, useRef, useState } from "react";
import { initDraw } from "../draw";
import { WS_URL } from "../config";
import Canvas from "./canvas";

export default function CanvasRoom ({roomId}:{roomId:string}){
    console.log(roomId);

    const [socket,setSocket] = useState<WebSocket | null >(null);

    useEffect(()=>{
        // add token through authentication route 
        const ws = new WebSocket(`${WS_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI4ZTViNDVjYy1lZGRiLTQ5OTMtOWUwYi03MWVlYTI3ZmIyODIiLCJpYXQiOjE3NDIxOTY2NDR9.NQVmsiUK_5VpI__AiDMp_RaYbZDcxSeIx8MdguyOYLE`);

        ws.onopen = () =>{
            setSocket(ws);


         const data = JSON.stringify({
            type: "join_room",
            roomId
            });
            console.log(data);
            // ws.send(data)ws.send(JSON.stringify({
            //     type:"join_room",
            //     roomId
            // }))
            ws.send(data);

        }
    },[])
   


    if(!socket){
        return <div>Loading ...</div>
    }

    return <Canvas roomId={roomId} socket={socket}></Canvas>  
}