import { Request,Response , NextFunction } from "express";
import jwt ,  { Secret, JwtPayload }  from "jsonwebtoken";

import {JWT_SECRET} from "@repo/backend-common/config";

import { CustomRequest } from "@repo/common/types";


export const auth = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization ?? "";
   
      if (!token) {
        throw new Error();
      }
   
      const decoded = jwt.verify(token, JWT_SECRET);
      //@ts-ignore
      (req as CustomRequest).userId = decoded.userId;
      
      next();
   
    } catch (err) {
      res.status(401).json({ message: 'Please authenticate' });
    }
   };