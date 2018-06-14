// load the things we need
var mongoose = require('mongoose');

var userSchema = mongoose.Schema({

    
	data: { type: Date, default: Date.now },
	de: String,
	para: String,
	mensagemEnviada: String,
	readed: { type: Boolean, default: false }


},{collection: 'Mensagem'});


// create the model for users and expose it to our app
module.exports = mongoose.model('Mensagem', userSchema);
