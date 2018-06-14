$(document).ready(function(){

		    $(document).on({

			    mouseenter: function () {
			       $(this).stop().animate({ backgroundColor: "#216955" }, 300);},
			    mouseleave: function () {
			        $(this).stop().animate({ backgroundColor: "#004a35" }, 300);},
			    
			}, ".HoverParaMenu");

		
			$(document).on('click','.Abrir',function(){

				$( this ).removeClass( "HoverParaMenu" );
				$(this).children().addClass('open');
				$(this).removeClass('Abrir');
				$( this ).children().children().css({ "background-color" : "#d5d5d5" });
				var Menu = $(this);

				$(".ContainerMenuLateral").show(10);
				$(".ContainerMenuLateral").animate({width:"300px"}, 150, function(){
						
					$(Menu).addClass('Fechar');

					});


			});
			$(document).on('click','.Fechar',function(){

				var Menu = $(this);
				

				$( this ).children().children().css({ "background-color" : "#f2f2f2" });
				$(this).children().removeClass('open');
				$(this).removeClass('Fechar');
				$(this).addClass('HoverParaMenu');
				$(".ContainerMenuLateral").animate({width:"0px"}, 150, function(){
						
					$(".ContainerMenuLateral").hide(0);
					$(Menu).addClass('Abrir');
					
					});


			});

			$(document).on('click','.DesativarEvenlope',function(){

				$( this ).addClass( "HoverParaMenu" );
				$( this ).removeClass( "DesativarEvenlope" );
				$('.envelope').removeClass( "fa-envelope-open" );
				$('.envelope').addClass('fa-envelope');
				
				$('.dropdown-mensagens ').slideUp(50,function(){

					$('.ContainerMenuMens').addClass('AtivarEvenlope');

				});


			});
			
			$(document).on('click','.dropdown-mensagens',function(){

				return false;
			});

			$(document).on('click','.Mensagens',function(){

				if( $('.ContainerMenuMens').hasClass( "DesativarEvenlope" ) ){
					$('.ContainerMenuMens').css({ "background-color" : "#004a35" });
					$( '.ContainerMenuMens' ).addClass( "HoverParaMenu" );
					$( '.ContainerMenuMens' ).removeClass( "DesativarEvenlope" );
					$('.envelope').removeClass( "fa-envelope-open" );
					$('.envelope').addClass('fa-envelope');
				
					$('.dropdown-mensagens ').slideUp(50,function(){

						$('.ContainerMenuMens').addClass('AtivarEvenlope');

					});

				}

				if( $('.ContainerMenu').hasClass( "Fechar" ) ){

						var Menu = $('.ContainerMenu');
				
						$('.ContainerMenu').css({ "background-color" : "#004a35" });
						$( Menu ).children().children().css({ "background-color" : "#f2f2f2" });
						$( Menu ).children().removeClass('open');
						$( Menu ).removeClass('Fechar');
						$( Menu ).addClass('HoverParaMenu');
						$(".ContainerMenuLateral").animate({width:"0px"}, 150, function(){
								
							$(".ContainerMenuLateral").hide(0);
							$(Menu).addClass('Abrir');
							
							});

				}

			});

			$(document).on('click','.corpo',function(){

				if( $('.ContainerMenuMens').hasClass( "DesativarEvenlope" ) ){
					$('.ContainerMenuMens').css({ "background-color" : "#004a35" });
					$( '.ContainerMenuMens' ).addClass( "HoverParaMenu" );
					$( '.ContainerMenuMens' ).removeClass( "DesativarEvenlope" );
					$('.envelope').removeClass( "fa-envelope-open" );
					$('.envelope').addClass('fa-envelope');
				
					$('.dropdown-mensagens ').slideUp(50,function(){

						$('.ContainerMenuMens').addClass('AtivarEvenlope');

					});

				}

				if( $('.ContainerMenu').hasClass( "Fechar" ) ){

						var Menu = $('.ContainerMenu');
				
						$('.ContainerMenu').css({ "background-color" : "#004a35" });
						$( Menu ).children().children().css({ "background-color" : "#f2f2f2" });
						$( Menu ).children().removeClass('open');
						$( Menu ).removeClass('Fechar');
						$( Menu ).addClass('HoverParaMenu');
						$(".ContainerMenuLateral").animate({width:"0px"}, 150, function(){
								
							$(".ContainerMenuLateral").hide(0);
							$(Menu).addClass('Abrir');
							
							});

				}

			});

		
});