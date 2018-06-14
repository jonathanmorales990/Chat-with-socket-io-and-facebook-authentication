"use strict";

$(document).ready(function(){

    var idDeEnvio;
	var defaultPhoto = '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
	var socket = io.connect('/');
	var users = new Array();
	var jaExiste = undefined;  
	var jaExisteNotification= undefined;
	var para;
	var ContSend = 0;
	var ContSendArray = new Array();

		$( ".UsuariosID" ).each(function() {

		   var data = new Object();
		   data._id = $( this ).val();
		   users.push(data);
		
		});

		socket.on('error', function(data){

			window.location.replace('/login');
	
		});
		
		socket.on('erroMensagem', function(data){

			console.log(data);
	
		});

		socket.on('confirmaMensagem', function(data){

			var contador = ContSendArray;

			$( ".Mensagens" ).each(function() { 
				
				if($(this).children().val() === data.para){

					var profileImg = $('#profile-img').attr("src");

			 		var element = $(this).find('.MensagemTextoRecebido');

			 		$(element).find('.UsuariosIDMSGSend').each(function(){

			 			for (var i = 0; i < contador.length; i++) {

			 				if(parseInt($(this).val()) === contador[i]){

			 					$(this).parent().parent().remove();
			 				}	


			 			}

			 		});

			   		$(element).append('<div class="me">'+
											'<div class="ContainerMensagemESQ">'+
												'<span class="corpoMensagemESQ"><p class="corTexto">'+data.mensagemEnviada+'</p></span>'+
												'<div class="trianguloESQ"></div>'+
											'</div>'+

											'<div class="ContainerMensagemDIR">'+
												'<img class="usuarioNomeMensagemImageMEESQ" src="'+profileImg +'"/>'+
											'</div>'+

										'</div>');

					
					$(element).animate({ scrollTop: $(element)[0].scrollHeight}, 0);
				}

			});	
	
		});

		socket.on('requestedMensagemErro', function(data){

			$( ".Mensagens" ).each(function() {

			    var ID = $(this).children().val();
			 
			    if(data.id === ID){
			 	
			 		var element = $(this).find('.MensagemTextoRecebido');

			 		$(element).empty();

			 		$(element).append('<div class="corpoMensagemErro"><strong>Erro!</strong> Não foi possível carregar suas mensagens verifique sua conexão!</div>');
			 	}
	
			});

		});
		
		socket.on('novaMensagem', function(data){

			$( ".usuarioNomeMenuLateal" ).each(function() {
						if($(this).hasClass( "AtivarChat" ) && $(this).prev().val() === data.de){
							

							if(userNotification.length !== 0){
							
								jaExisteNotification =  $.map(userNotification, function(array, index) {
							 
									if(array === data.de){

										return true;
							
									}

								}); 

								if(jaExisteNotification[0] !== true){

									userNotification.push(data.de);
									var numeroNotifications = parseInt($('.NumeroMenssagens').text());

									numeroNotifications += 1;

									$('.NumeroMenssagens').empty();
									$('.NumeroMenssagens').append(numeroNotifications);

								}

							}else{

									userNotification.push(data.de);
									var numeroNotifications = parseInt($('.NumeroMenssagens').text());

									numeroNotifications += 1;

									$('.NumeroMenssagens').empty();
									$('.NumeroMenssagens').append(numeroNotifications);

							}


						}
					});


							
								$( ".Mensagens" ).each(function() { 
								
								if($(this).children().val() === data.de){

									
									var imgPara = $(this).children().next().children().next().attr("src");
									
							 		var element = $(this).find('.MensagemTextoRecebido');



							 		$(element).append(
							   						'<div class="you">'+

														'<div class="ContainerMensagemDIR">'+
																'<img class="usuarioNomeMensagemImageMEDIR" src="'+imgPara+'"/>'+
														'</div>'+

														'<div class="ContainerMensagemESQ">'+
															'<div class="trianguloDIR"></div>'+
															'<span class="corpoMensagemDIR"><p class="corTexto">'+data.mensagemEnviada+'</p></span>'+
																
														'</div>	'+

													'</div>');
									
									$(element).animate({ scrollTop: $(element)[0].scrollHeight}, 0);

								}


								});
		});
	
	
	   	socket.on('myId', function(data){

	   		sessionStorage.setItem('idUsuario', data);
 			
   	    });

	   	socket.on('newUser', function (data) {

		   	if(sessionStorage.getItem('idUsuario') !== undefined && sessionStorage.getItem('idUsuario') !== data._id && sessionStorage.getItem('idUsuario') !== null ){	
			   	if (users.length === 0) {
		    		if(data.facebook){
			   			
			   		    $( ".ContainerUsuarios" ).append(
  						'<input type="hidden" name="id" value="'+data._id+'">'+
			   		    '<span class="usuarioNomeMenuLateal AtivarChat">'+
						'<span class="online"></span>'+
						'<img class="usuarioNomeMenuLatealImage" src="'+data.facebook.photo +'" />'+
						'<span class="usuarioNomeMenuLatealNome">'+data.facebook.name+'</span></span>');

			   			users.push(data);

			   		}


			   		if(data.local){
			   			
			   			$( ".ContainerUsuarios" ).append(
			   			'<input type="hidden" name="id" value="'+data._id+'">'+
			   			'<span class="usuarioNomeMenuLateal AtivarChat">'+
						'<span class="online"></span>'+
						'<img class="usuarioNomeMenuLatealImage" src="'+defaultPhoto +'" />'+
						'<span class="usuarioNomeMenuLatealNome">'+data.local.nomecompleto+'</span></span>');

			   			users.push(data);
			   		}
				}else{

					jaExiste =  $.map(users, function(array, index) {
							 
									if(array._id === data._id){

										return true;
							
									}

								}); 

					if(jaExiste[0] !== true){

						if(data.facebook){
				   			
				   			$( ".ContainerUsuarios" ).append(
  							'<input type="hidden" name="id" class="idUser" value="'+data._id+'">'+
				   			'<span class="usuarioNomeMenuLateal AtivarChat">'+
							'<span class="online"></span>'+
							'<img class="usuarioNomeMenuLatealImage" src="'+data.facebook.photo +'" />'+
							'<span class="usuarioNomeMenuLatealNome"> '+data.facebook.name+' </span></span>');

				   			users.push(data);

				   		}


				   		if(data.local){
				   			
				   			$( ".ContainerUsuarios" ).append(
  							'<input type="hidden" name="id" value="'+data._id+'">'+
				   			'<span class="usuarioNomeMenuLateal AtivarChat">'+
							'<span class="online"></span>'+
							'<img class="usuarioNomeMenuLatealImage" src="'+defaultPhoto +'" />'+
							'<span class="usuarioNomeMenuLatealNome"> '+data.local.nomecompleto+' </span></span>');

				   			users.push(data);
				   			
				   		}

					}

				}

			}

		});

	   	$(document).on('click', '.AtivarChat',function(){

	   		
	   		var data = new Object();

	   		data.id = $(this).prev().val();

	   		para = $(this).prev().val();
	   		
	   		var img = $(this).children().next().attr("src");

	   		var nome = $(this).children().next().next().text();
			
			$(this).removeClass('AtivarChat');
				 
			
		
			$('.separadorBarra').after('<div class="Mensagens">'+
												'<input class ="UsuariosIDMSG" type="hidden" name="id" value="'+para+'">'+
												'<div class="TopoMensagem"><span class="onlineMensagens"></span>'+
													'<img class="usuarioNomeTopoImage" src="'+img+'" />'+	
													'<span class="usuarioNomeTopoNome">'+nome+' </span>'+
													'<span class="iconeFechar"><i class="fa fa-close centericon" aria-hidden="true"></i></span>'+
												'</div>'+
												 '<div class="MensagemTextoRecebido">'+
													 '<img class="LoadingIMG" src="./images/Loading_icon.gif">'+
												 '</div>'+	
												 '<div class="MensagemTextoEnvio" >'+
													 '<div class="input-group">'+
													 '<textarea type="text" class="form-control formularioEnvio" rows="2"></textarea>'+
													 '<span class="input-group-addon botaoEnviaMenssagem">'+
													 '<div class ="iconeSendContainer">'+
													 '<i class="fa fa-paper-plane iconeSend" aria-hidden="true"></i>'+
													 '</div>'+
													 '</span>'+
													'</div>'+
												'</div>'+
											'</div>');
							

		
			
	   		

	   		socket.emit('requestMensagem', data);

	   		$('.Mensagens').draggable({ 
   			handle: ".TopoMensagem",
   			containment: 'parent',
   			start: function() {

					$(this).css({transform: "none", top: $(this).offset().top+"px", left:$(this).offset().left+"px"});

			} });



	   	});


		$(document).on('click','.AtivarEvenlope',function(){

				$( '.dropdown-mensagens' ).empty();
				
				$( '.dropdown-mensagens' ).append('<img class="LoadingDropDownIMG" src="./images/loadtrasnparent.gif">');
				
				$( this ).removeClass( "HoverParaMenu" );
				
				$( this ).removeClass( "AtivarEvenlope" );
				
				$( '.envelope' ).removeClass( "fa-envelope" );
				
				$( '.envelope' ).addClass('fa-envelope-open');

				$( '.dropdown-mensagens' ).slideDown(50,function(){

					$( '.ContainerMenuMens' ).addClass( 'DesativarEvenlope' );

				});

				socket.emit('requestNotifications',users);

		});

		$(document).on('click','.mensagens-dropdown-content-to-exapand',function(){

		    
		    var idDe = $(this).children().val();
		    var numeroNotifications = parseInt($('.NumeroMenssagens').text());

		    if(numeroNotifications === 1){

		    	$('.dropdown-mensagens').append('<div class="mensagens-dropdown-content">'+
						'<div class="dropdowncontainerESQDIR">'+
							'<div class="SemMSG">Sem mensagens novas...</div>'+
						'</div>'+
					'</div>');

		    }

		    $(this).remove();

			$('.AtivarChat').each(function(){

				if(idDe === $(this).prev().val()){

					var data = new Object();

			   		data.id = $(this).prev().val();

			   		para = $(this).prev().val();
			   		
			   		var img = $(this).children().next().attr("src");

			   		var nome = $(this).children().next().next().text();
					
					$(this).removeClass('AtivarChat');
						 
					
				
					$('.separadorBarra').after('<div class="Mensagens">'+
														'<input class ="UsuariosIDMSG" type="hidden" name="id" value="'+para+'">'+
														'<div class="TopoMensagem"><span class="onlineMensagens"></span>'+
															'<img class="usuarioNomeTopoImage" src="'+img+'" />'+	
															'<span class="usuarioNomeTopoNome">'+nome+' </span>'+
															'<span class="iconeFechar"><i class="fa fa-close centericon" aria-hidden="true"></i></span>'+
														'</div>'+
														 '<div class="MensagemTextoRecebido">'+
															 '<img class="LoadingIMG" src="./images/Loading_icon.gif">'+
														 '</div>'+	
														 '<div class="MensagemTextoEnvio" >'+
															 '<div class="input-group">'+
															 '<textarea type="text" class="form-control formularioEnvio" rows="2"></textarea>'+
															 '<span class="input-group-addon botaoEnviaMenssagem">'+
															 '<div class ="iconeSendContainer">'+
															 '<i class="fa fa-paper-plane iconeSend" aria-hidden="true"></i>'+
															 '</div>'+
															 '</span>'+
															'</div>'+
														'</div>'+
													'</div>');
									

				
					
			   		

			   		socket.emit('requestMensagem', data);

			   		$('.Mensagens').draggable({ 
		   			handle: ".TopoMensagem",
		   			containment: 'parent',
		   			start: function() {

							$(this).css({transform: "none", top: $(this).offset().top+"px", left:$(this).offset().left+"px"});

					} });


				}

			});

		});



		socket.on('requestedNotifications',function(data){
			
			$( '.dropdown-mensagens' ).empty();

			if(data.length !== 0){
				for (var i = 0; i < data.length; i++) {
					
					$( ".usuarioNomeMenuLateal" ).each(function() {

						if($(this).prev().val() === data[i].de){

							var nombre = $(this).find('.usuarioNomeMenuLatealNome').text();
							var imgUserNotification = $(this).find('.usuarioNomeMenuLatealImage').attr('src');
						
							$('.dropdown-mensagens').append('<div class="mensagens-dropdown-content mensagens-dropdown-content-to-exapand">'+
							'<input class ="UsuariosIDNotification" type="hidden" name="id" value="'+data[i].de+'">'+
							'<div class="dropdowncontainerESQDIR">'+
								'<div class="dropdowncontainerESQ">'+
									'<img class="dropdowncontainerIMG" src="'+imgUserNotification+'" />'+
								'</div>	'+
								'<div class="dropdowncontainerDIR">'+
										'<div class="dropdowncontainerNome">'+nombre+'</div>'+

										'<div class="dropdowncontainerMensagem" >'+data[i].mensagemEnviada+'</div>'+
								'</div>'+
							'</div>'+
						'</div>');


						};


					});

				}
			}else{

				$('.dropdown-mensagens').append('<div class="mensagens-dropdown-content">'+
						'<div class="dropdowncontainerESQDIR">'+
							'<div class="SemMSG">Sem mensagens novas...</div>'+
						'</div>'+
					'</div>');

			}
		});

	   	socket.on('requestedMensagem', function(data){
	   		
     		var profileImg = $('#profile-img').attr("src");

     		var nomeMe = $('.PerfilNomeTexto').text();

     		if(data.removenotification){

     			userNotification = jQuery.grep(userNotification, function(value) {
     				
				  return value != data.id;
				});
				
				var numeroNotifications = parseInt($('.NumeroMenssagens').text());
				
				if( numeroNotifications != 0 ){
					numeroNotifications -= 1;
				}
				
				$('.NumeroMenssagens').empty();
				$('.NumeroMenssagens').append(numeroNotifications);

     		}

	   		$( ".Mensagens" ).each(function() {

			    var ID = $(this).children().val();
			 
			    if(data.id === ID){
			 	
			 		var element = $(this).find('.MensagemTextoRecebido');

			 		$(element).empty();

			 		var imgPara = $(this).children().next().children().next().attr("src");

	   				var nomePara = $(this).children().next().next().text();
	   				if(data.mensagem != undefined){
				   		for (var i = 0; i < data.mensagem.length; i++) {

				   			if(data.mensagem[i].de === sessionStorage.getItem('idUsuario') /*|| data.mensagem[i].para === sessionStorage.getItem('idUsuario')*/){

				   				$(element).append(
											'<div class="me">'+
												'<div class="ContainerMensagemESQ">'+
													'<span class="corpoMensagemESQ"><p class="corTexto">'+data.mensagem[i].mensagemEnviada+'</p></span>'+
													'<div class="trianguloESQ"></div>'+
												'</div>'+

												'<div class="ContainerMensagemDIR">'+
													'<img class="usuarioNomeMensagemImageMEESQ" src="'+profileImg +'"/>'+
												'</div>'+

											'</div>');

				   			}else{

				   				$(element).append(
				   						'<div class="you">'+

											'<div class="ContainerMensagemDIR">'+
													'<img class="usuarioNomeMensagemImageMEDIR" src="'+imgPara+'"/>'+
											'</div>'+

											'<div class="ContainerMensagemESQ">'+
												'<div class="trianguloDIR"></div>'+
												'<span class="corpoMensagemDIR"><p class="corTexto">'+data.mensagem[i].mensagemEnviada+'</p></span>'+
													
											'</div>	'+

										'</div>');

				   			}
				   		}

				   		$(element).animate({ scrollTop: $(element)[0].scrollHeight}, 0);
				 	}
			 	}
			});

	  	});
		

	   	$(document).on('click', '.botaoEnviaMenssagem' , function(){


	   		var mensagemEnviada = $(this).prev().val();

	   		if(!mensagemEnviada == null || !mensagemEnviada == ''){

	   			ContSend += 1;

	   			ContSendArray.push(ContSend);

		   		var mensagem = {'mensagemEnviada' : mensagemEnviada, 'de' : sessionStorage.getItem('idUsuario'), 'para' : para, 'numeroMsg' : ContSend };
	     		
	     		socket.emit('mensagem', mensagem);

	     		var element = $(this).closest('.Mensagens').find('.MensagemTextoRecebido');

	     		var profileImg = $('#profile-img').attr("src");

	     		var nome = $('.PerfilNomeTexto').text();

	     		

	     		$(element).append(
					'<div class="me">'+
						'<div class="ContainerMensagemESQ">'+
							'<input class ="UsuariosIDMSGSend" type="hidden" name="idMSG" value="'+ContSend+'">'+
							'<img class="LoadingIMGMSG" src="./images/ezgif.com-crop.gif">'+
						'</div>'+

						'<div class="ContainerMensagemDIR">'+
							'<img class="usuarioNomeMensagemImageMEESQ" src="'+profileImg +'"/>'+
						'</div>'+

					'</div>');

	     		$(this).prev().val('');
	     		
	     		$(element).animate({ scrollTop: $(element)[0].scrollHeight}, 0);
		   	
	   		}
	   	
	   	});

   		


	});
