import { Request,Response , NextFunction } from "express";
import jwt ,  { Secret, JwtPayload }  from "jsonwebtoken";

import {JWT_SECRET} from "@repo/backend-common/config";


export interface CustomRequest extends Request {
    userId: string | JwtPayload;
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization ?? "";
   
      if (!token) {
        throw new Error();
      }
   
      const decoded = jwt.verify(token, JWT_SECRET);
      (req as CustomRequest).userId = decoded;
      
      next();
   
    } catch (err) {
      res.status(401).json({ message: 'Please authenticate' });
    }
   };