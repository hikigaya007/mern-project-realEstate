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

export const google = async (req , res ,next ) =>{
   try {
      const user = await User.findOne({email : req.body.email});
      console.log("checking user",user)
      if (user){
         const token = jwt.sign({id: user._id},process.env.JWT_SECRET)
         const {password:  pass , ...rest} = user._doc;
         res.cookie('access_token', token , {httpOnly: true})
         .status(200)
         .json(rest);
      } 
      else{
         const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);

         const hashPassword = bcryptjs.hashSync(generatedPassword, 10);

         const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4) , 
         email : req.body.email , 
         password: hashPassword , 
         avatar : req.body.photo})
         
         await newUser.save();

         const token = jwt.sign({id : newUserUser._id}, process.env.JWT_SECRET)

         const {password: pass, ...rest} = newUser._doc ; 

      res
      .cookie('accessToken',token, {httpOnly: true })
      .status(200)
      .json(rest
         );
      }
   } catch (error) {
      next(error);
      
   }
}