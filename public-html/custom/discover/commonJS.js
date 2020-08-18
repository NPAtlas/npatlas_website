function createHorScroll(familyMembers, contentID){
	parentDiv = document.getElementById(contentID);
	parentDiv.innerHTML = ''; 
	console.log(familyMembers);
	getCompoundImagePath().then((path) => {
		for(var i=0; i<familyMembers.length; i++){
			var tempDiv = document.createElement('div');
			tempDiv.setAttribute('class','internal');
			if(contentID == 'IDcontent')
				tempDiv.setAttribute('id','ID_'+familyMembers[i]);
			else if(contentID == 'Namecontent')
				tempDiv.setAttribute('id','NAME_'+familyMembers[i]);
			else
				tempDiv.setAttribute('id',familyMembers[i]);
			var a = document.createElement('a');
			a.setAttribute('href','/joomla/index.php/explore/compounds#npaid=' + familyMembers[i]);
		//	a.setAttribute('target', '_blank');
			a.style.display = 'block';
			a.innerHTML = familyMembers[i];
			tempDiv.appendChild(a);

			var img = document.createElement('img');
			
			img.setAttribute('src',path +familyMembers[i]+'_hw300.png');
			img.setAttribute('alt',familyMembers[i]);
			
			if(contentID == 'IDcontent' || contentID == 'Namecontent')	
				img.setAttribute('onclick',"selectTimeline(this,contentID)");
			else
				img.setAttribute('onclick',"selectTimeline(this)");
		//	imgDiv.appendChild(img);
			img.style.maxHeight = '75%';
			img.style.maxWidth = '92%';
		//	img.style.width = '100%';		
			tempDiv.appendChild(img);
			var label1 = document.createElement('label');		
			
		//	label1.setAttribute = ('title',compoundIDMap[compoundIDCheck(familyMembers[i])]);
		//	console.log("compoundIDMap ", compoundIDMap );
			label1.title = compoundIDMap[compoundIDCheck(familyMembers[i])];
			label1.innerHTML = compoundIDMap[compoundIDCheck(familyMembers[i])];
			label1.style.overflow = 'hidden';
			label1.style.width = '90%'
			

			tempDiv.appendChild(label1);
			parentDiv.appendChild(tempDiv);
		}
	});
}

function drawTimelineGraph(id, isFamilyMember, forAuthor){
	var timelinePromise = reference_timeline_query(id,"#loadingIcon","",currentVersion);
	
	timelinePromise.done(function(data){
		cbTimelineInfo(data.timeline.data);
	});
	
	function cbTimelineInfo(response){
		var isolationArr = []; var reassignmentArr = []; var totalSynthesisArr = [];
		for(var i=0; i<response.length; i++){
			if(response[i].reference_type == 'isolation')
				isolationArr.push(response[i].reference_year);
			else if(response[i].reference_type == 'reassignment')
				reassignmentArr.push(response[i].reference_year);
			if(response[i].reference_type == 'synthesis')
				totalSynthesisArr.push(response[i].reference_year);
		}
		if(isFamilyMember == true){
				jQuery('#clusterDiv').show();
				var container = document.getElementById('timelineFamilyMember');
				draw_timeline(id,isolationArr,reassignmentArr,totalSynthesisArr,container,true ); 
		}			
		else{
			var container = document.getElementById('timeline');
			draw_timeline(id,isolationArr,reassignmentArr,totalSynthesisArr,container,false, forAuthor);
		}
	}		
	
}

function draw_timeline(npaid,isolationArr,reassignmentArr,totalSynthesisArr,container,isFamilyMember, forAuthor){	
	
	var isolation = []; var reassignment = []; var totalSynthesis = []; var obj = {}; var counter = 0;

	
	if(isolationArr.length > 0){
		for(var i=0; i<isolationArr.length; i++){
			obj = {};			obj.id = 'NPA'+npaid.toString().padStart(6,"0");			obj.content = 'NPA'+npaid.toString().padStart(6,"0");
			obj.group = 'isolation';			obj.start = new Date(isolationArr[i],0);	obj.className = 'green';
			if(isFamilyMember == true)
				isolationFM.push(obj);
			else
				isolation.push(obj);
		}
	}
	if(reassignmentArr.length > 0){
		for(var i=0; i<reassignmentArr.length; i++){
			obj = {};			obj.id = 'NPA'+npaid.toString().padStart(6,"0") + '_reass' + i;	
			obj.content = 'NPA'+npaid.toString().padStart(6,"0") + ' - ' + (i+1);
			obj.group = 'reassignment';			obj.start = new Date(reassignmentArr[i],0);		obj.className = 'blue';	
			if(isFamilyMember == true)
				isolationFM.push(obj);
			else
				isolation.push(obj);
		}
	}
	if(totalSynthesisArr.length > 0){
		for(var i=0; i<totalSynthesisArr.length; i++){
			obj = {};			obj.id = 'NPA'+npaid.toString().padStart(6,"0") + '_totalSyn' + i;	
			obj.content = 'NPA'+npaid.toString().padStart(6,"0") + ' - ' + (i+1);			obj.group = 'totalSynthesis';
			obj.start = new Date(totalSynthesisArr[i],0); obj.className = 'orange';
			if(isFamilyMember == true)
				isolationFM.push(obj);
			else
				isolation.push(obj);
		}
	}
	if(isFamilyMember == true){
		if(familyMembers.length == isolationFM.length)
			draw("",isolationFM,true);
	}
	else if(forAuthor == true){
		return isolation;
	}
	else
		draw(npaid,isolation,isFamilyMember);
}

