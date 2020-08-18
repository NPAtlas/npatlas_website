function columnListRes(property){
	if(property == "show"){
		jQuery("#maximize").hide();
		jQuery("#minimize").show();
		jQuery("#imageDiv").show();
	}		
	else{
		jQuery("#maximize").show();
		jQuery("#minimize").hide();
		jQuery("#imageDiv").hide();
	}
		
}
function compNameFunction(){
	var compoundName = document.getElementById("compoundName").value;
	if (compoundName != "") {
      document.getElementById("npaid").readOnly='readOnly';
    }
	else
		document.getElementById("npaid").removeAttribute('readOnly');
}
function npaIDFunc(){
	var npaid = document.getElementById("npaid").value;
	if (npaid != "") {
      document.getElementById("compoundName").readOnly='readOnly';
    }
	else
		document.getElementById("compoundName").removeAttribute('readOnly');
}

jQuery(window).load(function () {
	compNameFunction();
	npaIDFunc();
});

function process_form(e,npaid){
	
	if(npaid){
		id=compoundIDCheck(npaid);


			if (id >= minmax['id_min'] && id<= minmax['id_max']){
				npaid_search = id;
				isolationFM = [];
				familyMembers = [];
				drawTimelineGraph(id);
				jQuery('#npaid').val(npaid);
				clusterid_query(id,currentVersion, function(clusterid){
					cluster_json_query(clusterid, cbClusterData);
				});
			}			
			else{
			
				jQuery('#error_msg').show();
				document.getElementById("error_msg").display="block";
				document.getElementById("error_msg").innerHTML=
						"<h3> The provided NPA ID has not been found in the Natural Product Atlas Database.</h3>"+
						"<p> Your NPA ID is: NPA"+id.toString()+". The Natural Product Atlas Database contains "+minmax['id_max']+
						" compounds, the last NPA ID is: NPA"+minmax['id_max'].toString()+".</p> ";


			} 
		
	}
	else{
		e.preventDefault();
		var form_data= objectifyForm('formKnownComp');
		if(form_data.npaid){
			jQuery('.explore_results').show();
			var response = compoundIDCheck(form_data.npaid);
			if(response == -1){				
				jQuery('#error_msg').show();
				jQuery('#explore_results').hide();
				jQuery('#clusterDiv').hide();
				document.getElementById("error_msg").innerHTML=
										"<h3> Bad NPA ID provided.</h3>"+
										"<p> Your NPA ID is: "+form_data.npaid.trim()+". NPA ID are formated as follow: NPA123456."+
										" Please enter a properly formated NPA ID or a number between "+minmax["id_min"]+" and "+minmax["id_max"]+
										".</p> ";
			}
			else{
				id = response;				
				if (id >= minmax['id_min'] && id<= minmax['id_max']){
					jQuery('#compNotPresentDiv').hide();
					npaid_search = id;
					isolationFM = [];
					familyMembers = [];
					drawTimelineGraph(id);
					jQuery('#error_msg').hide();
					window.location.hash='#npaid='+id;
					clusterid_query(id,currentVersion, function(clusterid){
						cluster_json_query(clusterid, cbClusterData);
					});
				}					
				else{
					jQuery('#compNotPresentDiv').hide();
					jQuery('#error_msg').show();
					jQuery('#explore_results').hide();
					jQuery('#clusterDiv').hide();
					document.getElementById("error_msg").display="block";
					document.getElementById("error_msg").innerHTML=
							"<h3> The provided NPA ID has not been found in the Natural Product Atlas Database.</h3>"+
							"<p> Your NPA ID is: NPA"+id.toString()+". The Natural Product Atlas Database contains "+minmax['id_max']+
							" compounds, the last NPA ID is: NPA"+minmax['id_max']+".</p> ";

					jQuery('#compound_title').hide();
					jQuery('#compound_info').hide();
					jQuery('#lit_info').hide();
				} 
				
			}

		}
		else if(form_data.compoundName){
			var npaid = CompoundMap[form_data.compoundName];
			if(npaid){
				jQuery('#compNotPresentDiv').hide();
				npaid_search = npaid;
				isolationFM = [];
				familyMembers = [];
				window.location.hash='#npaid='+npaid;
				drawTimelineGraph(npaid);
				jQuery('#error_msg').hide();
				clusterid_query(npaid, function(clusterid){
					cluster_json_query(clusterid, cbClusterData);
				});
		
			}
			else{
				jQuery('#compNotPresentDiv').show();
			}

		}
	}
	
}
function allCompCB(data){
	data.forEach(function(tempComp){
			CompoundMap[tempComp[1]] = tempComp[0];
			compoundIDMap[tempComp[0]] = tempComp[1];
			compoundNames.push(tempComp[1]);
		});
	autoComplete("compoundName", compoundNames);
}
function autoComplete(elementID, data){
	var $ = jQuery;
	var $input = $("#" + elementID);
	$input.typeahead({
		source: data,
		autoSelect: false
	});
}
function resetForm(){
	document.getElementById("formKnownComp").reset();
	jQuery('#explore_results').hide();
	jQuery('#clusterDiv').hide();
	jQuery('#compNotPresentDiv').hide();
	document.getElementById("compoundName").removeAttribute('readOnly');
	document.getElementById("npaid").removeAttribute('readOnly');
	window.location.hash='';
}