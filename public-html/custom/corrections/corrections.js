$(document).ready(function() {
	console.log("on window reload");
	document.getElementById('divIncorStructure').style.display ='none';
	document.getElementById('divIncorCompName').style.display ='none';
	document.getElementById('divIncorRefer').style.display ='none';
	document.getElementById('divIncorTax').style.display ='none';

	document.getElementById('divMisComp').style.display = 'block';
	 
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
					document.getElementById("correctionsForm").reset();
					jQuery('#divIncorStructure').hide();
					jQuery('#divIncorCompName').hide();
					jQuery('#divIncorRefer').hide();
					jQuery('#divIncorTax').hide();
					jQuery('#divMisComp').show();
					jQuery(this).dialog("close");
				}
			}
		}); 
	
	 
});
function showMissingCompound(){
    console.log("im in showMissingCompound");
     document.getElementById('divIncorStructure').style.display ='none';
     document.getElementById('divIncorCompName').style.display ='none';
     document.getElementById('divIncorRefer').style.display ='none';
     document.getElementById('divIncorTax').style.display ='none';

     document.getElementById('divMisComp').style.display = 'block';
}
function showIncorrectStructure(){
    console.log("im in showIncorrectStructure");
	if(document.getElementById("otherIncorStrRadio").checked)
		document.getElementById("otherIncorStruText").removeAttribute("readOnly");
	else
		document.getElementById("otherIncorStruText").setAttribute("readOnly", "readOnly");
	
    document.getElementById('divMisComp').style.display ='none';
     document.getElementById('divIncorCompName').style.display ='none';
     document.getElementById('divIncorRefer').style.display ='none';
     document.getElementById('divIncorTax').style.display ='none';

     document.getElementById('divIncorStructure').style.display = 'block';
}
function showIncorCompName(){
console.log("im in showIncorCompName");
	if(document.getElementById("otherIncCompNameRadio").checked)
		document.getElementById("otherIncorNameText").removeAttribute("readOnly");
	else
		document.getElementById("otherIncorNameText").setAttribute("readOnly", "readOnly");
	
    document.getElementById('divIncorStructure').style.display ='none';
     document.getElementById('divMisComp').style.display ='none';
     document.getElementById('divIncorRefer').style.display ='none';
     document.getElementById('divIncorTax').style.display ='none';

     document.getElementById('divIncorCompName').style.display = 'block';
}
function showIncorRefer(){
console.log("im in showIncorRefer");
	if(document.getElementById("incorReferOtherRadio").checked)
		document.getElementById("otherIncorRefer").removeAttribute("readOnly");
	else
		document.getElementById("otherIncorRefer").setAttribute("readOnly", "readOnly");
	
    document.getElementById('divIncorStructure').style.display ='none';
     document.getElementById('divIncorCompName').style.display ='none';
     document.getElementById('divMisComp').style.display ='none';
     document.getElementById('divIncorTax').style.display ='none';

     document.getElementById('divIncorRefer').style.display = 'block';
}
function showIncorTax(){
console.log("im in showIncorTax");
	
	if(document.getElementById("incorTaxOtherRadio").checked)
		document.getElementById("otherIncorTax").removeAttribute("readOnly");
	else
		document.getElementById("otherIncorTax").setAttribute("readOnly", "readOnly");
	   
    document.getElementById('divIncorStructure').style.display ='none';
    document.getElementById('divIncorCompName').style.display ='none';
     document.getElementById('divIncorRefer').style.display ='none';
     document.getElementById('divMisComp').style.display ='none';

     document.getElementById('divIncorTax').style.display = 'block';
}

var correctionsData = {
      correctionTypeRadio : "",
      npaid : "",
      correctCitation : "",
        compoundStructure : "",
     correctGenus : "",
      correctCompName : "",
      inCorrectCompoundName : "",

      compoundName : "",
      compoundFormula : "",
      otherInfo : "",
      correctTaxRadio : "",
      correctReferRadio : "",
      correctCompNameRadio : "",
      missingCmpXML : "",
      incorrStrctXML : ""
};

