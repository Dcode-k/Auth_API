import express from 'express';
import mongoose from 'mongoose';
import path from 'path'


// connection to database
mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend",
}).then(()=>{
    console.log("database connected");
}).catch((e)=>console.log(e));
//creating app from express
const app=express();

const users=[];


//using all middlewares
        //setting up the static files
        app.use(express.static(path.join(path.resolve(),'./public')));
       //use middleware to read form data
       app.use(express.urlencoded({extended:true}))

//setting up the view engine
app.set("view engine","ejs");


//routing
app.get("/",(req,res)=>{
    res.render("index");
})

app.post('/',(req,res)=>{
    console.log(req.body);
    users.push({username:req.body.name,email:req.body.email});
    res.render("success");
})

app.get('/users',(req,res)=>{
    res.json({
        users,
    })
})

app.listen(5000,()=>{
    console.log("server is working");
})