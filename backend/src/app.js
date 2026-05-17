import "dotenv/config.js";
import express from "express";
import { createServer } from "node:http";

import { Server } from "socket.io";

import mongoose from "mongoose";
import { connectToSocket } from "./controllers/socketManager.js";

import cors from "cors";
import userRoutes from "./routes/users.routes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);


app.set("port", (process.env.PORT || 8000))
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ message: "Backend is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error("Error:", err);
    res.status(500).json({ message: "Internal server error" });
});

const start = async () => {
    try {
        console.log("Starting server...");
        console.log("MONGODB_URI:", process.env.MONGODB_URI ? "✓ Set" : "✗ Not set");
        console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN || "http://localhost:3000");
        
        app.set("mongo_user")
        const connectionDb = await mongoose.connect(process.env.MONGODB_URI)

        console.log(`✓ MONGO Connected DB Host: ${connectionDb.connection.host}`)
        
        const port = app.get("port") || 8000;
        server.listen(port, "0.0.0.0", () => {
            console.log(`✓ LISTENING ON PORT ${port}`)
        });
    } catch (error) {
        console.error("✗ Error starting server:", error.message);
        process.exit(1);
    }
}

start();