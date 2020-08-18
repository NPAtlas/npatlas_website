var data = []; var jornalComp = {}; var DoiMap = {}; var DoiMapTimeline = {}; var CompoundMap = {}; var compoundIDMap = {}; var compoundNames = [];
var foundResult = ''; var searchBy = ''; var noOfNameResultFromOrcid = ''; var orcidIDKeyValueMap = {};
var stage= {};
stage['ID'] = 'blank'; stage['Name'] = 'blank';


var currentVersion = '';
getCurrentVersion().then((dbVersion) => {
	currentVersion = dbVersion;
	compoundID_compName_All("#loadingIcon", dbVersion).done(function(data){
		allCompCB(data);
	});
}); 

var items1 = new vis.DataSet(data);
var container1 = document.getElementById('nametimelineFamilyMember');
var timeline1 = new vis.Timeline(container1, items1,{});


var container2 = document.getElementById('IDtimelineFamilyMember');
var timeline2 = new vis.Timeline(container2, items1,{});



// event listener
var authorForm = document.getElementById('authorForm');
if (authorForm.attachEvent) {
  authorForm.attachEvent("submit", process_form);
} else {
  authorForm.addEventListener("submit", process_form);
}

jQuery("#resetButton").on("click", function (e) {
	var search = searchByIDOrName();
	if(search == 'ID'){
		stage['ID'] = 'blank';
		showSearchByOrchid();
		jQuery('#orchid').val('');
		window.location.hash=''; 
	}
	else if(search == 'Name'){
		stage['Name'] = 'blank';
		showSearchByName();
		jQuery('#firstName').val('');
		jQuery('#lastName').val('');
	}
		
});

function process_url_params(){
	var url_params_object=get_url_params();
	if (!jQuery.isEmptyObject(url_params_object)) { //something in the url
		console.log('url_params_object: ',url_params_object);

		//fill form inputs
		document.getElementById('orchid').value=url_params_object['orchid'];	
		jQuery('#searchIDResults').show();
		verifyOrchidID(url_params_object['orchid'],handleDataFromORCID,"#loadingIcon","#IDchart","IDtimelineFamilyMember");
	}
}

function TimelineInfo(npaid,response, doi, timelineID){

	var isolationArr = []; var reassignmentArr = []; var totalSynthesisArr = [];
	for(var i=0; i<response.length; i++){
		if(response[i].reference_type == 'isolation')
			isolationArr.push(response[i].reference_year);
		else if(response[i].reference_type == 'reassignment')
			reassignmentArr.push(response[i].reference_year);
		if(response[i].reference_type == 'synthesis')
			totalSynthesisArr.push(response[i].reference_year);
	}
	var isolation = draw_timeline(npaid,isolationArr,reassignmentArr,totalSynthesisArr,"",false, true);
	return {
		isolationArr : isolation,
		doi : doi
	};
}

function searchByIDOrName(){
	var searchTypeValue = document.querySelector('input[name="searchType"]:checked').value;
	if(searchTypeValue == 'searchByOrchid')
		return "ID";
	else
		return "Name";
}
function process_form(e){
	if (e.preventDefault) e.preventDefault();//safety
  // get form data
	var form_data= objectifyForm('authorForm');
	var searchTypeValue = searchByIDOrName();
	if(searchTypeValue == 'ID'){
		var firstName = ''; var lastName = '';
		var orchid = form_data.orchid;
		window.location.hash='orchid='+orchid;
		searchBy = 'ID';
	}
	else{
		var orchid = '';
		firstName = form_data.firstName; lastName = form_data.lastName; 
		searchBy = 'Name';
	}
	if(orchid != ''){
		// put regex code
		
		jQuery('#searchIDResults').show();
		verifyOrchidID(form_data.orchid,handleDataFromORCID,"#loadingIcon","#IDchart","IDtimelineFamilyMember");
				
	}
	
	else if(firstName != '' || lastName != ''){
		var searchString = '';
		if(firstName != ''){
			var givenName = form_data.firstName;
			var tempString = 'given-names:'+ givenName;
			searchString = escape(tempString);
		}
		if(lastName != ''){
			var familyName = form_data.lastName;
			if(firstName != '')
				var tempString = ' AND family-name:'+ familyName;
			else
				var tempString = 'family-name:'+ familyName;
			searchString = searchString + escape(tempString);
		}
		
		searchOrchidByName(searchString,searchOrchidNameCB,"#loadingIcon");
		
	}
}

