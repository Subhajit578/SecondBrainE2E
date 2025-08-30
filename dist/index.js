"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
mongoose_1.default.connect('mongodb+srv://subhajit:October_2004@cluster0.o2qpyhf.mongodb.net/SecondBrainE2E');
const app = (0, express_1.default)();
app.use(express_1.default.json());
const JWT_SECRET = "SecondBrainE2E";
const idealUserModel = zod_1.z.object({
    username: zod_1.z.string().min(3).max(10),
    password: zod_1.z.string().min(8).max(20).regex(/[@&_#]/, "Password Should have one Special Character").regex(/[a-z]/, "Password should have One uppercase Character").regex(/[A-Z]/, "Password should have one lowerCase Character")
});
app.post("/api/v1/signup", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const isIdeal = idealUserModel.safeParse(req.body);
        if (!isIdeal.success) {
            res.status(411).send({ message: "Error in Input" });
        }
        else {
            try {
                const hashedPassword = yield bcrypt_1.default.hash(password, 5);
                yield db_1.UserModel.create({
                    username: username,
                    password: hashedPassword
                });
                res.status(200).send({ message: "User Created" });
            }
            catch (err) {
                res.status(403).send({ message: "User already exists" });
            }
        }
    });
});
app.post("/api/v1/signin", function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const isIdeal = idealUserModel.safeParse(req.body);
        if (!isIdeal.success) {
            res.status(411).send({ message: "Error in Input" });
        }
        const user = yield db_1.UserModel.findOne({ username: username });
        if (!user) {
            res.status(404).send({ message: "User not found" });
        }
        else {
            if (!user || !user.password) {
                return res.status(404).json({ message: "User not found" });
            }
            const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!passwordMatch) {
                res.status(403).send({ message: "Invalid Password" });
            }
            else {
                const token = jsonwebtoken_1.default.sign({ username: user.username }, JWT_SECRET);
                res.status(200).send({ token: token });
            }
        }
    });
});
app.post("/api/v1/content", (req, res) => {
});
app.post("/api/v1/content", (req, res) => {
});
app.delete("/api/v1/content", (req, res) => {
});
app.post("/api/v1/brain/share", (req, res) => {
});
app.get("/api/v1/brain/:shareLink", (req, res) => {
});
app.listen(3000);
