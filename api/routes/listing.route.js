import express from 'express'
import { createListing , deleteListing , updateListing , getListing } from '../controllers/listing.contoller.js';
import { verifyTokens } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/create' , verifyTokens,  createListing);
router.delete('/delete/:id' , verifyTokens,  deleteListing);
router.post('/update/:id' , verifyTokens,  updateListing);
router.get('/get/:id',  getListing);

export default router ;