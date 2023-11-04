import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

const app = express();
dotenv.config();


import roleRoutes from "./routes/role.js";
app.use(express.json());
app.use('/api/role', roleRoutes);



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





