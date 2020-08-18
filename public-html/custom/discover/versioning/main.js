var latestVersion = '';
jQuery(document).ready(function handleDocumentReady (e) {
    console.log("im inside main.js");
});
getAllVersion().then((response) => {
    latestVersion = response["currentVersion"];
    jQuery("#latestLabel").text(`${response["currentVersion"]}.`);
    getCurrentVersion().then((selectedVer)=> {
        if(selectedVer === latestVersion){
            jQuery('#viewVersionDiv').hide();
            jQuery('#matchingVersion').show(); 
        }
        else{
            jQuery("#viewVersionLabel").text(`${selectedVer}.`);
            jQuery('#viewVersionDiv').show();
            jQuery('#matchingVersion').hide(); 
        }
    });
    
    for(var i=0; i<response["legacyVersion"].length; i++){
        var tempVersion = response["legacyVersion"][i];
        var radioBtn = $('<label><input type="radio" name="legacyVersion" value='+tempVersion +'>'+tempVersion + '</label>');
        radioBtn.appendTo('#versionListDiv');        
    }
});
jQuery('#versionForm').on('submit', function(event) {
    event.preventDefault();
    var userSelectedVersion = jQuery('input[name="legacyVersion"]:checked').val();
    sessionStorage.setItem("selectedVersion", userSelectedVersion);
    window.location.href="/joomla/index.php";
   
});
function resetVersion(){
    jQuery('input[name="legacyVersion"]').prop('checked', false);
    sessionStorage.setItem("selectedVersion", latestVersion);
    window.location.href="/joomla/index.php";
}