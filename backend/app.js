import express from 'express' 
import cors from "cors"
import cookieParser from 'cookie-parser'
import path from 'path'
import authRouter from "./router/auth.router.js"
import courseRouter from "./router/course.router.js"
import instructorRouter from "./router/instructor.router.js"
import learnerRouter from "./router/learner.router.js"
import adminRouter from "./router/admin.router.js"
import bankRouter from "./router/bank.router.js"

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

// CORS configuration - more permissive for development
app.use(
  cors({
    origin(origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      // In development, allow all localhost origins
      if (process.env.NODE_ENV !== 'production' && origin.includes('localhost')) {
        return callback(null, true);
      }
      // Reject other origins
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

app.use("/public", express.static(path.resolve("public")));

app.use("/api/auth", authRouter);
app.use("/api/instructor", instructorRouter);
app.use("/api/learner", learnerRouter);
app.use("/api/course", courseRouter);
app.use("/api/admin",adminRouter)
app.use("/api/bank", bankRouter);

// Error handling middleware - must be after all routes
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  // Set CORS headers even on error
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && origin.includes('localhost')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  const origin = req.headers.origin;
  if (origin && (allowedOrigins.includes(origin) || (process.env.NODE_ENV !== 'production' && origin.includes('localhost')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  }
  
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

export default app;