function searchOrchidNameCB(response){
	noOfNameResultFromOrcid = response["num-found"];
	if(response["num-found"] > 0){
		jQuery('#searchNameResultsNoOrcid').show();
		if(response["num-found"] > 20)
			jQuery('#searchNameResultsNoOrcid').html('Number of authors found : '+ response["num-found"]+'. Below are first 20 results. Please refine your search. Alternatively, you can go <a target="_blank" href="https://orcid.org/orcid-search/search"> here </a> and fetch ORCID ID and use <strong>Search By ORCID ID</strong> section.');
		else
			jQuery('#searchNameResultsNoOrcid').text("Number of authors found : "+ response["num-found"]);
		
		var orcidIDArr = []; var searchMap = {}; var promiseArr = []; var personMap = {}; var activityMap = {};
		for(var i=0; i< response["result"].length; i++){
			orcidIDArr.push(response["result"][i]["orcid-identifier"]["path"]);
			var personProm = getPersonFromORCIDByID(response["result"][i]["orcid-identifier"]["path"],"#loadingIcon");
			var activitiesProm = getActivitiesFromORCIDByID(response["result"][i]["orcid-identifier"]["path"],"#loadingIcon");
			personProm.done(function(response){
				var orcidID = response["name"]["path"];
				var otherNameArr = response["other-names"]["other-name"]; 
				var otherName = '';
				for(var count=0; count<otherNameArr.length; count++){
					if(otherNameArr[count]["content"])
						otherName = otherName + otherNameArr[count]["content"] + ', ';
				}
				if(otherName)
					otherName = otherName.substring(0,otherName.length -2);
				if(response["name"]["family-name"])
					lastName = response["name"]["family-name"]["value"];
				else
					lastName = '';
				
				if(response["name"]["given-names"])
					firstName = response["name"]["given-names"]["value"];
				else
					firstName = '';
				
				personMap[orcidID] = {"firstName" : firstName, "lastName" : lastName, "otherName" : otherName};
			});
			activitiesProm.done(function(response){
				var tempString = response["path"];
				var orcidID = tempString.substring(1,20);
				var affiliations = '';
				var orgArr = response["educations"]["education-summary"];
				for(var count=0; count<orgArr.length; count++){
					if(orgArr[count]["organization"]["name"])
						affiliations = affiliations + orgArr[count]["organization"]["name"] + ', ';
				}
				var orgArr2 = response["employments"]["employment-summary"];
				for(var count=0; count<orgArr2.length; count++){
					if(orgArr2[count]["organization"]["name"])
						affiliations = affiliations + orgArr2[count]["organization"]["name"] + ', ';
				}
				if(affiliations)
					affiliations = affiliations.substring(0,affiliations.length -2);
				activityMap[orcidID] = {"affiliations" : affiliations};
			});
			promiseArr.push(personProm);
			promiseArr.push(activitiesProm);
		}
		Promise.all(promiseArr).then(function(){
			var orcidMap = {};
			jQuery('#loadingIcon').hide();
			for(var i=0; i<orcidIDArr.length; i++){
				orcidMap[orcidIDArr[i]] = {"firstName" : personMap[orcidIDArr[i]]["firstName"], "lastName" : personMap[orcidIDArr[i]]["lastName"], "otherName" : personMap[orcidIDArr[i]]["otherName"], "affiliations" : activityMap[orcidIDArr[i]]["affiliations"]}; 
			}
			updateTableForName(orcidMap);
			stage['Name'] = "authorsFoundOrcid";
			showSearchByName();
		});
		
	}
	else if(response["num-found"] == 0){
			
		jQuery('#searchNameResultsNoOrcid').text("Number of results found : 0");
		stage['Name'] = "NoAuthorsFoundOrcid";
		showSearchByName();
//		handleError("zeroResult");
//		jQuery('#nameSearchResults').hide();
	}
	
/*	if(response["num-found"] == 1){
		console.log("found orcid id ");
		verifyOrchidID(response["result"][0]["orcid-identifier"]["path"],handleDataFromORCID,loadingIcon);	
	}
	else{
		
	} */
}

