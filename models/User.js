// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');
// define the schema for our user model
var userSchema = mongoose.Schema({

    
    facebook: {
        id: String,
        token: String,
        email: String,
        name : String,
        photo: String
    },

    local: {

    	nome: String,
        sobrenome: String,
        nomecompleto: String,
        email: String,
        password: String,
        photo: String,
    
    },
    socketId: String
    
},{collection: 'ContasUsuarios'});
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
