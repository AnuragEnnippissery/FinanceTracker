import bcrypt from "bcrypt"
import UserModel from "../Model/user.model.js"
import jwt from "jsonwebtoken"

export async function Register(req,res){
    try{
        // generate a salt
        const salt = await bcrypt.genSalt(10); // 10 rounds is standard

        // hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new UserModel({
            username:req.body.username,
            password:hashedPassword
        })
        await newUser.save()
        res.status(204).json({"message":"new user created"})
    }
    catch(err){
        res.status(500).json({"message":"user not registered"})
        console.log(err)
    }
}

export async function Login(req,res){
    try{
        let {username,password}=req.body;
        let user=await UserModel.findOne({username})
        if(!user){
            res.json({"message":"not registered"})
        }
        // Compare plain password with hashed password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect password" });
            }
        else{
            //res.status(200).json({"message":"welcome"})
            let accessToken=jwt.sign({ id: user._id, username: user.username },"secretKey",{expiresIn:"100d"});
            res.status(200).json({token:accessToken,"message":"welcome",id:user._id});
        }
    }
    catch(err){
       // res.status(500).json({"message":"invalid user"})
        console.log(err)
    }
}

export function AuthenticateUser(req,res,next){
    const authHeader=req.headers['authorization'];
    const token=authHeader && authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Access token missing" });
    }
    jwt.verify(token,"secretKey",(err,decodeduser)=>{
        if(err){
            return res.status(403).json({"message":"invalid token"})
        }
        req.user=decodeduser;
        //res.json({"message":"token validated"})
        next()
    })
}