function updateTableForName(orcidMap){
	var keys = Object.keys(orcidMap);
	if(keys.length > 0){
		orcidIDKeyValueMap = {};
		for(var i=0; i<keys.length; i++){
			orcidIDKeyValueMap[keys[i]] = i;
		}
		jQuery('#nameSearchResults').show();
		var table_container = '';
		jQuery('#orcidTable').trigger('destroyPager');
		jQuery('#orcidTable').remove();
		jQuery("#orcidTable").trigger("destroy");
		jQuery("#orcidTable").trigger('updateAll');
	
		table_container=document.createElement('table');
		table_container.setAttribute("id","orcidTable");
		
		table_container.setAttribute("class", "tablesorter table-bordered table-striped");
		var header = table_container.createTHead();
		var line=document.createElement("tr");
		
	
		var th=document.createElement("th");th.innerHTML="Select";line.appendChild(th);
		var th=document.createElement("th");th.innerHTML="ORCID iD";line.appendChild(th);				
		var th=document.createElement("th");th.innerHTML="First Name";line.appendChild(th);					
		var th=document.createElement("th");th.innerHTML="Last Name";line.appendChild(th);					
		var th=document.createElement("th");th.innerHTML="Other Names";line.appendChild(th);					
		var th=document.createElement("th");th.innerHTML="Affiliations";line.appendChild(th);
		
		header.appendChild(line);
	
		divContainer = document.getElementById("table-wrapper");
		divContainer.appendChild(table_container);
		var html = '';
		
		for(var i=0; i<keys.length; i++){
			var tempOrcidValue = orcidIDKeyValueMap[keys[i]];
			html += '<tr><td style="width:5%;"><input type="radio" name = "orcidID" onclick="selectOrchidIDFromTable('+tempOrcidValue+')"></td><td style="width : 20%;" title="' +keys[i] + '"><div>'+keys[i]+'</div></td><td style="width : 10%" title = "' + orcidMap[keys[i]]["firstName"]+'"><div >' +orcidMap[keys[i]]["firstName"]+'</div></td><td style="width : 10%" title="' + orcidMap[keys[i]]["lastName"]+ '"><div>'+orcidMap[keys[i]]["lastName"]+'</div></td><td style="width : 10%" title = "' + orcidMap[keys[i]]["otherName"]+'"><div>' +orcidMap[keys[i]]["otherName"]+'</div></td><td style="width : 40%" title="' + orcidMap[keys[i]]["affiliations"]+ '" ><div>'+orcidMap[keys[i]]["affiliations"]+'</div></td></tr>';
		}
		var tbody = table_container.createTBody();
		tbody.innerHTML = html;
		table_container.appendChild(tbody);
		jQuery('#orcidTable').tablesorter({
				
		}).tablesorterPager({    
			container: jQuery(".pager")
		});
		
		jQuery('#table-wrapper').show();
		jQuery('#NameAuthorDetails').hide();
	//	jQuery('#chartNameSearch').hide();
	}
}

function selectOrchidIDFromTable(orcidIDValue){
	var keys = Object.keys(orcidIDKeyValueMap);
	for(var i=0; i<keys.length; i++){
		if(orcidIDKeyValueMap[keys[i]] == orcidIDValue){
			orcidID = keys[i];
			break;
		}
	}
	window.location.hash='orchid='+orcidID;;
	jQuery('#NameAuthorDetails').show();
	verifyOrchidID(orcidID,handleDataFromORCID,"#loadingIcon", "#nameChart","nametimelineFamilyMember");
}

