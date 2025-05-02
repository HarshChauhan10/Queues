import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import instituteUserRoute from './routes/instituteUserRoute.js';
import userRoute from './routes/userRoute.js';
import upload from './middleware/multer.js';
import queueRoutes from './routes/queueRoutes.js';
import { scheduleDynamicCronJobs } from './controllers/queueController.js';  // Import the function

// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB();

// Middlewares
app.use(express.json());
app.use(upload.none());

// CORS configuration
app.use(cors());

// Use the imported routes for /api paths (or whatever your API prefix is)
app.use('/api/institute', instituteUserRoute);
app.use('/api/user', userRoute);
app.use('/api/queue', queueRoutes);

// API endpoints
app.get('/', (req, res) => {
    res.send("API WORKING");
});

// Call the function to schedule dynamic cron jobs on server startup
scheduleDynamicCronJobs();  // This will schedule cron jobs for each queue based on windowEndTime

// Start express server
app.listen(port, () => console.log('Server started on PORT: ' + port));
