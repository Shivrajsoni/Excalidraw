
import { useEffect, useRef } from "react";
import { initDraw } from "../draw";

export default function Canvas({roomId,socket}:{
    roomId:string;
    socket:WebSocket;
}){
    const canvasRef = useRef<HTMLCanvasElement>(null);


    useEffect(()=>{
        console.log('in useEffect ');
        console.log(canvasRef.current);
        if(canvasRef.current){
            const canvas  = canvasRef.current;
            console.log(canvasRef.current);
            //@ts-ignore

            initDraw(canvas,roomId,socket);
        }
    },[canvasRef,roomId])

    return<canvas  ref = {canvasRef} height={window.innerHeight} width={window.innerWidth}></canvas>

}