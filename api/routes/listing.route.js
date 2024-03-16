import express from 'express'
import { createListing } from '../controllers/listing.contoller.js';
import { verifyTokens } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create' , verifyTokens,  createListing);

export default router ;