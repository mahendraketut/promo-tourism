import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";


//Retreives all orders, products, reviews, and users from the database according to the merchant ID supplied.
export const getMerchantAnalytics = async (req, res) => {
    try {
        const orders = await Order.find({ merchantId: req.params.id });
        const products = await Product.find({ owner: req.params.id });
        const reviews = await Review.find({ merchantId: req.params.id });
        //Exclude user password.
        const users = await User.find({ _id: req.params.id }, { password: 0 });
        return res
        .status(200)
        .json(CreateSuccess(200, "Get analytics by merchant id", { orders, products, reviews, users }));
    } catch (error) {
        return res
        .status(500)
        .json(CreateError(500, "Cannot get analytics by merchant id", error));
    }
}

//Retreives all orders, products, reviews, and users from the database.
export const getAllMerchantAnalytics = async (req, res) => {
    try {
        const orders = await Order.find();
        const products = await Product.find();
        const reviews = await Review.find();
        //Exclude user password.
        const users = await User.find({ _id: req.params.id }, { password: 0 });
        return res.status(200).json(CreateSuccess(200, "Get analytics by merchant id", { orders, products, reviews, users }));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get analytics by merchant id", error));
    }
}

//Retreives and compiles analytics for all sales for all merchants for a given year.
export const getAllMerchantsSalesByMonth = async (req, res) => {
    console.log("getAllMerchantsSalesByMonth");
    try {
        const year = parseInt(req.params.year);
        console.log("year", year);

        // MongoDB aggregation pipeline
        const pipeline = [
            {
                //Sorts the orders by date and filters by year.
                $match: {
                    status: 'COMPLETED',
                    createdAt: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                    }
                }
            },
            {
                //Groups the orders by month and product.
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        productId: '$productId'
                    },
                    totalSales: { $sum: '$total' },
                    quantity: { $sum: '$quantity' },
                    revenue: { 
                        $sum: {
                            $multiply: ['$quantity', { $divide: ['$total', '$quantity'] }] 
                        } 
                    }
                }
            },
            {
                //Sorts the orders by revenue.
                $sort: { 'revenue': -1 } 
            },
            {
                //Re-groups the orders by month.
                $group: {
                    _id: '$_id.month',
                    totalSales: { $sum: '$totalSales' },
                    count: { $sum: 1 },
                    totalProductsSold: { $sum: '$quantity' },
                    salesRanking: {
                        $push: {
                            productId: '$_id.productId',
                            quantity: '$quantity'
                        }
                    },
                    revenueRanking: {
                        $push: {
                            productId: '$_id.productId',
                            revenue: '$revenue'
                        }
                    }
                }
            },
            {
                //Sorts the orders by month.
                $sort: { _id: 1 }
            }
        ];

        const monthlySales = await Order.aggregate(pipeline);
        console.log("monthlySales", monthlySales);

        // Initialize all months with default values
        let salesByMonth = [];
        for (let i = 1; i <= 12; i++) {
            salesByMonth.push({
                month: i,
                totalSales: 0,
                count: 0,
                totalProductsSold: 0,
                salesRanking: [],
                revenueRanking: []
            });
        }

        // Merge the sales data with the initialized months
        monthlySales.forEach((sale) => {
            const monthIndex = sale._id - 1;
            salesByMonth[monthIndex].totalSales = sale.totalSales;
            salesByMonth[monthIndex].count = sale.count;
            salesByMonth[monthIndex].totalProductsSold = sale.totalProductsSold;
            salesByMonth[monthIndex].salesRanking = sale.salesRanking;
            salesByMonth[monthIndex].revenueRanking = sale.revenueRanking;
        });
        console.log("monthlysales2", monthlySales);
        console.log("salesByMonth", salesByMonth);

        return res
            .status(200)
            .json(CreateSuccess(200, "Sales by month for all merchants", salesByMonth));
    } catch (error) {
        return res
            .status(500)
            .json(CreateError(500, "Cannot get sales by month for all merchants", error));
    }
};



export const getMerchantSalesByMonth = async (req, res) => {
    console.log("getMerchantSalesByMonth");
    try {
        const year = parseInt(req.query.year);
        const merchantId = req.params.id;
        //Mongodb aggregation pipeline
        const pipeline = [
            {
                $match: {
                    merchantId: merchantId,
                    status: 'COMPLETED',
                    createdAt: {
                        $gte: new Date(`${year}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${year}-12-31T23:59:59.999Z`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        productId: '$productId'
                    },
                    totalSales: { $sum: '$total' },
                    quantity: { $sum: '$quantity' },
                    revenue: { 
                        $sum: {
                            $multiply: ['$quantity', { $divide: ['$total', '$quantity'] }] 
                        } 
                    } // Calculate revenue as quantity * (total / quantity)
                }
            },
            {
                $sort: { 'revenue': -1 } // Sort by revenue within each month
            },
            {
                $group: {
                    _id: '$_id.month',
                    totalSales: { $sum: '$totalSales' },
                    count: { $sum: 1 },
                    totalProductsSold: { $sum: '$quantity' },
                    salesRanking: {
                        $push: {
                            productId: '$_id.productId',
                            quantity: '$quantity'
                        }
                    },
                    revenueRanking: {
                        $push: {
                            productId: '$_id.productId',
                            revenue: '$revenue'
                        }
                    }
                }
            },
            {
                $sort: { _id: 1 } // Sort by month (ascending)
            }
        ];

        const monthlySales = await Order.aggregate(pipeline);

        // Initialize all months with default values
        let salesByMonth = [];
        for (let i = 1; i <= 12; i++) {
            salesByMonth.push({
                month: i,
                totalSales: 0,
                count: 0,
                totalProductsSold: 0,
                salesRanking: [],
                revenueRanking: []
            });
        }

        // Merge the sales data with the initialized months
        monthlySales.forEach((sale) => {
            const monthIndex = sale._id - 1;
            salesByMonth[monthIndex].totalSales = sale.totalSales;
            salesByMonth[monthIndex].count = sale.count;
            salesByMonth[monthIndex].totalProductsSold = sale.totalProductsSold;
            salesByMonth[monthIndex].salesRanking = sale.salesRanking;
            salesByMonth[monthIndex].revenueRanking = sale.revenueRanking;
        });

        return res
            .status(200)
            .json(CreateSuccess(200, "Sales by month", salesByMonth));
    } catch (error) {
        return res
            .status(500)
            .json(CreateError(500, "Cannot get sales for a merchant by month", error));
    }
};


