$(document).ready(function () {
	
	jQuery('#correctionsForm').on('submit', function(event) {
		event.preventDefault();
		
		var correctionTypeRadio = document.querySelector('input[name="correctionType"]:checked').value;
		if(correctionTypeRadio == "missingCompound"){
			var compNoNameChkValue = document.getElementById("cmpNoNameChkBox").checked;
			
			if(compNoNameChkValue)
				compNoNameChkValue = false;
			else
				compNoNameChkValue = true;
			
			jQuery('input.abc').each(function() {				
                jQuery(this).rules("add", {required: compNoNameChkValue})
            });
		}		
	});
	$.validator.setDefaults({
		errorClass : 'error',
		highlight : function(element){
			$(element)
				.closest('.form-group')
				.addClass('error');
		},
		unhighlight : function(element){
			$(element)
				.closest('.form-group')
				.removeClass('error');
		}
	});
	
    $('#correctionsForm').validate({ // initialize the plugin
        rules: {
         /*   compoundName: {
                required: {required: document.getElementById("cmpNoNameChkBox").checked}
				
            }, */
            missCompCitation: {
                required: true
                
            },
			incorStrucNPAID :{
				required: true
			},
			incorStruCitation : {
				required: true
			},
			incorCompNameNPAID : {
				required: true
			},
			incorCompNameCitation : {
				required: true
			},
			correctCompName: {
				required: true
			},
			incorReferNPAID : {
				required: true
			},
			incorReferCitation : {
				required: true
			},
			incorrectTaxNPAID : {
				required: true
			},
			correctGenus : {
				required: true
			},
			incorrectTaxCitation : {
				required: true
			},
			incorStrucRadio : {required: true},
			incorrectTaxRadio : {required :true},
			incorrectReferRadio : {required :true},
			incorrectCompNameRadio : {required :true},
			otherIncorNameText : {required: '#otherIncCompNameRadio:checked'},
			otherIncorStruText : {required: '#otherIncorStrRadio:checked'},
			otherIncorRefer : {required: '#incorReferOtherRadio:checked'},		
			otherIncorTax : {required: '#incorTaxOtherRadio:checked'}	
        },
		messages : {
			compoundName: "Compound Name is required field",
			missCompCitation : "Citation is required field",
			incorStrucRadio : "Select one of the radio buttons",
			incorrectTaxRadio : "Select one of the radio buttons",
			incorrectReferRadio : "Select one of the radio buttons",
			incorrectCompNameRadio : "Select one of the radio buttons",
			otherIncorTax : "This is required field",
			otherIncorRefer : "This is required field",
			otherIncorNameText : "This is required field",
			otherIncorStruText : "This is required field"
		},
        errorPlacement: function(error, element) {
            if ( element.is(":radio") ) {
				if(element.attr("name") == "incorStrucRadio")
					error.insertAfter( '#otherIncorStruText' );
				if(element.attr("name") == "incorrectTaxRadio")
					error.insertAfter( '#otherIncorTax' );
				if(element.attr("name") == "incorrectReferRadio")
					error.insertAfter( '#otherIncorRefer' );
				if(element.attr("name") == "incorrectCompNameRadio")
					error.insertAfter( '#otherIncorNameText' );
            }
            else 
            { // This is the default behavior 
                error.insertAfter( element );
            }
         },
		submitHandler: function (form) { // for demo
          //  alert('valid form submitted');
			submitCorrectionsData();
		//	successDialog();
			 
            return false; // for demo
        }
    });
	
	
	
	
/*	
	$('#correctionsForm input').on('keyup blur', function () { // fires on every keyup & blur
        if ($('#correctionsForm').valid()) {                   // checks form for validity
             $('#submitButton').removeAttr('disabled');         // enables button
        } else {
            $('#submitButton').prop('disabled', 'disabled');   // disables button
        }
    });
*/
});