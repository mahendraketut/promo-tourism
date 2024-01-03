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
//Also ranks the sales by quantity and revenue.
//Used by admin to view all sales for all merchants for a given year.
export const getAllMerchantsSalesByMonth = async (req, res) => {
    console.log("getAllMerchantsSalesByMonth");
    try {
        const year = parseInt(req.params.year);
        console.log("year", year);

        // MongoDB aggregation pipeline
        const pipeline = [
            {
                //Finds all orders for the given year.
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
                    quantity: { $sum: '$quantity' }
                }
            },
            {
                //Groups the orders by month.
                $group: {
                    _id: '$_id.month',
                    details: {
                        $push: {
                            productId: '$_id.productId',
                            totalSales: '$totalSales',
                            quantity: '$quantity'
                        }
                    }
                }
            },
            {
                //Sorts the orders by month (jan first).
                $sort: { '_id': 1 }
            }
        ];

        let monthlySales = await Order.aggregate(pipeline);

        //Sorts the orders by revenue and also number sold.
        monthlySales = monthlySales.reduce((acc, curr) => {
            //This simply do regular sorting by comparing which one has the higher quantity.
            const salesRanking = [...curr.details].sort((a, b) => b.quantity - a.quantity);
            //This simply do regular sorting by comparing which one has the higher revenue (total sales).
            const revenueRanking = [...curr.details].sort((a, b) => b.totalSales - a.totalSales);
            //This is the final array that will be returned.
            acc.push({
                month: curr._id,
                totalSales: curr.details.reduce((a, b) => a + b.totalSales, 0),
                count: curr.details.length,
                totalProductsSold: curr.details.reduce((a, b) => a + b.quantity, 0),
                salesRanking,
                revenueRanking
            });

            return acc;
        }, []);

        //Initialize the months if they are missing (no sales for that month).
        //Enters them with 0 on the fields, but we require them to be there for the frontend.
        for (let i = 1; i <= 12; i++) {
            if (!monthlySales.find(ms => ms.month === i)) {
                monthlySales.push({
                    month: i,
                    totalSales: 0,
                    count: 0,
                    totalProductsSold: 0,
                    salesRanking: [],
                    revenueRanking: []
                });
            }
        }

        //Sorts the final array by month
        monthlySales.sort((a, b) => a.month - b.month);

        return res.status(200).json(CreateSuccess(200, "Sales by month for all merchants", monthlySales));
    } catch (error) {
        console.error(error); // It's a good idea to log the error for debugging purposes.
        return res.status(500).json(CreateError(500, "Cannot get sales by month for all merchants", error));
    }
};


//Retreives and compiles analytics for all sales for a given year for a given merchant.
//Also ranks the sales by quantity and revenue.
//Used by admin and merchant themselves to view all sales for a given year for a given merchant.
export const getMerchantSalesByMonth = async (req, res) => {
    try {
        const year = parseInt(req.query.year);
        const merchantId = req.params.id;

        // MongoDB aggregation pipeline
        const pipeline = [
            {
                //Finds all orders for the given merchant for the given year.
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
                //Groups the orders by month and product.
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        productId: '$productId'
                    },
                    totalSales: { $sum: '$total' },
                    quantity: { $sum: '$quantity' }
                }
            },
            {
                //Groups the orders by month.
                $group: {
                    _id: '$_id.month',
                    details: {
                        $push: {
                            productId: '$_id.productId',
                            totalSales: '$totalSales',
                            quantity: '$quantity'
                        }
                    }
                }
            },
            {
                //Sorts the orders by month (jan first).
                $sort: { '_id': 1 }
            }
        ];

        let monthlySales = await Order.aggregate(pipeline);

        //Sorts the orders by revenue and also number sold.
        monthlySales = monthlySales.reduce((acc, curr) => {
            //This simply do regular sorting by comparing which one has the higher quantity.
            const salesRanking = [...curr.details].sort((a, b) => b.quantity - a.quantity);
            //This simply do regular sorting by comparing which one has the higher revenue (total sales).
            const revenueRanking = [...curr.details].sort((a, b) => b.totalSales - a.totalSales);
            //This is the final array that will be returned.
            acc.push({
                month: curr._id,
                totalSales: curr.details.reduce((a, b) => a + b.totalSales, 0),
                count: curr.details.length,
                totalProductsSold: curr.details.reduce((a, b) => a + b.quantity, 0),
                salesRanking,
                revenueRanking
            });

            return acc;
        }, []);

        //Initialize the months if they are missing (no sales for that month).
        //Enters them with 0 on the fields, but we require them to be there for the frontend.
        for (let i = 1; i <= 12; i++) {
            if (!monthlySales.find(ms => ms.month === i)) {
                monthlySales.push({
                    month: i,
                    totalSales: 0,
                    count: 0,
                    totalProductsSold: 0,
                    salesRanking: [],
                    revenueRanking: []
                });
            }
        }

        //Sorts the final array by month
        monthlySales.sort((a, b) => a.month - b.month);

        return res.status(200).json(CreateSuccess(200, "Sales by month", monthlySales));
    } catch (error) {
        return res.status(500).json(CreateError(500, "Cannot get sales for a merchant by month", error));
    }
};

//Retreives the total transaction amount for a given merchant.
export const getTransactionTotalByMerchant = async (req, res) => {
try {
//Find all orders for the given merchant.
    const orders = await Order.find({ merchantId: "req.params.id" });
    let total = 0;
    //Add up the total of all orders.
    orders.forEach((order) => {
    total += order.total;
    });
    return res.status(200).json(CreateSuccess(200, "Get transaction total by merchant", total));

} catch (error) {
    return res.status(500).json(CreateError(500, "Cannot get transaction total by merchant", error));
}
}