function draw(npaid,isolation,isFamilyMember,timelineID){	
	console.log(isolation);
	var groups = new vis.DataSet([
		{id: 'isolation',content: 'Isolation' },
		{id: 'reassignment', content: 'Reassignment' },
		{id: 'totalSynthesis', content: 'Total Synthesis' }
    ]);	
	if(isolation.length > 0 && isFamilyMember == false){
		jQuery('#explore_results').show();
		jQuery('#timelineFamilyMember').show();
		jQuery('#familyMemberContainer').show();
		
		var a = document.createElement('a');
		var divCompoundProp = document.getElementById('compoundProp');
		divCompoundProp.innerHTML = '';
		a.setAttribute('href','/joomla/index.php/explore/compounds#npaid='+npaid);
		a.innerHTML = 'Compound Properties';
		divCompoundProp.appendChild(a);
		
		
	}

	var options = {
		clickToUse: true,       // true or false
		orientation: 'top'
	};
		
	
	 if(isFamilyMember == true){
		var tempDate = isolation[0]["start"]; var found = true;
		for(var i=1; i<isolation.length; i++){
			if(tempDate.getTime() != isolation[i]["start"].getTime()){
				found = false;
				break;
			}				
		}
		if(found == true){
			isolation[0]["start"].setDate(isolation[0]["start"].getDate() + 32);
		}
		if(timelineID){
			if(timelineID == 'IDtimelineFamilyMember'){
				timeline2.destroy();
				var items = new vis.DataSet(isolation);
				container = document.getElementById(timelineID);
				timeline2 = new vis.Timeline(container, items, groups, options);
			//	timeline2.on('select', selectItem);
			/*	timeline2.on('select', function (properties) {
					alert('selected items: ' + properties.items);
				}); */
			}				
		else{
			timeline1.destroy();
			var items = new vis.DataSet(isolation);
			container = document.getElementById(timelineID);
			timeline1 = new vis.Timeline(container, items, groups, options);
		}
		
		 }
		 else{
			timeline1.destroy();
			var items = new vis.DataSet(isolation);
			container = document.getElementById('timelineFamilyMember');
			timeline1 = new vis.Timeline(container, items, groups, options);
		 }

	 }		 
	 else{
		 timeline.destroy();
		 var items = new vis.DataSet(isolation);
		 container = document.getElementById('timeline');
		 timeline = new vis.Timeline(container, items, groups, options);
	 }	 
}

function selectTimeline(value, contentID) {
    if(contentID == 'IDcontent')
		timeline2.setSelection(value.alt, {focus: true});
	else
		timeline1.setSelection(value.alt, {focus: true});
};
if($('#IDright-button')){
	$('#IDright-button').click(function() {
		if(jQuery(window).width() < 400){
			jQuery('#IDcontent').animate({
				scrollLeft: "+=250px"
			}, 'smooth');
		}
		else{
			jQuery('#IDcontent').animate({
			scrollLeft: "+=400px"
		  }, 'smooth');
		}      
	});
}

if($('#Nameright-button')){
	$('#Nameright-button').click(function() {
		if(jQuery(window).width() < 400){
			jQuery('#Namecontent').animate({
				scrollLeft: "+=250px"
			}, 'smooth');
		}
		else{
			jQuery('#Namecontent').animate({
			scrollLeft: "+=500px"
		  }, 'smooth');
		}      
	});
}

if($('#right-button')){
	$('#right-button').click(function() {
		if(jQuery(window).width() < 400){
			jQuery('#content').animate({
				scrollLeft: "+=250px"
			}, 'smooth');
		}
		else{
			jQuery('#content').animate({
				scrollLeft: "+=400px"
			}, 'smooth');
		}	
	});
}

 if($('#Nameleft-button')){  
	$('#Nameleft-button').click(function() {
		if(jQuery(window).width() < 400){
			jQuery('#Namecontent').animate({
				scrollLeft: "-=250px"
			}, 'smooth');
		}
		else{
		  jQuery('#Namecontent').animate({
			scrollLeft: "-=400px"
		  }, 'smooth');
		}
	});
}
if($('#left-button')){
	$('#left-button').click(function() {
		if(jQuery(window).width() < 400){
			jQuery('#content').animate({
				scrollLeft: "-=250px"
			}, 'smooth');
		}
		else{
			jQuery('#content').animate({
				scrollLeft: "-=400px"
			}, 'smooth');
		}	
	});
}
if($('#IDleft-button')){
	$('#IDleft-button').click(function() {
		if(jQuery(window).width() < 400){
			jQuery('#IDcontent').animate({
				scrollLeft: "-=250px"
			}, 'smooth');
		}
		else{
		  jQuery('#IDcontent').animate({
			scrollLeft: "-=400px"
		  }, 'smooth');
		}
	});
}