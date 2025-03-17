

import CanvasRoom from "@/app/components/canvasRoom";
import { initDraw } from "@/app/draw";
import { useEffect, useRef } from "react";

// import React, { useEffect, useRef, useState, useCallback } from 'react';
// import { Square, Circle, Pencil, MousePointer, Trash2, Undo, Redo } from 'lucide-react';
// import rough from 'roughjs';
// import getStroke from 'perfect-freehand';

// type Tool = 'select' | 'pencil' | 'rectangle' | 'circle';
// type Point = { x: number; y: number };
// type Element = {
//   id: number;
//   type: Tool;
//   points: Point[];
//   roughElement?: any;
//   selected?: boolean;
//   strokeColor?: string;
//   strokeWidth?: number;
// };

// const colors = ['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFA500'];

// function getSvgPathFromStroke(points: number[][]): string {
//   if (!points.length) return '';

//   const d = points.reduce(
//     (acc, [x0, y0], i, arr) => {
//       const [x1, y1] = arr[(i + 1) % arr.length];
//       acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
//       return acc;
//     },
//     ['M', ...points[0], 'Q']
//   );

//   return `${d.join(' ')} Z`;
// }

// function CanvasPage() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [elements, setElements] = useState<Element[]>([]);
//   const [drawing, setDrawing] = useState(false);
//   const [tool, setTool] = useState<Tool>('pencil');
//   const [selectedColor, setSelectedColor] = useState(colors[0]);
//   const [strokeWidth, setStrokeWidth] = useState(3);
//   const [history, setHistory] = useState<Element[][]>([]);
//   const [historyIndex, setHistoryIndex] = useState(-1);
  
//   const [selectedElement, setSelectedElement] = useState<Element | null>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     const roughCanvas = rough.canvas(canvas);

//     elements.forEach(element => {
//       ctx.strokeStyle = element.strokeColor || '#000';
//       ctx.lineWidth = element.strokeWidth || 3;

//       if (element.type === 'pencil') {
//         const stroke = getStroke(element.points.map(p => [p.x, p.y]), {
//           size: element.strokeWidth || 3,
//           thinning: 0.5,
//           smoothing: 0.5,
//           streamline: 0.5,
//         });

//         ctx.fillStyle = element.strokeColor || '#000';
//         ctx.beginPath();
//         ctx.fill(new Path2D(getSvgPathFromStroke(stroke)));
//       } else {
//         const [start, end] = element.points;
//         if (!start || !end) return;

//         if (element.type === 'rectangle') {
//           roughCanvas.rectangle(
//             start.x,
//             start.y,
//             end.x - start.x,
//             end.y - start.y,
//             {
//               stroke: element.strokeColor || '#000',
//               strokeWidth: element.strokeWidth || 3,
//             }
//           );
//         } else if (element.type === 'circle') {
//           const radius = Math.sqrt(
//             Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
//           );
//           roughCanvas.circle(start.x, start.y, radius * 2, {
//             stroke: element.strokeColor || '#000',
//             strokeWidth: element.strokeWidth || 3,
//           });
//         }
//       }

//       if (element.selected) {
//         ctx.strokeStyle = '#0095ff';
//         ctx.lineWidth = 2;
//         ctx.setLineDash([5, 5]);
//         const [start, end] = element.points;
//         if (start && end) {
//           ctx.strokeRect(
//             start.x - 5,
//             start.y - 5,
//             (end.x - start.x) + 10,
//             (end.y - start.y) + 10
//           );
//         }
//         ctx.setLineDash([]);
//       }
//     });
//   }, [elements]);

//   const updateHistory = useCallback((newElements: Element[]) => {
//     setHistory(prev => [...prev.slice(0, historyIndex + 1), newElements]);
//     setHistoryIndex(prev => prev + 1);
//   }, [historyIndex]);

//   const handleUndo = () => {
//     if (historyIndex > 0) {
//       setHistoryIndex(prev => prev - 1);
//       setElements(history[historyIndex - 1]);
//     }
//   };

