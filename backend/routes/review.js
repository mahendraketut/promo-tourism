import express from 'express';

import { createReview, getReviewById, getReviewByProduct, getReviewByOrder, getReviewAverageByProduct} from '../controllers/review.controller.js';


const router = express.Router();


router.post('/create', createReview);
router.get('/product/:id', getReviewByProduct);
router.get('/:id', getReviewById);
router.get('/order/:id', getReviewByOrder);
router.get('/average/:id', getReviewAverageByProduct);



export default router;
