import mongoose from 'mongoose'
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const user = new Schema({
    username:{type:String},
    password:{type:String},
})
const content = new Schema({
    userId : {type:ObjectId},
    type: {type:String, enum: ['document','tweet','youtube','link'],required:true},
    link: {type:String,trim: true},
    title: {type:String,required:true,trim :true},
    tags: {type:[String],default:[]}
})
export const UserModel = mongoose.model('User', user)
export const ContentModel = mongoose.model('Content', content)