function handleDataFromORCID(response,chartID,timelineID){
	
	if(response == 404){	
	//	console.log("orchid not found");
		stage['ID'] = 'IDNotFound';
		showSearchByOrchid();
	//	handleError("notFound");
	//	foundResult = false;
	}
	else{
		DoiMapTimeline = {}; var jornalComp = {}; var DoiMap = {};		
		if(chartID == '#IDchart'){
			authorNameDiv = 'IDauthorName';
			var TotalResOrcid = 'totalResultsOrcid';
			
		}
			
		else{
			var TotalResOrcid = 'NametotalResultsOrcid';
			authorNameDiv = 'NameauthorName';
		}
			
		var authorName = document.getElementById(authorNameDiv);
		if(response["person"]["name"]["credit-name"])
			authorName.innerHTML = "Author Name : " + response["person"]["name"]["credit-name"]["value"];
		else
			authorName.innerHTML = "Author Name : " + response["person"]["name"]["given-names"]["value"] +" "+ response["person"]["name"]["family-name"]["value"];
		var doiArr = [];
		var tempWorkArray = response["activities-summary"]["works"]["group"];
		for(var i=0; i<tempWorkArray.length; i++){
			var tempextIDArr = tempWorkArray[i]["external-ids"]["external-id"];
			for(var j=0; j<tempextIDArr.length; j++){
				if(tempextIDArr[j]["external-id-type"] == "doi"){
					doiArr.push(tempextIDArr[j]["external-id-value"]);
					break;
				}
			}
		}
	//	console.log(doiArr);
		var totalResultsOrcid = document.getElementById(TotalResOrcid);
		totalResultsOrcid.innerHTML = 'Total results found in ORCID = '+ doiArr.length;
		var search = searchByIDOrName();
		if(search == 'ID' && doiArr.length == 0){
			var totalResultsAtlas = document.getElementById('totalResultsAtlas');
			totalResultsAtlas.innerHTML = 'Total matches found in ATLAS = 0';
			stage['ID'] = '0resOrcid';
			showSearchByOrchid();
		}			
		else if(search == 'Name' && doiArr.length == 0){
			var totalResultsAtlas = document.getElementById('NametotalResultsAtlas');
			totalResultsAtlas.innerHTML = 'Total matches found in ATLAS = 0';
			stage['Name'] = '0resOrcid';
			showSearchByName();
		}
			
		if(doiArr.length > 0){
			var matchAtlasDOIPromise = match_doi_orchid_atlas(doiArr,"#loadingIcon",currentVersion);
			matchAtlasDOIPromise.done(function(response){
				if(response.length > 0){					
					createPieChartDOI(response, chartID);
					createDOIAtlasMap(response,timelineID);
					createTableCompPerDOI(response,timelineID);
				}
				else if(response.length == 0){
					if(search == 'ID'){
						stage['ID'] = '0resAtlas';
						showSearchByOrchid();
						var totalResultsAtlas = document.getElementById('totalResultsAtlas');
						totalResultsAtlas.innerHTML = 'Total matches found in ATLAS = 0';
					}
					else if(search == 'Name'){
						stage['Name'] = '0resAtlas';
						showSearchByName();
						var totalResultsAtlas = document.getElementById('NametotalResultsAtlas');
						totalResultsAtlas.innerHTML = 'Total matches found in ATLAS = 0';
					}						
				}

			});
		//	handleError("found");
		//	foundResult = true;
		}

	}
}

function createTableCompPerDOI(doiArrayAtlas,timelineID){
	doiCompMap = {};
	var compPerDOIProm = compounds_from_doiList(doiArrayAtlas,"#loadingIcon",currentVersion);
	compPerDOIProm.done(function(response){
		for(var i=0; i<doiArrayAtlas.length; i++){
			tempCitation = createCitation(response[doiArrayAtlas[i]]["reference_author_list"],response[doiArrayAtlas[i]]["reference_title"],response[doiArrayAtlas[i]]["journal_title"],response[doiArrayAtlas[i]]["reference_year"],response[doiArrayAtlas[i]]["reference_volume"],response[doiArrayAtlas[i]]["reference_issue"],response[doiArrayAtlas[i]]["reference_pages"]);
			var compArr = handleNpaid(response[doiArrayAtlas[i]]["compound_ids"]); var str = '';
			for(var j=0; j<compArr.length; j++){
				str = str + compArr[j] + ', ';
			}
			if(str)
					str = str.substring(0,str.length -2);
			doiCompMap[doiArrayAtlas[i]] = {"doi" : doiArrayAtlas[i], "citation" : tempCitation,"compounds" : str};
			
		}
	
		var keys = Object.keys(doiCompMap);
		if(keys.length > 0){
			
			var search = NameOrID(timelineID);
			if(search == 'name'){
				tableName = 'NamecompTable';
				divID = 'NameCompTableWrapper';
				pagerID = 'NameCompPager';
			}
			else{
				tableName = 'IDcompTable';
				divID = 'IDCompTableWrapper';
				pagerID = 'IDCompPager';
			}
			jQuery('#'+tableName).trigger('destroyPager');
			jQuery('#'+tableName).remove();
			jQuery("#"+tableName).trigger("destroy");
			jQuery("#"+tableName).trigger('updateAll');
			
			table_container=document.createElement('table');
			table_container.setAttribute("id",tableName);
			
			table_container.setAttribute("class", "tablesorter table-bordered table-striped");
			var header = table_container.createTHead();
			var line=document.createElement("tr");
			
			var th=document.createElement("th");th.innerHTML="DOI";th.style.textAlign = "center";line.appendChild(th);
			var th=document.createElement("th");th.innerHTML="Citation";th.style.textAlign = "center";line.appendChild(th);				
			var th=document.createElement("th");th.innerHTML="Compounds";th.style.textAlign = "center";line.appendChild(th);					
			
			header.appendChild(line);
		
			divContainer = document.getElementById(divID);		
			divContainer.appendChild(table_container);
			var html = '';
			
			for(var i=0; i<keys.length; i++){
				if (doiCompMap[keys[i]]['compounds'] === "") {continue}
			//	html += '<tr><td style="width:20%;"><a target="_blank" href="http://doi.org/'+keys[i]+'">' +keys[i]+ '</td><td style="width : 60%;">'+doiCompMap[keys[i]]["citation"]+'</td><td style="width : 20%">'+doiCompMap[keys[i]]["compounds"]+'</td></tr>';
				html += '<tr><td style="width:20%;"><a style= "word-break: break-all;" target="_blank" href="http://doi.org/'+keys[i]+'">' +keys[i]+ '</td><td style="width : 60%;">'+doiCompMap[keys[i]]["citation"]+'</td><td style="width : 20%">';
				var tempArr = doiCompMap[keys[i]]["compounds"].split(",");
				for(var x=0; x<tempArr.length; x++){
					html += '<a  href="/joomla/index.php/explore/compounds#npaid=' + tempArr[x] +'">'+tempArr[x]+'</a>';
					html += ',';
				}
				html = html.substring(0,html.length -2);
				html +='</td></tr>';
			}
			var tbody = table_container.createTBody();
			tbody.innerHTML = html;
			table_container.appendChild(tbody);
			jQuery('#'+tableName).tablesorter({
					
			}).tablesorterPager({    
				container: jQuery("#"+pagerID)
			});	
			
			var searchBy = searchByIDOrName();
			if(searchBy == 'ID'){
				stage['ID'] = 'resultFound';
				showSearchByOrchid();
			}
			else if(searchBy == 'Name'){
				stage['Name'] = 'resultFound';
				showSearchByName();
			}
		}
	
	});
	
}

