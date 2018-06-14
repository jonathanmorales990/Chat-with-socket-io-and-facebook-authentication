var express = require('express');
var router = express.Router();
var passport = require('passport');

var User = require('../models/User');
var Mensagem = require('../models/Mensagem');

router.get('/', isLoggedIn , function(req, res, next) {

	User.find( { _id:{ $ne:req.user._id } }, function (err, model) {
		
		if(err){
			
     		 return res.redirect(303,"/login");
		
		}

		if(!model){

			 return res.render('profile.ejs', {user : req.user});
			 
		}
 
		if(model){

			  var userId = req.user._id.toString();
			  Mensagem.aggregate([
			        // Matching pipeline, similar to find
			        { 
			            "$match": { 
			                "para": userId,
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

			                        
     								 return res.redirect(303,"/login");
			                   
			                    }

			                    if(mensagem){
			                        
			                        return res.render('profile.ejs', {user : req.user, allUsers : model, notification: mensagem});

			                    }          
			                
			            });   
			
			
		}
		

	
	});  
}); 

function isLoggedIn(req, res, next) {
	 if(req.isAuthenticated()){
      //if user is looged in, req.isAuthenticated() will return true 
      return next();
      
    }else{

      return res.redirect(303,"/login");
    
    }
}

module.exports = router;
