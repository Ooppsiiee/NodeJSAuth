const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    __id: mongoose.Schema.Types.ObjectId,
    email: {type: String, required: true, unique:true},
    username: {type: String, required:true, unique:true},
    name: {type: String, required:true},
    usercreated: {type: Date, default:Date.now(), required:true},
    password: {type:String, required:true}
})


module.exports = mongoose.model("UserData", UserSchema)