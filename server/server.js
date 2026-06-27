
//fix the dns to google dns servers
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);


require("dotenv").config()
const app=require('./src/app');
const connectToDB=require("./src/configs/database")


connectToDB();

app.listen(3000,()=>{
    console.log("server runnning on port 3000");
})