//   const handleRedo = () => {
//     if (historyIndex < history.length - 1) {
//       setHistoryIndex(prev => prev + 1);
//       setElements(history[historyIndex + 1]);
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent) => {
//     const { offsetX, offsetY } = e.nativeEvent;

//     if (tool === 'select') {
//       const clickedElement = elements.find(element => {
//         const [start, end] = element.points;
//         if (!start || !end) return false;

//         return (
//           offsetX >= start.x &&
//           offsetX <= end.x &&
//           offsetY >= start.y &&
//           offsetY <= end.y
//         );
//       });

//       if (clickedElement) {
//         setSelectedElement(clickedElement);
//         setElements(prev =>
//           prev.map(el =>
//             el.id === clickedElement.id
//               ? { ...el, selected: true }
//               : { ...el, selected: false }
//           )
//         );
//         return;
//       }
//       setSelectedElement(null);
//       setElements(prev => prev.map(el => ({ ...el, selected: false })));
//       return;
//     }

//     setDrawing(true);
//     const element: Element = {
//       id: Date.now(),
//       type: tool,
//       points: [{ x: offsetX, y: offsetY }],
//       strokeColor: selectedColor,
//       strokeWidth,
//     };

//     setElements(prev => [...prev, element]);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!drawing) return;

//     const { offsetX, offsetY } = e.nativeEvent;
//     const point = { x: offsetX, y: offsetY };

//     setElements(prevElements => {
//       const lastElement = prevElements[prevElements.length - 1];
//       if (!lastElement) return prevElements;

//       const newElement = {
//         ...lastElement,
//         points: tool === 'pencil'
//           ? [...lastElement.points, point]
//           : [lastElement.points[0], point]
//       };
//       return [...prevElements.slice(0, -1), newElement];
//     });
//   };

//   const handleMouseUp = () => {
//     if (drawing) {
//       updateHistory([...elements]);
//     }
//     setDrawing(false);
//   };

//   const handleDeleteSelected = () => {
//     if (selectedElement) {
//       setElements(prev => prev.filter(el => el.id !== selectedElement.id));
//       setSelectedElement(null);
//       updateHistory(elements.filter(el => el.id !== selectedElement.id));
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Toolbar */}
//         <div className="bg-white rounded-lg shadow-sm mb-4 p-4">
//           <div className="flex gap-4 items-center">
//             <div className="flex gap-2">
//               <button
//                 className={`p-2 rounded ${tool === 'select' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//                 onClick={() => setTool('select')}
//                 title="Select"
//               >
//                 <MousePointer className="w-5 h-5" />
//               </button>
//               <button
//                 className={`p-2 rounded ${tool === 'pencil' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//                 onClick={() => setTool('pencil')}
//                 title="Pencil"
//               >
//                 <Pencil className="w-5 h-5" />
//               </button>
//               <button
//                 className={`p-2 rounded ${tool === 'rectangle' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//                 onClick={() => setTool('rectangle')}
//                 title="Rectangle"
//               >
//                 <Square className="w-5 h-5" />
//               </button>
//               <button
//                 className={`p-2 rounded ${tool === 'circle' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
//                 onClick={() => setTool('circle')}
//                 title="Circle"
//               >
//                 <Circle className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="h-6 w-px bg-gray-200" />

//             <div className="flex gap-2">
//               <button
//                 className="p-2 rounded hover:bg-gray-100"
//                 onClick={handleUndo}
//                 disabled={historyIndex <= 0}
//                 title="Undo"
//               >
//                 <Undo className="w-5 h-5" />
//               </button>
//               <button
//                 className="p-2 rounded hover:bg-gray-100"
//                 onClick={handleRedo}
//                 disabled={historyIndex >= history.length - 1}
//                 title="Redo"
//               >
//                 <Redo className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="h-6 w-px bg-gray-200" />

//             <div className="flex gap-2 items-center">
//               <label className="text-sm text-gray-600">Color:</label>
//               <div className="flex gap-1">
//                 {colors.map(color => (
//                   <button
//                     key={color}
//                     className={`w-6 h-6 rounded-full border-2 ${
//                       selectedColor === color ? 'border-blue-500' : 'border-gray-200'
//                     }`}
//                     style={{ backgroundColor: color }}
//                     onClick={() => setSelectedColor(color)}
//                   />
//                 ))}
//               </div>
//             </div>

//             <div className="h-6 w-px bg-gray-200" />

//             <div className="flex gap-2 items-center">
//               <label className="text-sm text-gray-600">Stroke Width:</label>
//               <input
//                 type="range"
//                 min="1"
//                 max="10"
//                 value={strokeWidth}
//                 onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
//                 className="w-24"
//               />
//             </div>

//             {selectedElement && (
//               <>
//                 <div className="h-6 w-px bg-gray-200" />
//                 <button
//                   className="p-2 rounded hover:bg-red-100 text-red-600"
//                   onClick={handleDeleteSelected}
//                   title="Delete"
//                 >
//                   <Trash2 className="w-5 h-5" />
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         {/* Canvas */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <canvas
//             ref={canvasRef}
//             width={1200}
//             height={800}
//             className="w-full border border-gray-200"
//             onMouseDown={handleMouseDown}
//             onMouseMove={handleMouseMove}
//             onMouseUp={handleMouseUp}
//             onMouseLeave={handleMouseUp}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default CanvasPage;

export default async  function Canvas({params}:{
    params:{
        roomId:string
    }
}){

    const roomId = (await params).roomId;

   
    return <CanvasRoom roomId = {roomId}></CanvasRoom>

}