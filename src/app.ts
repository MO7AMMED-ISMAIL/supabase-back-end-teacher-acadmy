import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes";
import { errorMiddleware } from "./middleware/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/v1", routes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok" }));

// ─── Error Middleware ─────────────────────────────────────────────────────────
app.use(errorMiddleware);

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

export default app;