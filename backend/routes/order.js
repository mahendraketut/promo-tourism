//Routes for Order
import express from 'express';
import { createOrder,getOrders, getOrderById, getOrderByMerchantId, getOrderbyUserId, hasReviewed} from '../controllers/order.controller.js';
import bodyParser from 'body-parser';

const router = express.Router();
//Use jsonParser only on specific routes
const jsonParser = bodyParser.json();

router.post('/create', jsonParser, createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.get('/user/:userId', getOrderbyUserId);
router.get('/merchant/:merchantId', getOrderByMerchantId);
router.get('/hasreviewed/:orderId', jsonParser, hasReviewed);

export default router;
