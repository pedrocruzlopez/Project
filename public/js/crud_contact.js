$(document).ready(function () {
    var id_act;

	$('#lista').on('click', ".btn.btn-danger", function(){
		var id_contact = $(this).attr("name");
	
        var $confirm = $("#modalConfirmYesNo");
    	$confirm.modal('show');
    	$("#lblTitleConfirmYesNo").html("Confirmación");
    	$("#lblMsgConfirmYesNo").html("¿Confirma que desea eliminar el contacto?, este proceso es irreversible");
    	$("#btnYesConfirmYesNo").off('click').click(function () {
        	$confirm.modal("hide");
        	$.ajax({
	        	type : "GET", 
	        	url : "delete", 
	        	data : { id : id_contact },
	        	success : function(data){
	        		$('#user'+id_contact).remove();
	        		
	        	},
	        	error : function(data){
	        		console.log("error");
	        	}
        	});
    	});
    	$("#btnNoConfirmYesNo").off('click').click(function () {
        	$confirm.modal("hide");
    	});


    });
    $('#lista').on('click', ".btn.btn-warning", function(){
    	var id_contact = $(this).attr("name");
        id_act = id_contact;

		$.ajax({
			type : "GET",
			url : "getContact",
			data : { id : id_contact },
			success : function(data){
				var obj = jQuery.parseJSON(data);
				$('#txtUpFirstName').val(obj.first_name);
				$('#txtUpLastName').val(obj.last_name);
				$('#txtUpEmail').val(obj.email);
				$('#txtInputPhone1').val(obj.phone);
				$('#txtUpCompany').val(obj.company);
				$('#imgUp').attr('src','images/'+obj.image);
				$('#modal-up-user').modal('toggle'); 

	        }

	    });

	});


    $('#lista').on('click', "#btn-detalle", function(){
    	var id_contact = $(this).attr("name");

    	$.ajax({
			type : "GET",
			url : "getContact",
			data : {id : id_contact},
			
			success : function(data){
				var obj = jQuery.parseJSON(data);
				console.log(obj);
				$('#txtGetFirstName').html(obj.first_name);
				$('#txtGetLastName').html(obj.last_name);
				$('#txtGetEmail').html(obj.email);
				$('#txtGetPhone').html(obj.phone);
				$('#txtGetCompany').html(obj.company);
				$('#txtGetCreated').html(obj.created_at);
				$('#txtGetUpdated').html(obj.updated_at);
				$('#modal-ver-user').modal('toggle');  

			}, 
			error : function(data){
				console.log("error");
			}
		});
    });


     $("#formup").submit(function(e){
     	e.preventDefault();
     	var fd = new FormData();
    	var file_data = $('input[type="file"]')[0].files;
    	for(var i = 0;i<file_data.length;i++){
        	fd.append("image", file_data[i]);
    	}
    	var other_data = $('#formup').serializeArray();
    	$.each(other_data,function(key,input){
    		if(input.name == 'slt'){
    			fd.append(input.name+'-code', $('#sel1').find(":selected").data("code"));
    			fd.append(input.name+'-countryname', $('#sel1').find(":selected").data("countryname"));
    			fd.append(input.name+'-latlng', $('#sel1').find(":selected").data("latlng"));
    		} else {
    			fd.append(input.name,input.value);
    		}
        	
    	});
    	$.ajaxSetup({
    		headers: {
        		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    		}
		});
    	$.ajax({
	       	url: 'guardar',
	       	data: fd,
	       	contentType: false,
	       	processData: false,
	       	type: 'POST',
	       	success: function(datos){
	       		
	       		var data = jQuery.parseJSON(datos);
	           	$('#modal-nuevo-user').modal('toggle');
                $('<tr id="user"'+data.id+' data-name="'+data.first_name+'" class="rows"><td style="padding:15px 0px 15px 0px;"><a href="javascript:void(0)" name="'+data.id+'"" id="btn-detalle"><img src="images/'+data.image+'" class="img-responsive voc_list_preview_img" alt="" title="" ></a></td><td>'+data.first_name+'</td><td>'+data.last_name+'</td><td>'+data.email+'</td><td><a href="javascript:void(0)" class="country" name="'+data.id+' id="country" data-latlng="'+data.latlng+'">'+data.country_name+'</a></td><td><input type=\'button\' class =\'btn btn-warning\' value=\'Actualizar\' id=\'btn-actualizar\' name=\''+data.id+'\'/>   <input type=\'button\' class =\'btn btn-danger\' value=\'Eliminar\' id=\'btn-borrar\' name=\''+data.id+'\'/></td>   <tr>').appendTo('#lista');
                $('#txtInputFirstName').val('');
            	$('#txtInputLastName').val('');
            	$('#txtInputEmail1').val('');
            	$('#txtInputPhone').val('');
            	$('#txtInputCompany').val('');
            	$('#image').val('');
      	
        	} ,
        	error: function(data){
        		$('#div-err').html('Por favor adjunte una imagen!');
        		$('#diverr').show();
	        } 
    	});
 

     });
     $('#formupdate').submit(function(e){

		e.preventDefault();
     	var fd = new FormData();
    	var file_data = $('#imageUp')[0].files;
    	for(var i = 0;i<file_data.length;i++){
        	fd.append("image", file_data[i]);
    	}
    	var other_data = $('#formupdate').serializeArray();
    	$.each(other_data,function(key,input){
        	fd.append(input.name,input.value);
    	});

    	fd.append('id', id_act);

    	$.ajaxSetup({
    		headers: {
        		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    		}
		});

    	$.ajax({
	       	url: 'actualizar',
	       	data: fd,
	       	contentType: false,
	       	processData: false,
	       	type: 'POST',
	       	success: function(datos){
	       		var data = jQuery.parseJSON(datos);
				$('#user'+id_act).replaceWith('<tr id="user'+id_act+'" data-name="'+data.first_name+'" class="rows"><td style="padding:15px 0px 15px 0px;"><a href="javascript:void(0)" name="'+data.id+'"" id="btn-detalle"><img src="images/'+data.image+'" class="img-responsive voc_list_preview_img" alt="" title="" ></a></td><td>'+data.first_name+'</td><td>'+data.last_name+'</td><td>'+data.email+'</td><td><input type=\'button\' class =\'btn btn-warning\' value=\'Actualizar\' id=\'btn-actualizar\' name=\''+id_act+'\'/>   <input type=\'button\' class =\'btn btn-danger\' value=\'Eliminar\' id=\'btn-borrar\' name=\''+id_act+'\'/></td>   <tr>');
                alert("Usuario actualizado!");
                $('#modal-up-user').modal('toggle');
	       		console.log(datos);
      	
        	} ,
        	error: function(data){
        		console.log('Ocurrio un error');
    		}
    	});

     });

    $("#btn-modal-new").click(function(){
    	$('#diverr').hide();
    	
    });

    $("#close-up").click(function(){
    		        $('#txtInputFirstName').val('');
	            	$('#txtInputLastName').val('');
	            	$('#txtInputEmail').val('');
	            	$('#txtInputPhone').val('');
	            	$('#txtInputCompany').val('');
	            	$('#image').val('');
    });
    $("#close-down").click(function(){
    		        $('#txtInputFirstName').val('');
	            	$('#txtInputLastName').val('');
	            	$('#txtInputEmail').val('');
	            	$('#txtInputPhone').val('');
	            	$('#txtInputCompany').val('');
	            	$('#image').val('');
    });
    $("#close-up-update").click(function(){
    		        $('#txtUpFirstName').val('');
	            	$('#txtUpLastName').val('');
	            	$('#txtUpEmail').val('');
	            	$('#txtInputPhone1').val('');
	            	$('#txtUpCompany').val('');
	            	$('#imageUp').val('');
    });
    $("#close-down-update").click(function(){
    		        $('#txtUpFirstName').val('');
	            	$('#txtUpLastName').val('');
	            	$('#txtUpEmail').val('');
	            	$('#txtInputPhone1').val('');
	            	$('#txtUpCompany').val('');
	            	$('#imageUp').val('');
    });
    var delay = (function(){
  		var timer = 0;
  		return function(callback, ms){
    	clearTimeout (timer);
    	timer = setTimeout(callback, ms);
  	};
	})();

    $('#search-box').keyup(function () {
    	var busqueda = $(this).val();
  		delay(function(){
      		
  			$.ajax({
				type : "GET",
				url : "buscar",
				data : { nombre : busqueda },
				dataType : 'json',
	        	success: function(data){
	        		$('#id_tbody').html(data.content);
	        	
	        	} ,
	        	error: function(data){

	        		console.log('error');
	        	} 

  			});

    	}, 1000 );
	});
	$('#btn-buscar').click(function(){
		var busqueda = $('#search-box').val();
		console.log(busqueda);
		$.ajax({
			type : "GET",
			url : "buscar",
			data : { nombre : busqueda },
			dataType : 'json',
	        success: function(data){
	        	$('#id_tbody').html(data.content);
	        
	        } ,
	        error: function(data){
	       		console.log('error');
	       	} 

  		});

	});

	$('#imageUp').change(function(){
		var fd = new FormData();
    	var file_data = $('#imageUp')[0].files;
    	for(var i = 0;i<file_data.length;i++){
        	fd.append("image", file_data[i]);
    	}
    	var other_data = $('#formupload').serializeArray();
    	$.each(other_data,function(key,input){
        	fd.append(input.name,input.value);
    	});
    	$.ajaxSetup({
    		headers: {
        		'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    		}
		});
    	$.ajax({
	       	url: 'subir_temp',
	       	data: fd,
	       	contentType: false,
	       	processData: false,
	       	type: 'POST',
	       	success: function(datos){

	       		$('#imgUp').attr('src','images/tmp/tmp');
        	
        	} ,
        	error: function(data){
        		console.log('Ocurrio un error');	

        	} 
   		});

	});

    var map;
    var lat = 15.5;
    var long = -90.25;
	google.maps.event.addDomListener(window, 'load', initialize);

    function initialize() {
   		var mapCanvas = document.getElementById('map');
   		var mapOptions = {
      		center: new google.maps.LatLng(15.5, -90.25),
      		zoom: 6,
      		mapTypeId: google.maps.MapTypeId.ROADMAP
   		}
   		map = new google.maps.Map(mapCanvas, mapOptions)
	}
	$('#contact').on('shown.bs.modal', function () {
    	google.maps.event.trigger(map, "resize");
    	var panPoint = new google.maps.LatLng(lat, long);
        map.panTo(panPoint)

        var marker = new google.maps.Marker({
    		position: {lat: parseInt(lat), lng: parseInt(long)},
    		map: map,
    		title: 'Hello World!'
  		});
	});
    $('#lista').on('click', ".country", function(){
    	latlng = $(this).data('latlng');
    	var array = latlng.split(",");
    	
        lat = array[0];
        long = array[1];

    	$('#contact').modal('toggle');

    });


});