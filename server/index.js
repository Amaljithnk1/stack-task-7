// Import necessary modules
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";

// Import middleware
import contentFilter from "./middleware/contentFilter.js";
import fileUpload from "./middleware/fileUpload.js";

// Import routes
import userRoutes from "./routes/users.js";
import questionRoutes from "./routes/Questions.js";
import answerRoutes from "./routes/Answers.js";
import contentRoutes from './routes/content.js';
import { uploadContent } from "./controllers/content.js"; // Import the uploadContent function

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // Allow requests from all origins

// Define routes
app.get('/',(req, res) => {
    res.send("This is a stack overflow clone API")
});
app.use("/user", userRoutes);
app.use("/questions", questionRoutes);
app.use("/answer", answerRoutes);

// Apply middleware for content filtering and file upload to the content routes
contentRoutes.post("/upload", fileUpload.single('file'), contentFilter, uploadContent);
app.use("/content", contentRoutes);

// Set up server
const PORT = process.env.PORT || 5000;
const DATABASE_URL = process.env.CONNECTION_URL;

mongoose.connect(DATABASE_URL, { useNewUrlParser:true , useUnifiedTopology: true })
    .then(() => {
        // Create HTTP server
        const server = http.createServer(app);

        // Initialize Socket.IO
        const io = new Server(server);

        // Socket.IO event listeners for public space
        io.on('connection', (socket) => {
            console.log('A user connected to the public space');

            // Handle public space interactions here
            socket.on('publicSpaceMessage', (message) => {
                // Broadcast the message to all clients
                io.emit('publicSpaceMessage', message);
            });

            // Add more event listeners as needed
        });

        // Start listening on the specified port
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => console.log(err.message));
