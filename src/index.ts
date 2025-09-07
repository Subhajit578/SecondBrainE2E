import express from 'express'
import mongoose, { isValidObjectId } from 'mongoose'
import jwt from 'jsonwebtoken'
import {z}  from 'zod'
import bcrypt from 'bcrypt'
import {UserModel,ContentModel,LinkModel,TagModel} from './db'
import { isLoggedIn } from './middleware'
import cors from 'cors'
import {random} from './util'
mongoose.connect('mongodb+srv://subhajit:October_2004@cluster0.o2qpyhf.mongodb.net/SecondBrainE2E')
const app = express()
app.use(express.json())
app.use(cors())
app.use(cors())
const JWT_SECRET = "SecondBrainE2E"
const idealUserModel = z.object({
    username: z.string().min(3).max(10),
    password:z.string().min(8).max(20).regex(/[@&_#]/,"Password Should have one Special Character").regex(/[a-z]/,"Password should have One uppercase Character").regex(/[A-Z]/,"Password should have one lowerCase Character")
})
const idealContentModel = z.object({
    type:z.enum(['article','tweet','youtube']),
    link: z.string().url().optional(),
    title: z.string().min(1).max(200),
    tags:z.array(z.string().min(1)).default([])
})
app.post("/api/v1/signup", async function (req,res) {
    const username = req.body.username
    const password = req.body.password
    const isIdeal = idealUserModel.safeParse(req.body)
    if(!isIdeal.success){
        res.status(411).send({message:"Error in Input"})
    } else {
        try{
        const hashedPassword = await bcrypt.hash(password,5)
        await UserModel.create({
            username: username,
            password: hashedPassword
        })
        res.status(200).send({message:"User Created"})
    } catch(err){
        res.status(403).send({message:"User already exists"})
    }
    }
})
app.post("/api/v1/signin", async function(req,res) {
    const username = req.body.username
    const password = req.body.password
    const isIdeal = idealUserModel.safeParse(req.body)
    if(!isIdeal.success){
        return res.status(411).send({message:"Error in Input"})
    }
    const user = await UserModel.findOne({username:username})
    if(!user){
        return res.status(404).send({message:"User not found"})
    } else {
        if (!user || !user.password) {
            return res.status(404).json({ message: "User not found" })
          }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            return res.status(403).send({message:"Invalid Password"})
        } else {
            const token = jwt.sign({username:user.username,id:user._id},JWT_SECRET)
            return res.status(200).send({token : token})
        }
    }
}) 
// {
// 	"type": "document" | "tweet" | "youtube" | "link",
// 	"link": "url",
// 	"title": "Title of doc/video",
// 	"tags": ["productivity", "politics", ...]
// }
app.post("/api/v1/content",isLoggedIn, async (req,res)=> {
    const userId = (req as any).id
    const type = req.body.type
    const link = req.body.link
    const title = req.body.title
    const tags = req.body.tags
    const isIdeal = idealContentModel.safeParse({type:type,link:link,title:title,tags:tags})
    console.log(userId)
    if(!isIdeal.success){
        console.log(isIdeal.error.flatten());           // <-- see the exact reason
  return res.status(422).json({ message: "Invalid input", issues: isIdeal.error.flatten() });
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
            const tagIds: mongoose.Types.ObjectId[] = [];
    if (Array.isArray(tags)) {
      for (const t of tags) {
        const doc = await TagModel.findOneAndUpdate(
          { title: t.trim() },
          { $setOnInsert: { title: t.trim() } },
          { new: true, upsert: true }
        ).lean();
        if (doc?._id) tagIds.push(doc._id);
      }
    }
            await ContentModel.create({
                userId : userId,
                type:type,
                link:link,
                title:title,
                tags:tagIds
            })
            res.status(200).send({message:"Added To Brain"})
        }catch(err) {
            res.status(402).send({error:err})
        }
    }
})
app.get("/api/v1/allContent", isLoggedIn, async (req,res)=> {
    const userId = (req as any).id 
    console.log(userId)
    try{
        const contents = await ContentModel.find({userId}).populate("userId","username")
        res.status(200).send(contents)
    } catch(err){
        res.status(404).send({error:err})
    }
})
app.delete("/api/v1/deleteContent/:id", async (req,res)=> {
    const userId = (req as any ).id
    const id =  String(req.params.id || '').trim()
        try{
            const deleted = await ContentModel.findByIdAndDelete({
                _id: id,userId:userId
            })
            if(!deleted){
                res.status(404).send({message:"Content does not exist"})
            } else {
                res.status(200).send({message:"User Deleted"})
            }
        } catch(err){
            res.status(404).send({error:err})
        }
})
//make it so the link model is unique 
app.post("/api/v1/brain/share", isLoggedIn,async (req,res)=> {
    const share = req.body.share
    if(share){
        await LinkModel.create({
            userId:(req as any).id,
            hash:random(10)
        })
    } else {
        await LinkModel.deleteOne({
            userId:(req as any).id
        })
    }
    res.send({message:"Updated Sharable Link"})
})
app.get("/api/v1/brain/shareLink/:hash",async (req,res)=>{
    const hash = req.params.hash
    try {
    const link = await LinkModel.findOne({
        hash
    })
    if(!link){
        res.status(404).send({message:"Link Not found"})
        
    } else {
    const content = await ContentModel.find({
        userId:link.userId
    })
    const user = await UserModel.findOne({
        userId:link.userId
    })
    res.status(200).send(
        {
            username:user?.username,
            content: content
        }
    )
}
} catch(err){
    res.status(490).send({error:err})
}
})
app.listen(3000)