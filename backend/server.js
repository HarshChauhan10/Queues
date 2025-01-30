import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './config/mongodb.js';
import instituteUserRoute from './routes/instituteUserRoute.js'
import upload from './middleware/multer.js';


// App config
const app = express();
const port = process.env.PORT || 4000;
connectDB()

// Middlewares
app.use(express.json());
app.use(upload.none());

//cors
//we can acess the backend form any IP secure connection 
app.use(cors());


// Use the imported routes for /api paths (or whatever your API prefix is)
app.use('/api/institute', instituteUserRoute); // This will handle routes like /api/register, /api/completeProfile, etc.

// API endpoints
app.get('/', (req, res) => {
    res.send("API WORKING");
});

// Start express server
app.listen(port, () => console.log('Server started on PORT: ' + port));