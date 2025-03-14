import axios from "axios";
import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket (){
    const [loading,setLoading] = useState(true);
    const [socket,setSocket] = useState<WebSocket>();

    useEffect(()=>{
        const ws = new WebSocket(`${WS_URL}/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ODhmZjg5Zi1iZTZiLTQ0YTItODM1NS1kNjYxYjZhZjFjMDYiLCJpYXQiOjE3NDE4NDMxMzN9.3RQm_DUxhabO7JQfz1UTc7Plc-kkhQAtKXIHsC5-L9g`);
    
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws);
        }

    },[]);
    return{
        socket,
        loading
    }
}