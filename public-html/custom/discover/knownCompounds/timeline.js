var CompoundMap = {}; var compoundIDMap = {}; var compoundNames = []; var FMIsolationArr = []; var FMReassignmentArr = []; var FMTotalSynthesisArr = []; 

var items = new vis.DataSet();

var data = [];

var items1 = new vis.DataSet(data);
var groups = new vis.DataSet([
    {id: 0, content: 'group', value: 'group'}
]);
var data = {
       groups: groups,
       items: items
};

var container = document.getElementById('timeline');
var timeline = new vis.Timeline(container, items, groups, {});

var container1 = document.getElementById('timelineFamilyMember');
var timeline1 = new vis.Timeline(container1, items1,{});

var minmax = {}; var currentVersion = '';
getCurrentVersion().then((dbVersion) => {
	currentVersion = dbVersion;
	compoundID_compName_All("#loadingIcon", dbVersion).done(function(data){
		allCompCB(data);
		jQuery("#imageDiv").hide();
		jQuery('#familyMemberContainer').hide();
		
		var url_params_object=get_url_params();
		if (!jQuery.isEmptyObject(url_params_object)){
			var tempNpaID = Object.keys(url_params_object);
				if(tempNpaID[0].toLowerCase() == "npaid"){
					var npaID=url_params_object[tempNpaID[0]];
					process_form("",npaID);
				}
		}
	});
	minmax_query("#loadingIcon", dbVersion).then((response) => {
		minmax= response;		
	});
}); 

jQuery(document).ready(function handleDocumentReady (e) {
	
	jQuery(document).keyup(function(e) {
		 if (e.keyCode == 27) { // escape key maps to keycode `27`
			jQuery("#imageDiv").hide();
		}
	});
	
	document.getElementById('timelineFamilyMember').onclick = function (event) {
		var props2 = timeline1.getEventProperties(event)
		if(props2.item)	
			scrollToSpecificComp(props2.item);
	}

	var knownCompform = document.getElementById('formKnownComp');
	if (knownCompform.attachEvent)
		knownCompform.attachEvent("submit", process_form);
	else 
		knownCompform.addEventListener("submit", process_form);

});



var npaid_search = '';

var familyMembers = [];
function cbClusterData(response){
	familyMembers = [];
	for(var i=0; i<response.nodes.length; i++){
		familyMembers.push(response.nodes[i].title);
	}
	createHorScroll(familyMembers,"content");
	if(familyMembers.length > 0){
		for(var i=0; i<familyMembers.length; i++){
			var npaid = compoundIDCheck(familyMembers[i]);
			drawTimelineGraph(npaid,true);			
		}
		
	}
	
}

var isolationFM = [];

function viewImage(){
	jQuery("#imageDiv").show();	
	var label=document.getElementById("compID");
	label.innerHTML = 'NPA'+npaid_search.toString().padStart(6,"0");
	var img=document.getElementById("compImage");
	getCompoundImagePath().then((path) => {
		img.setAttribute('src',path + 'NPA'+npaid_search.toString().padStart(6,"0")+'_hw500.png');
	});
	var label1=document.getElementById("compName");
	label1.innerHTML = compoundIDMap[npaid_search];
}

function closeImg(){
	jQuery("#imageDiv").hide();
}

function scrollToSpecificComp(npaid){
		var leftArrowOffset = jQuery('.left').offset().left ;
		var rightArrowOffset = jQuery('.right').offset().left - 150;
		var divNPAIDOffset = jQuery('#'+npaid).offset().left;
		if(divNPAIDOffset > leftArrowOffset && divNPAIDOffset < rightArrowOffset){
				jQuery('#' + npaid).addClass('borderDiv');
			
				setTimeout(function(){
					jQuery('#' + npaid).removeClass('borderDiv');
				},2000);
		}
		else{
			var leftMost = ''; var toBeReplaced = '';
			for(var i=0; i<familyMembers.length; i++){
				 leftMost = jQuery('#'+familyMembers[i]).offset().left;
				 if(leftMost > leftArrowOffset && leftMost < rightArrowOffset){
					toBeReplaced = familyMembers[i];
					break;
				 }				 
			}
			jQuery('#'+toBeReplaced).offset({left:divNPAIDOffset});
			jQuery('#' + npaid).offset({left:leftMost});
			jQuery('#' + npaid).addClass('borderDiv');
			setTimeout(function(){
				jQuery('#' + npaid).removeClass('borderDiv');
			},2000);
		}	
}