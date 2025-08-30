import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import {z}  from 'zod'
import bcrypt from 'bcrypt'
import {UserModel,ContentModel} from './db'
import { isLoggedIn } from './middleware'
mongoose.connect('mongodb+srv://subhajit:October_2004@cluster0.o2qpyhf.mongodb.net/SecondBrainE2E')
const app = express()
app.use(express.json())
const JWT_SECRET = "SecondBrainE2E"
const idealUserModel = z.object({
    username: z.string().min(3).max(10),
    password:z.string().min(8).max(20).regex(/[@&_#]/,"Password Should have one Special Character").regex(/[a-z]/,"Password should have One uppercase Character").regex(/[A-Z]/,"Password should have one lowerCase Character")
})
const idealContentModel = z.object({
    type:z.enum(['document','tweet','youtube','link']),
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
        res.status(411).send({message:"Error in Input"})
    }
    const user = await UserModel.findOne({username:username})
    if(!user){
        res.status(404).send({message:"User not found"})
    } else {
        if (!user || !user.password) {
            return res.status(404).json({ message: "User not found" })
          }
        const passwordMatch = await bcrypt.compare(password,user.password)
        if(!passwordMatch){
            res.status(403).send({message:"Invalid Password"})
        } else {
            const token = jwt.sign({username:user.username,id:user._id},JWT_SECRET)
            res.status(200).send({token : token})
        }
    }
}) 
// {
// 	"type": "document" | "tweet" | "youtube" | "link",
// 	"link": "url",
// 	"title": "Title of doc/video",
// 	"tags": ["productivity", "politics", ...]
// }
app.post("/api/v1/content",isLoggedIn, (req,res)=> {
    const decodedToken = jwt.verify(req.body.token,JWT_SECRET) as { id?: string; username: string }
    const userId = decodedToken.id
    const username = decodedToken.username
    const type = req.body.type
    const link = req.body.link
    const title = req.body.title
    const tags = req.body.title
    const isIdeal = idealContentModel.safeParse({type:type,link:link,title:title,tags:tags})
})
app.post("/api/v1/content", (req,res)=> {
    
})
app.delete("/api/v1/content", (req,res)=> {
    
})
app.post("/api/v1/brain/share", (req,res)=> {
    
})
app.get("/api/v1/brain/:shareLink",(req,res)=>{

})
app.listen(3000)