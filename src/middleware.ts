import {Request,Response,NextFunction} from 'express'
import jwt from 'jsonwebtoken'
const JWT_SECRET = "SecondBrainE2E"

export function isLoggedIn(req:Request,res:Response,next:NextFunction){
    const raw = req.headers.token
    const token = Array.isArray(raw) ? raw[0] : raw
    if(!token){
        return res.status(401).json({ message: 'Login to continue' })
    }
    try {
        const decodedToken = jwt.verify(token,JWT_SECRET) as any
        (req as any).id = decodedToken.id
        next()
    }catch (err){
        res.status(401).send({message:"Login to Continue "})
    }
}