import express, {Request, Response} from 'express';
import cors from 'cors';
import "dotenv/config";
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import authRoutes from './routes/auth';
import cookieParser from 'cookie-parser';

mongoose.connect(process.env.MONGO_DB as string).then(() => {
    console.log("Connected to database");
  }).catch((err) => {
    console.log(err);
});

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.FRONTEND_URL,//allow only to access cookies from server not the browser
  credentials: true,
}));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);


app.listen(3000, () => {
    
    console.log("Server running on port 3000");
});