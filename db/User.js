var mongoose = require('mongoose')
var bcrypt = require('bcrypt-nodejs');

var schema = mongoose.Schema;

var userSchema = new schema({
    username:{
        type:String,
        required:true,
    },
    password: {
        type: String,
        required: false,
    },
	email:{
        type:String,
        required:false,
    },
	confrompassword: {
        type: String,
        required: false,
    },
	thumbnail: {
		type:String,
        required:false,
	},
	googleId: {
		type:String,
        required:false,
	}
})

userSchema.methods.hashPassword = function (password) {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (password,hash) {
    return bcrypt.compareSync(password,hash)
}

userSchema.methods.hashPassword = function (confrompassword) {
    return bcrypt.hashSync(confrompassword,bcrypt.genSaltSync(10))
}

userSchema.methods.comparePassword = function (confrompassword,hash) {
    return bcrypt.compareSync(confrompassword,hash)
}

module.exports = mongoose.model('users',userSchema,'users');