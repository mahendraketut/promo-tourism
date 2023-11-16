import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();

app.use(express.json());

//import role routes
import roleRoutes from "./routes/role.js";
app.use('/api/role', roleRoutes);

//import auth routes
import authRoutes from "./routes/auth.js";
app.use('/api/auth', authRoutes);

// //Error Handling
// app.use((err, req, res, next) => {
//     const statusCode = err.status || 500;
//     const errorMessage = err.message || "Something went wrong";
//     return res.status(statusCode).json({
//         success: false,
//         status: statusCode,
//         message:errorMessage,
//         stack: err.stack
//     });
// });

//Response Handling
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



//database connection to mongo
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


//Routes setup back-end
app.listen(3000, () => {
    console.log("Server running on port 3000");
    connectMongoDB()
});

app.use('/', (req, res) => {
    return res.send("Hello World from slash");
});

app.use('/api/login', (req, res) => {
    return res.send("Hello World from login");
});

app.use('/api/register', (req, res) => {
    return res.send("Hello World from register");
});





