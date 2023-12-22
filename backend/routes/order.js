import express from 'express';
import { createOrder,getOrders, getOrderById, getOrderByMerchantId, getOrderbyUserId } from '../controllers/order.controller.js';
import bodyParser from 'body-parser';


const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/create', jsonParser, createOrder);
router.get('/', getOrders);
router.get('/:orderId', getOrderById);
router.get('/user/:userId', getOrderbyUserId);
router.get('/merchant/:merchantId', getOrderByMerchantId);

export default router;
