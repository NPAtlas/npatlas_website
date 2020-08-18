function param_error(params){
	jQuery("#no_results").css("display", "block");
	jQuery("#total").css("display", "none");
	jQuery("#pagination_above").css("display", "none");
	jQuery("#pagination_above_count").css("display", "none");
	jQuery("#results").css("display", "none");
	jQuery("#pagination_under_count").css("display", "none");
	jQuery("#pagination_under").css("display", "none");

	if(!jQuery.isEmptyObject(params))
	{
		console.log(params.error);
		if(params.error=="molecularweight_no_operation"){
			console.log("molecularweight_no_operation");
			document.getElementById('no_results').innerHTML="No comparison operator selected for accurate mass. Please select =, > or <.";
			document.getElementById('no_results').style.display="block";
		}
		else if (params.error=="molecularweight_no_precision"){
			console.log("molecularweight_no_precision");
			document.getElementById('no_results').innerHTML="No range provided for accurate mass. Please enter one.";
			document.getElementById('no_results').style.display="block";
		}
	}
	else
	{
		document.getElementById('no_results').innerHTML="Please provide something to search.";
		document.getElementById('no_results').style.display="block";
	}

}


function downloadCSV(npaid, inchiKey,origin,genus,compNames,compMolWt,compMolFormula,compInchi,clusterID,accMass,molWt,cd_id,smiles){
	var compData = [
        {
            "NPA ID": npaid,
            "CLUSTER ID": clusterID,
            "NAME(S)": compNames,
			"FORMULA": compMolFormula,
			"MOLECULAR WEIGHT": compMolWt,
			"ACCURATE MASS": accMass,
			"GENUS": genus,
			"ORIGIN TYPE": origin,
			"INCHIKEY": inchiKey,
			"INCHI": compInchi
		//	"SMILES": smiles,
		}
    ];

	downloadCSVBrowser({data: compData,
	npaid :npaid });
}

function downloadMol(compINCHI,npaID){
	getMol(compINCHI,npaID, cbMolBasicSearch);
}

function cbMolBasicSearch(npaID,response){
//	console.log(response);
	var filename = npaID+".mol";
	var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(response));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function downloadStructurePNG(npaid,imageData){

	var filename = npaid+".png";
	var element = document.createElement('a');
    element.setAttribute('href', imageData);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);


}

function ExportAll(){
	getResult(
		globalSmiles,
		basicSearchCurrentPageNo,
		1,
		100000000,
		"pagination_above",
		"pagination_under",
		ExportAllCB,
		true,
		true,
		"",
		"#loadingIcon",
		userSelectedVersion_global
	);
}

function ExportAllCB(response){
	var dataArray = response.data;

	var compData = [];
	for(var i=0; i<dataArray.length; i++){
		var npa_id = 'NPA'+ dataArray[i].compound_id.toString().padStart(6,"0");
		var tempCompData =
        {
            "NPA ID": npa_id,
            "CLUSTER ID": dataArray[i].compound_cluster_id,
            "NAME(S)": dataArray[i].compound_names,
			"FORMULA": dataArray[i].compound_molecular_formula,
			"MOLECULAR WEIGHT": dataArray[i].compound_molecular_weight,
			"ACCURATE MASS": dataArray[i].compound_accurate_mass,
			"GENUS": dataArray[i].genus,
			"ORIGIN TYPE": dataArray[i].origin_type,
			"INCHIKEY": dataArray[i].compound_inchikey,
			"INCHI": dataArray[i].compound_inchi
		//	"SMILES": smiles,
		}
		compData.push(tempCompData);


	}

	downloadCSVBrowser({data: compData});
}
