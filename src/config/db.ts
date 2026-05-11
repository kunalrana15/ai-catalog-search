import mongoose from "mongoose";

const connectDB = async(): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string,{
            dbName: process.env.DB_NAME,
        });
        
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        if(error instanceof Error) {
            console.log('MongoDB Connection failed:',
                error.message
            );
        }

        process.exit(1);
    }
}

export default connectDB;