function createCitation(author_list,reference_title,journal_title,reference_year,reference_volume,reference_issue,reference_pages){
	
	/*var citation= author_list+' <b>'+
								reference_title+'</b> <i>'+
								journal_title+'</i>, <b>'+
								reference_year+'</b>, <i>'+
								reference_volume+'</i> ('+
								reference_issue+'), '+
								reference_pages+'.'; */	
								
	var citation= author_list+' <b>'+
								reference_title+'</b> <i>'+
								journal_title+'</i>, <b>'+
								reference_year+'</b>, <i>';
	
	if(reference_issue && reference_pages){
		citation += reference_volume+'</i> ('+
								reference_issue+'), '+
								reference_pages+'.';
	}
	else if(reference_pages && !reference_volume && !reference_issue){
		citation += reference_pages+'.';
	}
	else if(reference_pages && reference_volume && !reference_issue){
		citation += reference_volume+'</i>, '+
								reference_pages+'.';
	}
	else if(reference_volume && reference_pages){
		citation += reference_volume+'</i>, '+
								reference_pages+'.';
	}
	else if(reference_issue)
		citation += reference_volume+'</i> ('+
								reference_issue+'). ';
	else if(reference_volume)
		citation += reference_volume+'</i> .';
	
	return citation;								
}

function handleNpaid(npaidArr){
	var arr =[];
	for(var count=0; count<npaidArr.length; count++){
		arr.push('NPA'+ npaidArr[count].toString().padStart(6,"0"));
	}
	return arr;
}
function createPieChartDOI(doiArrayAtlas,chartID){
	var journalArray = []; 
	var journalProm = journal_stats_from_doiList(doiArrayAtlas,"#loadingIcon",currentVersion);
	var pieArray = [];
	journalProm.done(function(response){
		for(var i=0; i<response.length; i++){
			journalArray.push(response[i]["journal_title"]);
			var compArr = response[i]["compound_ids"].split(", ");
			
			jornalComp[response[i]["journal_title"]] = handleNpaid(compArr);
			
			var tempArr = [];
			tempArr.push(response[i]["journal_title"], response[i]["total_article_number"]);
			pieArray.push(tempArr);
		}
		createChart('pie',pieArray, chartID);
		
	});
}
function createDOIAtlasMap(doiArrayAtlas,timelineID){
	if(timelineID == 'IDtimelineFamilyMember')
		totalResultsAtlas = 'totalResultsAtlas';
	else{
	//	jQuery('#chartNameSearch').show();
		totalResultsAtlas = 'NametotalResultsAtlas';
	}
		
	
	var totalResultsAtlas = document.getElementById(totalResultsAtlas);
	totalResultsAtlas.innerHTML = 'Total matches found in ATLAS = '+ doiArrayAtlas.length;
	
	var feedPromises = []; DoiMap = {};
	for(var i=0; i<doiArrayAtlas.length; i++){
		var doiCompProm = compounds_from_doi(doiArrayAtlas[i],"#loadingIcon",currentVersion);
		doiCompProm.done(function(response){
			
			DoiMap[response.doi] = response.data;		// create map with DOIs and compounds present in that DOI
		});
		feedPromises.push(doiCompProm);
	}
	jQuery.when.apply(this, feedPromises).done(function () {
		createTimelineForAllCompounds(DoiMap,timelineID);
	});
}
var totalCompPerAuthorID = []; var totalCompPerAuthorName = [];
function createTimelineForAllCompounds(DoiMap,timelineID){
	var keys = Object.keys(DoiMap); 
	var feedPromises = [];  totalCompPerAuthor = [];
	for(var i=0; i<keys.length; i++){
		var tempCompArr = DoiMap[keys[i]];
		
		var dataArrayPerComp = [];
		
		for(var j=0; j<tempCompArr.length; j++){
			if(tempCompArr[j] != null){
				totalCompPerAuthor.push('NPA'+tempCompArr[j].toString().padStart(6,"0"));
		//		console.log("compound ID " + tempCompArr[j] + " DOI " + keys[i]);
				var tempPromise = reference_timeline_query(tempCompArr[j],"#loadingIcon", keys[i], currentVersion);
				tempPromise.done(function(response){
					var tempArray = [];
					var result = TimelineInfo(response.timeline.npaid,response.timeline.data, response.doi, timelineID);
					isolation = result.isolationArr;
					for(var len=0; len<isolation.length; len++){
						tempArray.push(isolation[len]);						
					}
					if(DoiMapTimeline[result.doi] == undefined)
						DoiMapTimeline[result.doi] = tempArray;
					else
						DoiMapTimeline[result.doi].append(tempArray);

			});
			feedPromises.push(tempPromise);
			}
		}
	}
	var searchBy = NameOrID(timelineID);
	if(searchBy == "name"){
		totalCompPerAuthorName = totalCompPerAuthor;
		contentID = 'Namecontent';
	}		
	else{
		contentID = 'IDcontent';
		totalCompPerAuthorID = totalCompPerAuthor;
	}
		
	createHorScroll(totalCompPerAuthor,contentID);
	Promise.all(feedPromises).then(function(){
		createTimeGraph(DoiMapTimeline,timelineID);
	});
		
	//	createChart('pie','#chart');
}
function NameOrID(timelineID){
	if(timelineID == 'nametimelineFamilyMember')
		return "name";
	else
		return "ID";
}
function createTimeGraph(DoiMapTimeline,timelineID){
	var keysDoiMapTimeline = Object.keys(DoiMapTimeline); var timelineArray = [];
	for(var i=0; i<keysDoiMapTimeline.length; i++){
		timelineArray.append(DoiMapTimeline[keysDoiMapTimeline[i]]);
	}
//	console.log(timelineArray);

	draw("",timelineArray,true,timelineID);
}


