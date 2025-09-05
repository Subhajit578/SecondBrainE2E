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
const middleware_1 = require("./middleware");
const cors_1 = __importDefault(require("cors"));
const util_1 = require("./util");
mongoose_1.default.connect('mongodb+srv://subhajit:October_2004@cluster0.o2qpyhf.mongodb.net/SecondBrainE2E');
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use((0, cors_1.default)());
const JWT_SECRET = "SecondBrainE2E";
const idealUserModel = zod_1.z.object({
    username: zod_1.z.string().min(3).max(10),
    password: zod_1.z.string().min(8).max(20).regex(/[@&_#]/, "Password Should have one Special Character").regex(/[a-z]/, "Password should have One uppercase Character").regex(/[A-Z]/, "Password should have one lowerCase Character")
});
const idealContentModel = zod_1.z.object({
    type: zod_1.z.enum(['document', 'tweet', 'youtube', 'link']),
    link: zod_1.z.string().url().optional(),
    title: zod_1.z.string().min(1).max(200),
    tags: zod_1.z.array(zod_1.z.string().min(1)).default([])
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
                const token = jsonwebtoken_1.default.sign({ username: user.username, id: user._id }, JWT_SECRET);
                res.status(200).send({ token: token });
            }
        }
    });
});
// {
// 	"type": "document" | "tweet" | "youtube" | "link",
// 	"link": "url",
// 	"title": "Title of doc/video",
// 	"tags": ["productivity", "politics", ...]
// }
app.post("/api/v1/content", middleware_1.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id;
    const type = req.body.type;
    const link = req.body.link;
    const title = req.body.title;
    const tags = req.body.tags;
    const isIdeal = idealContentModel.safeParse({ type: type, link: link, title: title, tags: tags });
    console.log(userId);
    if (!isIdeal.success) {
        res.status(411).send({ message: "Invalid Input Type" });
    }
    else {
        try {
            // const content = new Schema({
            //     userId : {type:ObjectId},
            //     type: {type:String, enum: ['document','tweet','youtube','link'],required:true},
            //     link: {type:String,trim: true},
            //     title: {type:String,required:true,trim :true},
            //     tags: {type:[String],default:[]}
            // })
            yield db_1.ContentModel.create({
                userId: userId,
                type: type,
                link: link,
                title: title,
                tags: tags
            });
            res.status(200).send({ message: "Added To Brain" });
        }
        catch (err) {
            res.status(402).send({ error: err });
        }
    }
}));
app.get("/api/v1/allContent", middleware_1.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id;
    console.log(userId);
    try {
        const contents = yield db_1.ContentModel.find({ userId }).populate("userId", "username");
        res.status(200).send(contents);
    }
    catch (err) {
        res.status(404).send({ error: err });
    }
}));
app.delete("/api/v1/deleteContent/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id;
    const id = String(req.params.id || '').trim();
    try {
        const deleted = yield db_1.ContentModel.findByIdAndDelete({
            _id: id, userId: userId
        });
        if (!deleted) {
            res.status(404).send({ message: "Content does not exist" });
        }
        else {
            res.status(200).send({ message: "User Deleted" });
        }
    }
    catch (err) {
        res.status(404).send({ error: err });
    }
}));
app.post("/api/v1/brain/share", middleware_1.isLoggedIn, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        yield db_1.LinkModel.create({
            userId: req.id,
            hash: (0, util_1.random)(10)
        });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            userId: req.id
        });
    }
    res.send({ message: "Updated Sharable Link" });
}));
app.get("/api/v1/brain/shareLink/:hash", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.hash;
    try {
        const link = yield db_1.LinkModel.findOne({
            hash
        });
        if (!link) {
            res.status(404).send({ message: "Link Not found" });
        }
        else {
            const content = yield db_1.ContentModel.find({
                userId: link.userId
            });
            const user = yield db_1.UserModel.findOne({
                userId: link.userId
            });
            res.status(200).send({
                username: user === null || user === void 0 ? void 0 : user.username,
                content: content
            });
        }
    }
    catch (err) {
        res.status(490).send({ error: err });
    }
}));
app.listen(3000);
