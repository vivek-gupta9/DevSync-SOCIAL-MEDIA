// import express from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors';
// import mongoose from 'mongoose';
// import connectDB from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import postRoutes from './routes/postRoutes.js';
// import User from './models/User.js';

// dotenv.config();
// const app = express();

// app.use(cors());
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// app.get('/', (req, res) => res.send('🚀 Nexus Premium API is running perfectly...'));

// const PORT = process.env.PORT || 5000;

// const startServer = async () => {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("Database connected successfully!");

//         // Auto-seed logic
//         const userCount = await User.countDocuments();
//         if (userCount === 0) {
//             console.log("Database empty! Seeding fake data...");
//             await seedDatabase();
//         } else {
//             console.log("Database already has data. Skipping seeding.");
//         }

//         app.listen(PORT, () => console.log(`🔥 Server ignition successful on port ${PORT}`));
//     } catch (err) {
//         console.log("Connection error:", err);
//     }
// };

// startServer();

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import User from './models/User.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('🚀 Nexus Premium API is running perfectly...'));

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected successfully!");

        app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
    } catch (err) {
        console.error("Connection error:", err);
        process.exit(1);
    }
};

startServer();
