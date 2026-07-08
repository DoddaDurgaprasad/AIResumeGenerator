
//fix the dns to google dns servers
const dns = require("node:dns");

if (!process.env.RENDER) {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
}

require("dotenv").config()
const app=require('./src/app');
const connectToDB=require("./src/configs/database")


connectToDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});