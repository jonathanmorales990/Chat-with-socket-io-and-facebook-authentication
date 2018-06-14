var User = require('../models/User');
var Mensagem = require('../models/Mensagem');
var striptags = require('striptags');

module.exports = function(io, session) {

var sharedsession = require("express-socket.io-session");

io.use(sharedsession(session));

io.use(function(socket, next) {

  if (socket.handshake.session.passport){ return next(); };
  
  return next(new Error('Authentication error'));

});

io.sockets.on( "connection", function( socket ){

    if(socket.handshake.session.passport){

        if(socket.handshake.session.socketID){
            
            User.findById( socket.handshake.session.passport.user, 'socketId facebook.name facebook.email facebook.photo local.nomecompleto local.nome local.sobrenome local.email local.photo',
                    function(err, model) {

                        if(err){
                         
                            socket.emit("error", 'Authentication error');

                        }
                        if(!model){

                            socket.emit("error", 'Authentication error');
                        }

                        if(model){

                            socket.join( socket.handshake.session.passport.user );
                            socket.broadcast.emit('newUser', model);
                            socket.emit('myId', model._id);

                        }

                    });

                } else {
           

                            User.findByIdAndUpdate(
                            socket.handshake.session.passport.user,
                            { $set: { 'socketId': socket.id} },{safe: true, upsert: true , new:true, 
                            fields:'socketId facebook.name facebook.email facebook.photo local.nomecompleto local.nome local.sobrenome local.email local.photo'},
                            function(err, model) {

                                if(err){
                                 
                                    socket.emit("error", 'Authentication error');

                                }
                                if(!model){

                                    socket.emit("error", 'Authentication error');
                                }

                                if(model){

                                    socket.handshake.session.socketID = socket.id;
                                    socket.handshake.session.save();

                                    socket.join(socket.handshake.session.passport.user);

                                    socket.broadcast.emit('newUser', model);

                                    socket.emit('myId', model._id);
                                }
                                   
                            });
                       
                        } 
                   
    } else { socket.emit("error", 'Authentication error'); }

   socket.on('mensagem', function (data) {

            ////data to string
         
			var newMensagem             = new Mensagem();

            newMensagem.de              = striptags(data.de);
            newMensagem.para            = striptags(data.para);
            newMensagem.mensagemEnviada = striptags(data.mensagemEnviada);

            newMensagem.save(function(err, mensagem) {
                if(err){

                    socket.emit('erroMensagem', mensagem);

                }

                if(mensagem){
                    

                    socket.emit('confirmaMensagem', data);
                    socket.broadcast.to(data.para).emit('novaMensagem', mensagem);

                }

			
        });

    });
   
   socket.on('requestMensagem', function (data) {

            Mensagem.find( { $or: [ { de: socket.handshake.session.passport.user , para:data.id }, 
                                    { de: data.id, para:socket.handshake.session.passport.user  },   
                                    
                                    ]
                             },  function(err, mensagem){
                                
                if (err){
                 
                   socket.emit('requestedMensagemErro', data);
                    
                }

                if(!mensagem.length){

                   socket.emit('requestedMensagem', data);
                   
                }else{
                        data.mensagem = mensagem;

                        if( mensagem[mensagem.length-1].readed === false && mensagem[mensagem.length-1].de !== socket.handshake.session.passport.user ){

                            data.removenotification = true;

                        }

                        Mensagem.update({ de: data.id, para:socket.handshake.session.passport.user },
                            { readed: true } ,{multi: true} ,function(err, mensagem){

                        if(err){

                            socket.emit('requestedMensagemErro', data);

                        }
                        if(mensagem){

                            socket.emit('requestedMensagem', data);

                        }
                        
                        
                        });
                     }          
        
        });

    });

    socket.on('requestNotifications', function(data){
     
        Mensagem.aggregate([
        // Matching pipeline, similar to find
        { 
            "$match": { 
                "para":socket.handshake.session.passport.user,
                "readed": { $ne:true }
            }

        },
        // Sorting pipeline
        { 
            "$sort": { 
                "data": -1 
            } 
        },
        
        {
            "$group": {
                "_id": "$de",
                "mensagemEnviada": {
                    "$first": "$mensagemEnviada" 
                },
                "data": {
                    "$first": "$data" 
                }
            }
        },
        // Project pipeline, similar to select
        {
             "$project": { 
                "_id": 0,
                "de": "$_id",
                "mensagemEnviada": 1,
                "data": 1
            }
        }], function(err, mensagem){
                                    
                    if (err){

                        socket.emit('requestedNotificationsErro', err);
                   
                    }

                    if(mensagem){
                        
                        socket.emit('requestedNotifications', mensagem);
                    }          
                
            });   
    });

    socket.on('disconnect', function () {/*add some logic for disconnected users*/});


});


}