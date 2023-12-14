// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import cors from "cors";
// import fs from "fs";
// import nodemailer from "nodemailer";
// import path from "path";
// // import bodyparser from "body-parser";
// import http from "http";

// import { fileURLToPath } from 'url';
// const __dirname = path.dirname(fileURLToPath(import.meta.url));


// const app = express();
// dotenv.config();

// app.use(express.json());
// app.use(cors());


// //Import auth routes.
// import authRoutes from "./routes/auth.js";
// app.use('/api/auth', authRoutes);

// //Import product routes.
// import productRoutes from "./routes/product.js";
// app.use('/api/product', productRoutes);



// //Response Handling.
// app.use((obj, req, res, next) => {
//     const statusCode = obj.status || 500;
//     const message = obj.message || "Something went wrong";
//     return res.status(statusCode).json({
//         success: [200, 201, 204].some(a => a === statusCode) ? true : false,
//         status: statusCode,
//         message:message,
//         data: obj.data
//     });
// });

// //Database connection to MongoDB.
// const connectMongoDB = async() => {
//     try {
//         await mongoose.connect(process.env.MONGO_URL, {
//         });
//         console.log("Database connection successfull");
//     } catch (error) {
//         console.log("Database connection failed");
//         throw error;
//     }
// };


// //Routes setup back-end.
// app.listen(process.env.PORT, () => {
//     console.log("Server running on port ", process.env.PORT);
//     connectMongoDB()
// });


// app.use('/productimg', express.static(path.join(__dirname, 'productimg')));
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

// Serve static files from the 'productimg' directory
app.use('/productimg', express.static(path.join(__dirname, 'productimg')));

// Import auth routes.
import authRoutes from "./routes/auth.js";
app.use('/api/auth', authRoutes);

// Import product routes.
import productRoutes from "./routes/product.js";
app.use('/api/product', productRoutes);

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
