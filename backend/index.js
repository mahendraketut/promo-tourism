import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import path from "path";

const app = express();
dotenv.config();

app.use(express.json());
app.use(cors());

//Import role routes.
import roleRoutes from "./routes/role.js";
app.use('/api/role', roleRoutes);

//Import auth routes.
import authRoutes from "./routes/auth.js";
app.use('/api/auth', authRoutes);

//Import product routes.
import productRoutes from "./routes/product.js";
app.use('/api/product', productRoutes);



//Response Handling.
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const message = obj.message || "Something went wrong";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === statusCode) ? true : false,
        status: statusCode,
        message:message,
        data: obj.data
    });
});

//Database connection to MongoDB.
const connectMongoDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
        });
        console.log("Database connection successfull");
    } catch (error) {
        console.log("Database connection failed");
        throw error;
    }
};


//Routes setup back-end.
app.listen(3000, () => {
    console.log("Server running on port 3000");
    connectMongoDB()
});

// //Multer disk setup for hadnling uploads
// const storage = multer.diskStorage({
//     destinatisrcon: function (req, file, cb) {
//         cb(null, ('../images/'))
//     },
//     filename: function (req, file, cb) {
//             cb(null, file.fieldname + '-' + Date.now() + file.originalname.match(/\..*$/)[0])
//     }
// });


