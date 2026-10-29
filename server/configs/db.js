import mongoose from 'mongoose';
import dns from 'node:dns';

// Configure public DNS resolvers (Google and Cloudflare) to ensure MongoDB Atlas SRV records resolve reliably
dns.setServers(['8.8.8.8', '1.1.1.1']);

// Disable Mongoose query buffering so API routes don't freeze or hang for 10s if the database network is temporarily offline
mongoose.set('bufferCommands', false);

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected'));
        // serverSelectionTimeoutMS: 3000 ensures fast 3-second timeout if MongoDB Atlas cluster is unreachable
        await mongoose.connect(`${process.env.MONGODB_URI}/bookshow`, {
            serverSelectionTimeoutMS: 3000
        });
    } catch (error) {
        console.log('MongoDB connection notice:', error.message);
    }
}

export default connectDB;
