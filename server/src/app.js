import express from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.js";
import adminRoutes from "./routes/admin.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(express.json({ limit: "10kb" }));
app.use(
  "/api/orders",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 30,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use("/api/admin", adminRoutes);
app.use("/api", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
