import mongoose from "mongoose";

const OrderSchema = mongoose.Schema({
    userId:{
        type: String,
        required: true,
    },
    productsId:{
        type: String,
        required: true,
    },
    total:{
        type: Number,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    invoiceNumber:{
        type: String,
        required: true,
    },
    paypalInfo:[{
        type: Object,
    }],
    merchantId:{
        type: String,
        required: true,
    },
    
});