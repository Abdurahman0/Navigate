import "dotenv/config";
import cors from "cors";
import express from "express";
import { leadRouter } from "./routes/lead.routes";

const app = express();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";

app.use(
  cors({
    origin: frontendOrigin,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api", leadRouter);

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});

