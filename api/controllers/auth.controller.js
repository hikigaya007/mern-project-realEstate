import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs' ;
import { errorHandler } from "../utils/error.js";

import  jwt from "jsonwebtoken";

export const signup = async (req , res , next) => {
   const {username , email , password} = req.body;

   const hashPassword = bcryptjs.hashSync(password,10);

   const newUser = new User({username , email , password: hashPassword});

   try{
    await newUser.save();
    res.status(201).json("user created successfully")
   } catch(error){
    next (error);
   }

};

// sign in auth
export const signin = async (req , res, next ) => {
   const {username , password } = req.body;
   try {
      const validUser = await User.findOne({username});
      if (!validUser) return next(errorHandler(404, 'User Not Found'));
      const validPassword = bcryptjs.compareSync(password , validUser.password);
      if (!validPassword) return next(errorHandler(401, "Invalid Password"));
      const token = jwt.sign({id : validUser._id}, process.env.JWT_SECRET)

      const {password: pass, ...rest} = validUser._doc ; 

      res
      .cookie('accessToken',token, {httpOnly: true })
      .status(200)
      .json(rest
         );

   } catch (error) {
      next(error);
      
   }
}