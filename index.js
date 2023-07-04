import express from 'express';
import mongoose from 'mongoose';
import path from 'path'
import cookieParser from 'cookie-parser';
import jwt  from 'jsonwebtoken';
import bcrypt from 'bcrypt'


// connection to database
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend",
}).then(()=>{
    console.log("database connected");
}).catch((e)=>console.log(e));
//creating app from express
const app=express();


const userSchema=new mongoose.Schema({
    name: String,
    email: String,
    password:String,
})

const User=mongoose.model("User",userSchema);
const users=[];


//using all middlewares
        //setting up the static files
        app.use(express.static(path.join(path.resolve(),'./public')));
       //use middleware to read form data
       app.use(express.urlencoded({extended:true}))
       // use middleware fro cookie-parser
       app.use(cookieParser());
    // Authenticated middle ware
       const isAuthenticated=async(req,res,next)=>{
        const {token}=req.cookies;
        if(token){
          const decoded=jwt.verify(token,"jwhdheidowndowo");
          req.user=await User.findById(decoded._id);
            next();
          
        }
        else res.redirect("login");
       }

//setting up the view engine
app.set("view engine","ejs");


//routing
app.get("/",isAuthenticated,(req,res)=>{//this is also known as protected routes
    res.render('logout',{name:req.user.name});
    })

app.get("/login",(req,res)=>{
    res.render('login');
})

app.get('/logout',(req,res)=>{
     res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now())
     })
     res.redirect('/');
})
app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/login',async(req,res)=>{
    const {email,password}=req.body;
let user=await User.findOne({email});
if(!user){
    return res.redirect('/register');
}
const isMatch=await bcrypt.compare(password,user.password);
if(!isMatch) return res.render("login",{email,message:"Incorrect PassWord"});
const token=jwt.sign({_id:user._id},"jwhdheidowndowo");
res.cookie("token",token,{
    httpOnly:true,
    expires:new Date(Date.now()+60*1000)
});
res.redirect('/')
})

app.post('/register',async (req,res)=>{
    const {name,email,password}=req.body;
    let user=await User.findOne({email});
    if(user){
      return res.redirect('/login');
    }
    const hashedPassword=bcrypt.hash(password,10);
  user= await User.create({
        name,
        email,
        password:hashedPassword,
    })
    const token=jwt.sign({_id:user._id},"jwhdheidowndowo");
    res.cookie("token",token,{
        httpOnly:true,
        expires:new Date(Date.now()+60*1000)
    });
    res.redirect('/')
})


app.listen(5000,()=>{
    console.log("server is working");
})