import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import path from "path";
import { mkdirSync } from "fs";
import { adminRouter } from "./routes/admin.routes";
import { leadRouter } from "./routes/lead.routes";
import { publicRouter } from "./routes/public.routes";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
const mediaDir = path.resolve(process.cwd(), "media");

mkdirSync(mediaDir, { recursive: true });

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use("/media", express.static(mediaDir));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", leadRouter);
app.use("/api/admin", adminRouter);
app.use("/api/public", publicRouter);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
