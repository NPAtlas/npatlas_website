var maxIDSmiles = 0; maxIDOrg = 0;
jQuery(document).ready(function handleDocumentReady (e) {
	
	addRowOrg();
	addRowOrg();
	addRowSmiles();
	addRowSmiles();
	jQuery('#btn-submit').on('click', function(event) {
		event.preventDefault();
	});
	jQuery('#message').dialog({
		autoOpen : false,
		modal : true,
		show : {
			effect : "fade",
			duration : 500
		},
		hide : {
			effect : "blind",
			duration : 500
		},
		buttons : {
			OK : function(){
				document.getElementById("depositForm").reset();
				jQuery(this).dialog("close");
			}
		}
	}); 
//	event.preventDefault();
	
});

function submitForm(){
	
	var table = document.getElementById("myTable");
	var maxLoopComp = maxIDSmiles;
	
	if(table.rows.length > maxIDSmiles)
		maxLoopComp = table.rows.length;
	compArray = []; tempCompObj = {};
	for(var counter=0; counter<= (maxLoopComp); counter++){
		compName = ''; compSmiles = '';
		if(document.getElementById('compName' + counter))
			compName = document.getElementById('compName' + counter).value;

		if(document.getElementById('smiles' + counter))
			compSmiles = document.getElementById('smiles' + counter).value;

		if(compName || compSmiles){

			tempCompObj = {"name" : compName, "smiles" : compSmiles};
			compArray.push(tempCompObj);
		}

	}

	var tableOrg = document.getElementById("OrgTable");
	var maxLoopOrg = maxIDOrg;
	
	if(tableOrg.rows.length > maxIDOrg)
		maxLoopOrg = tableOrg.rows.length;
	 tempOrgObj = {}; orgArray = [];
	for(var counter=0; counter<= (maxLoopOrg); counter++){
		genus = ''; species = ''; typeOrg = '';
		if(document.getElementById('genus' + counter))
			genus = document.getElementById('genus' + counter).value;

		if(document.getElementById('species' + counter))
			species = document.getElementById('species' + counter).value;

		if(document.getElementById('orgType' + counter))
			typeOrg = document.getElementById('orgType' + counter).value;

		if(genus || species){

			tempOrgObj = {"type" : typeOrg, "genus" : genus, "species" : species};
			orgArray.push(tempOrgObj);
		}
	}
  var doi=document.getElementById("doi").value;
  var userName=document.getElementById("username").value;
  var userMail=document.getElementById("usermail").value;
/*
  console.log("DOI:",doi);
  console.log("username:",userName);
  console.log("usermail:",userMail);
	console.log("orgArray:",orgArray);
	console.log("compArray:",compArray);	*/
	
	sendMailForDeposit(userName,userMail,doi,orgArray,compArray, cbMail);
	
};
function cbMail(response){
	if(response == "0"){
		jQuery('#message').dialog("open");
		jQuery(".ui-dialog-titlebar-close").remove();
	}
	else{
		// error
	}
}
function resetForm(){
    document.getElementById("depositForm").reset();
}


function addRowSmiles(input) {
	maxIDSmiles++;
    var table = document.getElementById("myTable");
    var row = table.insertRow(table.rows.length);
    row.id = "row" + maxIDSmiles;

	var cell = row.insertCell(0);
	cell.style.border = 0;
	cell.style.width = "30%";
	cell.style.paddingLeft = "0";
	cell.innerHTML = '<div><input type="text" autocomplete=off name="value' + maxIDSmiles + '" style="height:30px; width:100%; margin-bottom: 0px; position: relative;" class="form-control valueClass" id="compName' + maxIDSmiles + '"/></div>';

	var cell = row.insertCell(1);
	cell.style.border = 0;
	cell.style.width = "30%";
	cell.innerHTML = '<div><input type="text" autocomplete=off name="value' + maxIDSmiles + '" style="height:30px; width:100%; margin-bottom: 0px; position: relative;" class="form-control valueClass" id="smiles' + maxIDSmiles + '"/></div>';

	var cell = row.insertCell(2);
	cell.style.border = 0;
	cell.style.width = "10%";
	cell.innerHTML = '<span id="btA'+maxIDSmiles+'"class="icon-plus" style="cursor: pointer; margin-top: 10px; margin-right: 14px;" onclick="addRowSmiles(this)" ></span><span id="btD' + maxIDSmiles + '"class="icon-remove" onclick="remRowSmiles(this)" style="cursor: pointer;" style="margin-top: 10px;">';

}





function addRowOrg(input) {
	maxIDOrg++;
    var table = document.getElementById("OrgTable");
    var row = table.insertRow(table.rows.length);
    row.id = "row" + maxIDOrg;

	var cell = row.insertCell(0);
	cell.style.border = 0;
	cell.style.width = "10%";
	cell.style.paddingLeft = "0";
	cell.innerHTML = '<select id="orgType' + maxIDOrg + '" style="width:100%; background-color:#D9D9D9; height:30px; margin-bottom: 0px;"><option disabled selected value="">Select</option><option value="bacteria">Bacterium</option><option value="fungus">Fungus</option></select>';

	var cell = row.insertCell(1);
	cell.style.border = 0;
	cell.style.width = "40%";
	cell.innerHTML = '<div><input type="text" autocomplete=off name="value' + maxIDOrg + '" style="height:30px; width:100%; margin-bottom: 0px; position: relative;" class="form-control valueClass" id="genus' + maxIDOrg + '"/></div>';

	var cell = row.insertCell(2);
	cell.style.border = 0;
	cell.style.width = "40%";
	cell.innerHTML = '<div><input type="text" autocomplete=off name="value' + maxIDOrg + '" style="height:30px; width:100%; margin-bottom: 0px; position: relative;" class="form-control valueClass" id="species' + maxIDOrg + '"/></div>';

	var cell = row.insertCell(3);
	cell.style.border = 0;
	cell.style.width = "10%";
	cell.innerHTML = '<span id="btA'+maxIDOrg+'"class="icon-plus" style="cursor: pointer; margin-top: 10px; margin-right: 14px;" onclick="addRowOrg(this)" ></span><span id="btD' + maxIDOrg + '"class="icon-remove" onclick="remRowOrg(this)" style="cursor: pointer;" style="margin-top: 10px;">';

}


function remRowSmiles(input) {
    var table = document.getElementById("myTable");
    var i = parseInt(input.id.substring(3, input.id.length));
    var ind = table.rows["row" +i].rowIndex;
    table.deleteRow(ind);


}

function remRowOrg(input) {
    var table = document.getElementById("OrgTable");
    var i = parseInt(input.id.substring(3, input.id.length));
    var ind = table.rows["row" +i].rowIndex;
    table.deleteRow(ind);


}