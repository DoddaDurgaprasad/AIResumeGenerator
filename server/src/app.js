const express=require('express');
const cookieParser=require("cookie-parser");
const cors=require("cors");

const app=express();

app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
//require all the routes here
const router=require("./routes/authRouter")
const interviewRouter=require("./routes/interviewRouter")


//using all the routess
app.use("/api/auth",router)
app.use("/api/interview",interviewRouter)
module.exports=app;