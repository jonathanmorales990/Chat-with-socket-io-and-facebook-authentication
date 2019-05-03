$(document).ready(function(){
		$(document).on({
			    mouseenter: function () {
			       $(this).stop().animate({ backgroundColor: "#216955" }, 300);},
			    mouseleave: function () {
			        $(this).stop().animate({ backgroundColor: "#004a35" }, 300);},
			}, ".botaoEnviaMenssagem");
		});
	   	$(document).on('click', '.iconeFechar',function(){	
			$(this).parent().parent().remove();
			var id = $(this).parent().prev().val();
			
			$('.usuarioNomeMenuLateal').each(function(){
				if($(this).prev().val() === id){
					$(this).addClass('AtivarChat');
				}
			});
		});
