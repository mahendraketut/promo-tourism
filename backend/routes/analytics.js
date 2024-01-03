import express from 'express';
import { getMerchantSalesByMonth, getMerchantAnalytics, getAllMerchantsSalesByMonth, getAllMerchantAnalytics, getTransactionTotalByMerchant } from '../controllers/analytics.controller.js';

const router = express.Router();
router.get('/merchant/:id', getMerchantAnalytics);
router.get('/merchant/all', getAllMerchantAnalytics);
router.get('/merchant/sales/:id', getMerchantSalesByMonth);
router.get('/merchant/all/:year', getAllMerchantsSalesByMonth)
router.get('/merchant/total/:id', getTransactionTotalByMerchant);





export default router;