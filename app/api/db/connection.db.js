import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const res = mongoose.connect(process.env.MONGO_URI);
        console.log(`DB Connected to Host : ${(await res).connection.host}`)
    } catch (error) {
        console.log(`Error connecting DB : ${error.message}`)
    }
};