function allCompCB(data){
	data.forEach(function(tempComp){
			CompoundMap[tempComp[1]] = tempComp[0];
			compoundIDMap[tempComp[0]] = tempComp[1];
			compoundNames.push(tempComp[1]);
	});
}


function showSearchByName(){
	jQuery("#NameRadioSearch").prop("checked", true);
	if(stage['Name'] == 'blank'){
		jQuery('#searchIDResults').hide();
		jQuery('#nameSearchResults').hide();
		jQuery('#searchNameResultsNoOrcid').hide();			
		jQuery('#notFound').hide();
		jQuery('#IDauthorDetails').hide();		
		jQuery('#searchOrchidDiv').hide();
		jQuery('#nameCompTableDiv').hide();
		jQuery('#chartNameSearch').hide();
		
		jQuery('#searchNameDiv').show();
	}
	else if(stage['Name'] == "NoAuthorsFoundOrcid"){
		jQuery('#searchIDResults').hide();
		jQuery('#nameSearchResults').hide();					
		jQuery('#notFound').hide();
		jQuery('#IDauthorDetails').hide();		
		jQuery('#searchOrchidDiv').hide();
		jQuery('#nameCompTableDiv').hide();
		jQuery('#chartNameSearch').hide();
		
		jQuery('#searchNameResultsNoOrcid').show();
		jQuery('#searchNameDiv').show();
	}
	else if(stage['Name'] == "authorsFoundOrcid"){
		jQuery('#searchIDResults').hide();				
		jQuery('#notFound').hide();
		jQuery('#IDauthorDetails').hide();		
		jQuery('#searchOrchidDiv').hide();
		jQuery('#nameCompTableDiv').hide();
		jQuery('#chartNameSearch').hide();
		
		jQuery('#searchNameResultsNoOrcid').show();	
		jQuery('#nameSearchResults').show();
		jQuery('#searchNameDiv').show();
	}
	else if(stage['Name'] == 'resultFound'){
		jQuery('#searchIDResults').hide();		
		jQuery('#searchNameResultsNoOrcid').hide();			
		jQuery('#notFound').hide();
		jQuery('#IDauthorDetails').hide();		
		jQuery('#searchOrchidDiv').hide();
		
		jQuery('#chartNameSearch').show();
		jQuery('#nameCompTableDiv').show();
		jQuery('#nameSearchResults').show();
		jQuery('#searchNameDiv').show();
	}
	else if(stage['Name']=='0resOrcid'){
		jQuery('#searchIDResults').hide();		
		jQuery('#searchNameResultsNoOrcid').hide();			
		jQuery('#notFound').hide();
		jQuery('#IDauthorDetails').hide();		
		jQuery('#searchOrchidDiv').hide();		
		jQuery('#nameCompTableDiv').hide();
		jQuery('#chartNameSearch').hide();
		
		jQuery('#nameSearchResults').show();
		jQuery('#searchNameDiv').show();
	}

}
function showSearchByOrchid(){
	jQuery("#IDRadioSearch").prop("checked", true);
	if(stage['ID'] == 'blank'){		
		jQuery('#searchIDResults').hide();
		jQuery('#nameSearchResults').hide();
		jQuery('#searchNameResultsNoOrcid').hide();		
		jQuery('#searchNameDiv').hide();
		jQuery('#notFound').hide();
		jQuery('#IDauthorDetails').hide();
		jQuery('#nameCompTableDiv').hide();
		jQuery('#chartNameSearch').hide();		
		
		jQuery('#searchOrchidDiv').show();
		
	}
	else if(stage['ID'] == 'IDNotFound'){
		jQuery('#searchIDResults').hide();
		jQuery('#nameSearchResults').hide();
		jQuery('#searchNameResultsNoOrcid').hide();		
		jQuery('#searchNameDiv').hide();
		jQuery('#IDauthorDetails').hide();
		jQuery('#nameCompTableDiv').hide();
		jQuery('#chartNameSearch').hide();		
		
		jQuery('#notFound').show();		
		jQuery('#searchOrchidDiv').show();
	}
	else if(stage['ID']=='0resOrcid'){
		jQuery('#searchIDResults').hide();
		jQuery('#nameSearchResults').hide();
		jQuery('#searchNameResultsNoOrcid').hide();		
		jQuery('#searchNameDiv').hide();
		jQuery('#notFound').hide();
		jQuery('#nameCompTableDiv').hide();	
		jQuery('#chartNameSearch').hide();
		
		jQuery('#searchOrchidDiv').show();
		jQuery('#IDauthorDetails').show();
		
	}
	else if(stage['ID'] == '0resAtlas'){
		jQuery('#searchIDResults').hide();
		jQuery('#nameSearchResults').hide();
		jQuery('#searchNameResultsNoOrcid').hide();		
		jQuery('#searchNameDiv').hide();
		jQuery('#notFound').hide();
		jQuery('#nameCompTableDiv').hide();	
		jQuery('#chartNameSearch').hide();
		
		jQuery('#searchOrchidDiv').show();
		jQuery('#IDauthorDetails').show();
	}
	else if(stage['ID'] == 'resultFound'){		
		jQuery('#nameSearchResults').hide();
		jQuery('#searchNameResultsNoOrcid').hide();		
		jQuery('#searchNameDiv').hide();
		jQuery('#notFound').hide();
		jQuery('#nameCompTableDiv').hide();	
		jQuery('#chartNameSearch').hide();
		
		jQuery('#searchIDResults').show();
		jQuery('#searchOrchidDiv').show();
		jQuery('#IDauthorDetails').show();
	}
	

}

