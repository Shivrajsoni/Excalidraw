import axios from "axios";
import { BACKEND_URL } from "../config";

// type Shape = {
//     type:"rect";
//     x:number;
//     y:number;
//     height:number;
//     width:number;
// } 


// export async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){

//     const ctx = canvas.getContext("2d");
//     let existingShape : Shape[] = await getExistingShape(roomId) ;

//     if(!ctx){
//         return ;
//     }

//     socket.onmessage = (event) =>{
//         const message = JSON.parse(event.data);
    
//         if(message.type ==="chat"){
//             const parseShape = JSON.parse(message.message);
//             existingShape.push(parseShape.shape);
//             clearCanvas(existingShape,canvas,ctx);
//         }
//     }

//     clearCanvas(existingShape, canvas, ctx);
//     let clicked = false;
//     let startX = 0;
//     let startY = 0;

//     canvas.addEventListener("mouseup",(e)=>{
//         clicked = false;
//         console.log(e.clientX);
//         console.log(e.clientY);

//         const width = e.clientX - startX;
//         const height = e.clientY - startY;

//         let shape : Shape | null = null;
//         shape = {
//             type:"rect",
//             x:startX,
//             y:startY,
//             height,
//             width
//         } 
//         if(!shape){
//             return;
//         }
        
//         existingShape.push(shape);
//         // existingShape.push({
//         //     type:"rect",
//         //     x:startX,
//         //     y:startY,
//         //     height,
//         //     width
        
//         // });

//         socket.send(JSON.stringify({
//             type:"chat",
//             message:JSON.stringify({
//                 shape
//             }),
//             roomId
//         }))
        
//     });
//     canvas.addEventListener("mousedown",(e)=>{
//         clicked = true;
//         startX = e.clientX;
//         startY = e.clientY;
//     });
//     canvas.addEventListener("mousemove",(e)=>{
//         if(clicked){
//             const width = e.clientX - startX;
//             const height = e.clientY - startY;
//             clearCanvas(existingShape, canvas, ctx);
//             ctx.strokeStyle = "rgba(255, 255, 255)"
//             ctx.strokeRect(startX, startY, width, height); 
//         }
//     });
// }

// function clearCanvas(existingShape:Shape[],canvas:HTMLCanvasElement , ctx:CanvasRenderingContext2D){
//     ctx.clearRect(0,0,canvas.width,canvas.height);
//     ctx.fillStyle = ("rgba(0, 0, 0)");
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
    
//     existingShape.map((shape)=>{
//         if(shape.type==="rect"){
//             ctx.strokeStyle = "rgba(255, 255, 255)"
//             ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
//         }
//     })

// }

// async function getExistingShape(roomId:string){
//     const response = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
//     const messages = response.data.messages;

//     console.log(messages);
//     const shapes = messages.map((x:{message:string})=>{
//         const messageData = JSON.parse(x.message);
//         return messageData.shape;
//     })

//    return shapes;
// }



type Shape = {
    type: "rect";
    x: number;
    y: number;
    width: number;
    height: number;
} | {
    type: "circle";
    centerX: number;
    centerY: number;
    radius: number;
} | {
    type: "pencil";
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");

    let existingShapes: Shape[] = await getExistingShapes(roomId)

    if (!ctx) {
        return
    }

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);

        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message)
            existingShapes.push(parsedShape.shape)
            clearCanvas(existingShapes, canvas, ctx);
        }
    }
    

    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener("mousedown", (e) => {
        clicked = true
        startX = e.clientX
        startY = e.clientY
    })

    canvas.addEventListener("mouseup", (e) => {
        clicked = false
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        // @ts-ignore
        //const selectedTool = window.selectedTool;
        const selectedTool = "rect";
        let shape: Shape | null = null;
        if (selectedTool === "rect") {

            shape = {
                type: "rect",
                x: startX,
                y: startY,
                height,
                width
            }
        } else if (selectedTool === "circle") {
            const radius = Math.max(width, height) / 2;
            shape = {
                type: "circle",
                radius: radius,
                centerX: startX + radius,
                centerY: startY + radius,
            }
        }

        if (!shape) {
            return;
        }

        existingShapes.push(shape);

        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify({
                shape
            }),
            roomId
        }))
        console.log("data sended ");

    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeStyle = "rgba(255, 255, 255)"
            // @ts-ignore

            // const selectedTool = window.selectedTool;
            // if (selectedTool === "rect") {
            //     ctx.strokeRect(startX, startY, width, height);   
            // } else if (selectedTool === "circle") {
            //     const radius = Math.max(width, height) / 2;
            //     const centerX = startX + radius;
            //     const centerY = startY + radius;
            //     ctx.beginPath();
            //     ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            //     ctx.stroke();
            //     ctx.closePath();                
            // }

            ctx.strokeRect(startX,startY,width,height);
        }
    })            
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    existingShapes.map((shape) => {
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();                
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${BACKEND_URL}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((x: {message: string}) => {
        const messageData = JSON.parse(x.message)
        return messageData.shape;
    })

    return shapes;
}