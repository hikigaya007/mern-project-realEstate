import express from "express";
import { test, updateUser,deleteUser } from "../controllers/user.controller.js";
import { verifyTokens } from "../utils/verifyUser.js";


const router = express.Router();


router.get('/test',test);
router.post('/update/:id',verifyTokens,updateUser)
router.delete('/delete/:id',verifyTokens,deleteUser)

export default router;