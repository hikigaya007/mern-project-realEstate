import express from "express";
import { test, updateUser,deleteUser , getUserListing , getUser } from "../controllers/user.controller.js";
import { verifyTokens } from "../utils/verifyUser.js";


const router = express.Router();


router.get('/test',test);
router.post('/update/:id',verifyTokens,updateUser)
router.delete('/delete/:id',verifyTokens,deleteUser)
router.get('/listings/:id',verifyTokens,getUserListing)
router.get('/:id',verifyTokens, getUser)

export default router;