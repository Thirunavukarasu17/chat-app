import jwt from "jsonwebtoken"

export const generateToken=(userId,res)=>{
    const token=jwt.sign({userId}, process.env.JWT_SECRET,{expiresIn:'2d'})
    // send to cookeeis
    res.cookie('jwt',token,{
        maxAge:2*24*60*60*1000,//ms
        httpOnly:true,/// prevent xss attacksS\
        sameSite:"strict",//CSRF attacks
        secure:process.env.NODE_ENV!=='developement'
    })
    return token;
}