"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const lead_routes_1 = require("./routes/lead.routes");
const app = (0, express_1.default)();
const port = Number(process.env.PORT ?? 4000);
const frontendOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL ?? "http://localhost:3000";
app.use((0, cors_1.default)({
    origin: frontendOrigin,
}));
app.use(express_1.default.json());
app.get("/health", (_req, res) => {
    res.json({ ok: true });
});
app.use("/api", lead_routes_1.leadRouter);
app.listen(port, () => {
    console.log(`Backend running on http://localhost:${port}`);
});
