import mongoose from "mongoose";
import dns from 'dns';

const connectDB = async ()=> {
    dns.setServers(
        ['8.8.8.8', '8.8.4.4', '1.1.1.1', '1.0.0.1']
    )
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected')
    } catch (error) {
        console.error('Database Connection error', error.message)
    }
}

export default connectDB