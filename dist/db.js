"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LinkModel = exports.TagModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Schema.Types.ObjectId;
const user = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
const content = new Schema({
    userId: { type: ObjectId, required: true },
    type: { type: String, enum: ['document', 'tweet', 'youtube', 'link', 'image', 'video', 'article', 'audio'], required: true },
    link: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
});
const tags = new Schema({
    title: { type: String, required: true, unique: true }
});
const Link = new Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: 'User', required: true }
});
exports.UserModel = mongoose_1.default.model('User', user);
exports.ContentModel = mongoose_1.default.model('Content', content);
exports.TagModel = mongoose_1.default.model('Tags', tags);
exports.LinkModel = mongoose_1.default.model('Link', Link);
