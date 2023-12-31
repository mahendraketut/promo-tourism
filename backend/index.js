
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));


console.log("dirname: ", __dirname);
console.log("joined dirname: ", path.join(__dirname, '\productimg'));
const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

//Use static routes to get images and files.
app.use('/productimg', express.static(path.join(__dirname, 'productimg')));
app.use('/merchantup', express.static(path.join(__dirname, 'merchant_uploads')));

// Import auth routes.
import authRoutes from "./routes/auth.js";
app.use('/api/auth', authRoutes);

// Import product routes.
import productRoutes from "./routes/product.js";
app.use('/api/product', productRoutes);

//Import order routes.
import orderRoutes from "./routes/order.js";
app.use('/api/order', orderRoutes);

//import review routes.
import reviewRoutes from "./routes/review.js";
app.use('/api/review', reviewRoutes);

//import analytics routes.
import analyticsRoutes from "./routes/analytics.js";
app.use('/api/analytics', analyticsRoutes);

// Response Handling.
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong";
    return res.status(statusCode).json({
        success: [200, 201, 204].includes(statusCode),
        status: statusCode,
        message: message,
        data: obj.data
    });
});

// Database connection to MongoDB.
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Database connection successful");
    } catch (error) {
        console.log("Database connection failed");
        throw error;
    }
};

// Start the server and connect to MongoDB.
app.listen(process.env.PORT, () => {
    console.log("Server running on port ", process.env.PORT);
    connectMongoDB();
});
