import mongoose from "mongoose";

// reglas del objeto
const logSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['low','medium','high'],
        defaukt: 'low'
    },
    message: {
        type: String,
        required:true,
    },
    origin: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: new Date()
    },
})

// modelo, como voy a interactuar con mongo

export const LogModel = mongoose.model('Log',logSchema); 