import mongoose from 'mongoose'
import { required } from 'zod/v4/core/util.cjs'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const user = new Schema({
    username:{type:String,required:true,unique:true},
    password:{type:String,required:true},
})
const content = new Schema({
    userId : {type:ObjectId,required:true},
    type: {type:String, enum: ['document','tweet','youtube','link','image','video','article','audio'],required:true},
    link: {type:String,trim: true},
    title: {type:String,required:true,trim :true},
    tags:   [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
})
const tags = new Schema({
    title:{type:String,required:true,unique:true}
})
const Link = new Schema({
    hash:{type:String,required:true},
    userId:{type:ObjectId,ref:'User',required:true}
})
export const UserModel = mongoose.model('User', user)
export const ContentModel = mongoose.model('Content', content)
export const TagModel = mongoose.model('Tags',tags)
export const LinkModel = mongoose.model('Link',Link)