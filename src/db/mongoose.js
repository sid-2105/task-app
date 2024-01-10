const mongoose = require('mongoose')
mongoose.set('strictQuery',true)

const connectToDatebase = ()=>{
    mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then((data)=>{
    console.log(`Mongodb connected with server : ${data.connection.host}`);
})
}

module.exports = connectToDatebase


