const mongoose = require("mongoose");
require("dotenv").config();

// exports.connect = () => {
    mongoose.connect(process.env.MONGOURL || "mongodb+srv://Yash_Gohel:Nita4121978@cluster0.somzke1.mongodb.net/",{
        
    })
    .then(()=>{
        console.log("DB Connection Successful");
    })
    .catch((e)=>{
        console.log("DB Connection Failed");
        console.error(e);
        process.exit(1);
    })
// }