function submitCorrectionsData(){

      var tempSource = "";
       correctionsData.correctionTypeRadio = document.querySelector('input[name="correctionType"]:checked').value;


    if(correctionsData.correctionTypeRadio == "missingCompound"){

        correctionsData.compoundName = document.getElementById('compoundName').value;
        correctionsData.correctCitation = document.getElementById('missCompCitation').value;
        correctionsData.compoundFormula = document.getElementById('compFormula').value;
        correctionsData.compoundStructure = document.getElementById('compStructure').value;
        correctionsData.otherInfo = document.getElementById('info').value;
        PicToXMLString("#sketch", "mol", CBMol);
              
    }
    if(correctionsData.correctionTypeRadio == "incorrectStructure"){

        correctionsData.npaid = document.getElementById('incorStrucNPAID').value;
        correctionsData.correctCitation = document.getElementById('incorStruCitation').value;
        correctionsData.compoundStructure = document.getElementById('incorStruCompStructure').value;
        PicToXMLString("#sketch1","mol", CBMol);
     
		correctionsData.correctCompNameRadio = document.querySelector('input[name="incorStrucRadio"]:checked').value;

        if(correctionsData.correctCompNameRadio == "incorStruOther"){
             correctionsData.correctCompNameRadio = document.getElementById('otherIncorStruText').value;
         }
         else if(correctionsData.correctCompNameRadio == "incorStrEnanWrong"){
             correctionsData.correctCompNameRadio = "Wrong enantiomer";
         }
         else if(correctionsData.correctCompNameRadio == "incorStrConfigMis"){
             correctionsData.correctCompNameRadio = "Configuration(s) missing/incorrect";
         }
         else if(correctionsData.correctCompNameRadio == "incorStrAtlas"){
            correctionsData.correctCompNameRadio = "Atlas structure incorrect";
         }
    }
    if(correctionsData.correctionTypeRadio == "incorrectCompName"){

        correctionsData.npaid = document.getElementById('incorCompNameNPAID').value;
        correctionsData.correctCompName = document.getElementById('correctCompName').value;
        correctionsData.correctCitation = document.getElementById('incorCompNameCitation').value;
        correctionsData.inCorrectCompoundName = document.getElementById('inCorrectCompoundName').value;
        correctionsData.correctCompNameRadio = document.querySelector('input[name="incorrectCompNameRadio"]:checked').value;

        if(correctionsData.correctCompNameRadio == "otherIncorName"){
             correctionsData.correctCompNameRadio = document.getElementById('otherIncorNameText').value;
         }
         else if(correctionsData.correctCompNameRadio == "incorNameAddName"){
             correctionsData.correctCompNameRadio = "Additional name required";
         }
         else if(correctionsData.correctCompNameRadio == "incorNameValue"){
             correctionsData.correctCompNameRadio = "Name incorrect";
         }
         else if(correctionsData.correctCompNameRadio == "incorNameMissing"){
             correctionsData.correctCompNameRadio = "Name missing";
         }
		sendMail(correctionsData,document.getElementById("username").value,document.getElementById("usermail").value,"", cbSuccessful);
    }
    if(correctionsData.correctionTypeRadio == "incorrectRefer"){

        correctionsData.npaid = document.getElementById('incorReferNPAID').value;
        correctionsData.correctCitation = document.getElementById('incorReferCitation').value;
        correctionsData.correctReferRadio = document.querySelector('input[name="incorrectReferRadio"]:checked').value;

        if(correctionsData.correctReferRadio == "referOther"){
             correctionsData.correctReferRadio = document.getElementById('otherIncorRefer').value;
         }
         else if(correctionsData.correctReferRadio == "referAddIns"){
             correctionsData.correctReferRadio = "Additional instance of compound isolation";
         }
         else if(correctionsData.correctReferRadio == "referIsoConc"){
             correctionsData.correctReferRadio = "Isolated concurrently by two groups";
         }
         else if(correctionsData.correctReferRadio == "incorReport"){
             correctionsData.correctReferRadio = "Not the correct original isolation report";
         }
		sendMail(correctionsData,document.getElementById("username").value,document.getElementById("usermail").value,"", cbSuccessful);
    }
    if(correctionsData.correctionTypeRadio == "incorrectTax"){
         correctionsData.npaid = document.getElementById('incorrectTaxNPAID').value;
         correctionsData.correctCitation = document.getElementById('incorrectTaxCitation').value;
         correctionsData.correctGenus = document.getElementById('correctGenus').value;
        correctionsData.correctTaxRadio = document.querySelector('input[name="incorrectTaxRadio"]:checked').value;

         if(correctionsData.correctTaxRadio == "incorTaxOther"){
             correctionsData.correctTaxRadio = document.getElementById('otherIncorTax').value;
         }
         else if(correctionsData.correctTaxRadio == "addSource"){
             correctionsData.correctTaxRadio = "Additional source organism";
         }
         else if(correctionsData.correctTaxRadio == "isoConcurrent"){
             correctionsData.correctTaxRadio = "Isolated concurrently from different sources";
         }
         else if(correctionsData.correctTaxRadio == "incorIsolation"){
             correctionsData.correctTaxRadio = "Not the correct original isolation genus/species";
         }
		 sendMail(correctionsData,document.getElementById("username").value,document.getElementById("usermail").value,"", cbSuccessful, "#popup");
    }
	
    console.log(correctionsData);
	
    
/*
    // marvin code to convert figures to string
	function PicToXMLString(divID){
        var marvinSketcherInstance;
          var p = MarvinJSUtil.getEditor(divID);
      //  var p = MarvinJSUtil.getEditor("#sketch");
          return p.then(function (sketcherInstance) {
             marvinSketcherInstance = sketcherInstance;
              marvinSketcherInstance.exportStructure("mol").then(function(source){
                  abc(source);
              });
             }, function(error) {
                  alert("Molecule export failed:"+error);
                });
    };
*/	
}

function CBMol(result){
	correctionsData.missingCmpXML =  result;
	molToPNG(result, CBPng);
}

function CBPng(structurePicture){
	sendMail(correctionsData,document.getElementById("username").value,document.getElementById("usermail").value,structurePicture, cbSuccessful);
}

function cbSuccessful(response){
	if(response == "0"){
		successDialog();
	}
		
}
 function successDialog(){
		jQuery('#message').dialog("open");
		jQuery(".ui-dialog-titlebar-close").remove();
}
	

function compoundNoNameCheckBox(){
	var chk=document.getElementById("cmpNoNameChkBox").checked;
	if(chk == true)
		document.getElementById('compoundName').readOnly='readOnly';
	else
		document.getElementById('compoundName').removeAttribute('readOnly');
}


jQuery("#btn-reset").on("click", function (e) {
    document.getElementById("basicsearch").reset();
});	