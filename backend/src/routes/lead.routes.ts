import { Router } from "express";
import { createLead } from "../controllers/lead.controller";

export const leadRouter = Router();

leadRouter.post("/leads", createLead);

