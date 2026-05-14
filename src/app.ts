import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import helmet from "helmet";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(helmet());

const allowedOrigins = NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') || [] 
    : ['*'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", environment: NODE_ENV }));

// ─── Error Middleware ─────────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${NODE_ENV} mode on http://localhost:${PORT}`);
});

export default app;