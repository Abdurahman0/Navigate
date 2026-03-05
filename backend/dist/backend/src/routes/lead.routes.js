"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadRouter = void 0;
const express_1 = require("express");
const lead_controller_1 = require("../controllers/lead.controller");
exports.leadRouter = (0, express_1.Router)();
exports.leadRouter.post("/leads", lead_controller_1.createLead);
