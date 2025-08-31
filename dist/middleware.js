"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoggedIn = isLoggedIn;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "SecondBrainE2E";
function isLoggedIn(req, res, next) {
    const raw = req.headers.token;
    const token = Array.isArray(raw) ? raw[0] : raw;
    if (!token) {
        return res.status(401).json({ message: 'Login to continue' });
    }
    try {
        const decodedToken = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.id = decodedToken.id;
        next();
    }
    catch (err) {
        res.status(401).send({ message: "Login to Continue " });
    }
}
