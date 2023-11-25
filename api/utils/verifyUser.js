import { errorHandler } from "./error.js";
import jwt from "jsonwebtoken";

export const verifyTokens = (req , res , next ) => {
    const token = req.cookies.accessToken;

    if(!token) return next(errorHandler(401 , "Unauthorized"))

    jwt.verify(token , process.env.JWT_SECRET , (err ,user) =>{
        if(err) return next(errorHandler(403, 'forbidden'))

        req.user = user;
        next();
    });
    
};