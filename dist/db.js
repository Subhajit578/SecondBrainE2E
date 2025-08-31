"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Schema.Types.ObjectId;
const user = new Schema({
    username: { type: String },
    password: { type: String },
});
const content = new Schema({
    userId: { type: ObjectId, required: true },
    type: { type: String, enum: ['document', 'tweet', 'youtube', 'link'], required: true },
    link: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    tags: { type: [String], default: [] }
});
exports.UserModel = mongoose_1.default.model('User', user);
exports.ContentModel = mongoose_1.default.model('Content', content);
