"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.leadSchema = exports.localeEnum = exports.sourceEnum = exports.examInterestEnum = void 0;
const zod_1 = require("zod");
exports.examInterestEnum = zod_1.z.enum(["IELTS", "SAT", "GMAT", "GeneralEnglish"]);
exports.sourceEnum = zod_1.z.enum(["home", "courses", "results", "teachers", "about", "contact"]);
exports.localeEnum = zod_1.z.enum(["en", "ru", "uz"]);
exports.leadSchema = zod_1.z.object({
    fullName: zod_1.z.string().trim().min(2).max(100),
    phoneNumber: zod_1.z.string().trim().min(7).max(30),
    examInterest: exports.examInterestEnum,
    preferredTime: zod_1.z.string().min(1).nullable().optional(),
    message: zod_1.z.string().trim().max(1000).nullable().optional(),
    currentLevel: zod_1.z.string().min(1).nullable().optional(),
    email: zod_1.z.string().trim().email().nullable().optional(),
    source: exports.sourceEnum,
    locale: exports.localeEnum,
    pagePath: zod_1.z.string().trim().min(1),
});
