import User from "../models/user_model.js"
import bcrypt from 'bcrypt'
import { generateToken } from "../lib/utils.js"
import cloudinary from "../lib/cloudinary.js"


export const signup=async (req,res)=>{
    const {fullName,email,password}=req.body
    try{
        if(!fullName||!email||!password){
            return res.status(400).json({message:"All feilds are required"})
        }
        if(password.length<6){
            return res.status(400).json({message:"Password must be more than 5 characters"})
        }
        const user= await User.findOne({email})
        
        if (user) return res.status(400).json({message:"Email already existed"})


        //  hash password
        const salt= await bcrypt.genSalt(10)
        const hashedPassword= await bcrypt.hash(password,salt)

        //new user
        const newUser= new User({
            fullName,
            email,
          password :hashedPassword
        })

        if(newUser){
            //generate jwt token
            generateToken(newUser._id,res)
            await newUser.save();
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic,
            })

        }else{
            res.status(400).json({message:"invalid User Data"})
        }
    }catch(error){
        console.log(`Error in signup controller ${error.message}`)
        res.status(500).json({message:' Internal server error'})
    }
}

export const login=async (req,res)=>{
    const {email,password}=req.body
    try{
        const user=await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"Invalid credentials"})
        }
        const isPasswordIsCorrect=await bcrypt.compare(password,user.password)
        if(!isPasswordIsCorrect){
            return res.status(400).json({message:"Invalid credentials"})
        }

        generateToken(user._id,res)
        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
        })

    }catch(error){
        console.log(`Error in login controller ${error.message}`)
        res.status(500).json({message:' Internal server error'})
    }
}

export const logout=(req,res)=>{
    const {fullName}=req.body
    try{
        res.cookie('jwt',"",{maxAge:0})
        res.status(200).json({message:`${fullName|| "user"} Logged out sucessfully`})

    }catch(error){
        console.log(`Error in logout controller ${error.message}`)
        res.status(500).json({message:' Internal server error'})
    }
}

export const  updateProfile=async(req,res)=>{
    try{
        const{profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile Pic Is Required"})
        }

        const uploadResponse= await cloudinary.uploader.upload(profilePic)
        const updateUser= await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url},{new:true})

        res.status(200).json(updateUser)
    }catch(error){
        console.log(`Error in update Profile controller ${error.message}`)
        res.status(500).json({message:' Internal server error'})
    }
}

export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user)
    }catch(error){
        console.log(`Error in checkAuth controller ${error.message}`)
        res.status(500).json({message:' Internal server error'})
    }
}