$(document).ready(function () {
	
	jQuery('#authorForm').on('submit', function(event) {
		event.preventDefault();
	});
	process_url_params();
	showSearchByOrchid();
	jQuery('#orcidTable').tablesorter({
		
	}).tablesorterPager({    
		container: jQuery(".pager")
	});
	
	document.getElementById('IDtimelineFamilyMember').onclick = function (event) {
		var props2 = timeline2.getEventProperties(event)
		if(props2.item){
	//		console.log('item selected is ' + props2.item);
			scrollToSpecificComp(props2.item, "ID");
		}  
	}
	document.getElementById('nametimelineFamilyMember').onclick = function (event) {
		var props1 = timeline1.getEventProperties(event)
		if(props1.item){
	//		console.log('item selected is ' + props1.item);
			scrollToSpecificComp(props1.item, "NAME");
		}  
	}
	
});

function selectTimelineForPie(npaidArr, divID) {
	if(divID == '#nameChart')
		timeline1.setSelection(npaidArr, {focus: true});
	else
		timeline2.setSelection(npaidArr, {focus: true});
};

function createChart(chartType,columnsArray, divID){
	
	var chart = c3.generate({
		data: {
			// iris data from R
		/*	columns: [
				['DOI1', 1],
				['DOI2', 1],
				['DOI3', 1]
			], */
			columns : columnsArray,
			type : chartType,
			onclick: function (d, i) { 
//			draw("",DoiMapTimeline[d.id],true);
			
			
//			console.log("onclick", d, i);
			},
			onmouseover: function (d, i) { 
//			console.log("onmouseover", d, i); 
			selectTimelineForPie(jornalComp[d.id], divID);
			},
			onmouseout: function (d, i) { 
//			console.log("onmouseout", d, i); 
			}
		},
		 bindto: divID
	});
}
function scrollToSpecificComp(npaid, timelineType){
	if(timelineType == "ID"){
		var leftArrowOffset = jQuery('.left').offset().left ;
		var rightArrowOffset = jQuery('.right').offset().left - 150;
		var divNPAIDOffset = jQuery('#ID_'+npaid).offset().left;
		if(divNPAIDOffset > leftArrowOffset && divNPAIDOffset < rightArrowOffset){
				jQuery('#ID_' + npaid).addClass('borderDiv');
			
				setTimeout(function(){
					jQuery('#ID_' + npaid).removeClass('borderDiv');
				},2000);
		}
		else{
			var leftMost = ''; var toBeReplaced = '';
			for(var i=0; i<totalCompPerAuthorID.length; i++){
				 leftMost = jQuery('#ID_'+totalCompPerAuthorID[i]).offset().left;
				 if(leftMost > leftArrowOffset && leftMost < rightArrowOffset){
					toBeReplaced = totalCompPerAuthorID[i];
					break;
				 }				 
			}
			jQuery('#ID_'+toBeReplaced).offset({left:divNPAIDOffset});
			jQuery('#ID_' + npaid).offset({left:leftMost});
			jQuery('#ID_' + npaid).addClass('borderDiv');
			setTimeout(function(){
				jQuery('#ID_' + npaid).removeClass('borderDiv');
			},2000);
		}
	}
	else if(timelineType == "NAME"){
		var nameLeftArrowOffset = jQuery('#nameLeftArrow').offset().left ;
		var nameRightArrowOffset = jQuery('#nameRightArrow').offset().left - 150;
		var nameDivNPAIDOffset = jQuery('#NAME_'+npaid).offset().left;
		if(nameDivNPAIDOffset > nameLeftArrowOffset && nameDivNPAIDOffset < nameRightArrowOffset){
				jQuery('#NAME_' + npaid).addClass('borderDiv');
			
				setTimeout(function(){
					jQuery('#NAME_' + npaid).removeClass('borderDiv');
				},2000);
		}
		else{
			var leftMostName = ''; var toBeReplacedName = '';
			for(var i=0; i<totalCompPerAuthorName.length; i++){
				 leftMostName = jQuery('#NAME_'+totalCompPerAuthorName[i]).offset().left;
				 if(leftMostName > nameLeftArrowOffset && leftMostName < nameRightArrowOffset){
					toBeReplacedName = totalCompPerAuthorName[i];
					break;
				 }				 
			}
			jQuery('#NAME_'+toBeReplacedName).offset({left:nameDivNPAIDOffset});
			jQuery('#NAME_' + npaid).offset({left:leftMostName});
			jQuery('#NAME_' + npaid).addClass('borderDiv');
			setTimeout(function(){
				jQuery('#NAME_' + npaid).removeClass('borderDiv');
			},2000);
		}
			
	}
	
}

function abc(){	
	var tempArr = ["NPA000006","NPA000007","NPA000008","NPA000009","NPA000010","NPA000067","NPA000068","NPA005449","NPA005450","NPA005815","NPA005546","NPA006072","NPA005411","NPA005412"];
	console.log("offset of left arrow "+ jQuery('.left').offset().left);
	console.log("offset of right arrow "+ jQuery('.right').offset().left);

	for(var i=0; i<tempArr.length; i++){
		console.log("offset of "+tempArr[i]+" " + jQuery('#'+tempArr[i]).offset().left);
	}
	var val = jQuery('#NPA000007').offset().left;
	var val2 = jQuery('#NPA006072').offset().left;
	jQuery('#NPA006072').offset({left:val});
	jQuery('#NPA000007').offset({left:val2});
}

