var marvin_popup;
var marvinSketcherInstance_popup;
var npaIDArray = [];
var globalSmiles = "";
const instance = axios.create({
  baseURL: "http://localhost/api/v1",
  timeout: 10000,
  headers: { "X-Api-Key": "eec687df-aa7e-46ff-b02a-c315fd06bb08" },
});

var currentVersion = "";
getCurrentVersion().then((dbVersion) => {
  currentVersion = dbVersion;
  instance.get("/compounds/names/").then((resp) => {
    allCompCB(resp.data);
  });
  instance.get("/taxon/genus/").then((resp) => {
    allGenusCB(resp.data);
  });
  //   compoundID_compName_All("#loadingIcon", dbVersion).done(function (data) {
  //     allCompCB(data);
  //   });
  //   compoundGenusAll(allGenusCB, "#loadingIcon", dbVersion);
  //   compoundSpeciesAll(allSpeciesCB, "#loadingIcon", dbVersion);
});

jQuery(document).ready(function handleDocumentReady(e) {
  jQuery("#close").bind("click", function () {
    editorControl.close();
  });
  jQuery(document).keyup(function (e) {
    if (e.keyCode == 27) {
      // escape key maps to keycode `27`
      editorControl.close();
    }
  });

  jQuery("#message").dialog({
    autoOpen: false,
    modal: true,
    show: {
      effect: "fade",
      duration: 500,
    },
    hide: {
      effect: "blind",
      duration: 500,
    },
    buttons: {
      OK: function () {
        document.getElementById("basicsearch").reset();
        jQuery(this).dialog("close");
      },
    },
  });
  addRow();
});

// marvin for the sketcher
var marvin;
var marvinSketcherInstance;

jQuery(document).ready(function handleDocumentReady(e) {
  MarvinJSUtil.getPackage("#sketch").then(
    function (marvinNameSpace) {
      marvinNameSpace.onReady(function () {
        marvin = marvinNameSpace;
      });
    },
    function () {
      alert("Cannot retrieve marvin instance from iframe");
    }
  );

  MarvinJSUtil.getEditor("#sketch").then(
    function (sketcherInstance) {
      marvinSketcherInstance = sketcherInstance;
      // if results is present in the URL, that means we have to show the results, otherwise clear session storage
      if (window.location.hash.substring(1) == "results") {
        var storedBasicSearchResultArr = JSON.parse(
          sessionStorage.getItem("BSResults")
        );
        if (storedBasicSearchResultArr)
          populateForm(storedBasicSearchResultArr);
      } else sessionStorage.removeItem("BSResults");
    },
    function (error) {
      alert("Cannot retrieve sketcher instance from iframe:" + error);
    }
  );
});

function populateForm(url_params_object) {
  for (var field in url_params_object) {
    if (document.getElementById(field))
      document.getElementById(field).value = url_params_object[field];
  }
  if (url_params_object["search_type"]) {
    if (url_params_object["search_type"] == "FULL")
      document.getElementById("full_structure").checked = true;
    else if (url_params_object["search_type"] == "SUBSTRUCTURE")
      document.getElementById("substructure").checked = true;
    else if (url_params_object["search_type"] == "SIMILARITY")
      document.getElementById("similarity").checked = true;
  }
  if (url_params_object["customForm"]) {
    if (url_params_object["customForm"].length > 1) {
      for (var i = 0; i < url_params_object["customForm"].length - 1; i++) {
        addRow();
      }
    }
    var arr = url_params_object["customForm"];
    for (var i = 0; i < arr.length; i++) {
      jQuery("#customFormulaElement" + (i + 1)).val(arr[i]["formulaElemName"]);
      jQuery("#customFormulaOperator" + (i + 1)).val(arr[i]["formulaElemOp"]);
      jQuery("#customFormulaValue" + (i + 1)).val(arr[i]["formulaElemVal"]);
    }
  }
  if (url_params_object["smiles"]) {
    var marvinSmiles = marvinSketcherInstance.importStructure(
      "smiles",
      url_params_object["smiles"]
    );
    marvinSmiles.then(function () {
      process_form(jQuery("#btn-submit"));
    });
  } else process_form(jQuery("#btn-submit"));
}

jQuery("#btn-reset").on("click", function (e) {
  document.getElementById("basicsearch").reset();

  document.getElementById("pagination_above").innerHTML = "";
  document.getElementById("pagination_above_count").innerHTML = "";
  document.getElementById("results").innerHTML = "";
  document.getElementById("pagination_under_count").innerHTML = "";
  document.getElementById("pagination_under").innerHTML = "";
  document.getElementById("total").innerHTML = "";
  window.location.hash = "";
  jQuery("#basic_search_result").hide();

  marvinSketcherInstance.clear();
  sessionStorage.removeItem("BSResults");
});

// ====================================================================================
// process the form on submit
// ====================================================================================

var bsform = document.getElementById("basicsearch");
if (bsform.attachEvent) {
  bsform.attachEvent("submit", process_form);
} else {
  bsform.addEventListener("submit", process_form);
}

function process_form(e) {
  if (e.preventDefault) e.preventDefault();

  if (document.contains(document.getElementById("pagination_above"))) {
    document.getElementById("pagination_above").innerHTML = "";
  }

  // get form data
  var form_data = objectifyForm("basicsearch");
  //	console.log(jQuery('ul#customFormTable li').length);
  //	var table = document.getElementById("customFormTable");
  var maxLoop = maxID;
  if (jQuery("ul#customFormTable li").length > maxID)
    maxLoop = jQuery("ul#customFormTable li").length;
  var tempArr = [];
  for (var counter = 0; counter <= maxLoop; counter++) {
    var obj = {};
    if (jQuery("#customFormulaElement" + counter).val()) {
      if (jQuery("#customFormulaOperator" + counter).val())
        if (jQuery("#customFormulaValue" + counter).val()) {
          obj["formulaElemName"] = jQuery(
            "#customFormulaElement" + counter
          ).val();
          obj["formulaElemOp"] = jQuery(
            "#customFormulaOperator" + counter
          ).val();
          obj["formulaElemVal"] = jQuery("#customFormulaValue" + counter).val();
          tempArr.push(obj);
        }
    }
  }
  if (tempArr.length > 0) form_data["customForm"] = tempArr;

  if (marvinSketcherInstance.isEmpty()) {
    var smiles = "";
    globalSmiles = smiles;
    offset = 0;
    limit = 10;
    sessionStorage.setItem("BSResults", JSON.stringify(form_data));
    getResult(
      smiles,
      1,
      1,
      limit,
      "pagination_above",
      "pagination_under",
      paginate_result,
      false,
      true,
      "",
      "#loadingIcon",
      currentVersion
    );
  } else {
    marvinSketcherInstance.exportStructure("smiles").then(
      //success
      function (smiles) {
        globalSmiles = smiles;
        offset = 0;
        limit = 10;
        if (smiles) {
          form_data["smiles"] = smiles;
          sessionStorage.setItem("BSResults", JSON.stringify(form_data));
        } else {
          sessionStorage.setItem("BSResults", JSON.stringify(form_data));
        }
        getResult(
          smiles,
          1,
          1,
          limit,
          "pagination_above",
          "pagination_under",
          paginate_result,
          false,
          true,
          "",
          "#loadingIcon",
          currentVersion
        );
      },
      function (error) {
        alert("Molecule export failed:" + error);
      } //fail
    );
  }

  return false;
  /*

  // get smiles from marvin asynchronous promise so everythinf is processed in this promise
	  marvinSketcherInstance.exportStructure("smiles").then(
		//success
		function(smiles){
		  console.log('button pressed');
		  console.log('smiles:', smiles);
			globalSmiles = smiles;
		  offset=0;
		  limit=10;

		  // perform the search
		if(smiles)
			var dum='#submited=1&smiles='+escape(smiles)+'&';
		else
			var dum='#submited=1&';
				for (var field in form_data){
					if (form_data.hasOwnProperty(field)){
								dum = dum+field+'='+form_data[field]+'&';
					}
				}
				dum=dum.slice(0,-1);
				window.location.hash=dum;

		  getResult(smiles,1,1,limit,"pagination_above","pagination_under",paginate_result, false, true,"","#loadingIcon");
				//paginate_result(results,smiles,page,limit,pagi_id1,pagi_id2)
		},
		function(error) //fail
		{
		  alert("Molecule export failed:"+error);
		}
	  );// end of marvin promise

	  // You must return false to prevent the default form behavior
	 */
}

function objectifyForm(formid) {
  //serialize data function

  var returnArray = {};
  var formArray = jQuery("#" + formid).serializeArray();
  for (var i = 0; i < formArray.length; i++) {
    returnArray[formArray[i]["name"]] = formArray[i]["value"];
  }
  return returnArray;
}

function webservices_params(form_data, smiles, offset, limit) {
  // get value in the form
  var error = "";
  var search_type = form_data.search_type;
  var threshold = form_data.threshold;
  var name = form_data.compoundname;
  var customForliFElID = jQuery("ul#customFormTable li:first").attr("id");
  var i = parseInt(customForliFElID.substring(3, customForliFElID.length));

  var customFormulaElement = form_data["customFormulaElement" + i];
  var customFormulaOperator = form_data["customFormulaOperator" + i];
  var customFormulaValue = form_data["customFormulaValue" + i];
  var minMolWt = form_data.minMolecularWeight;
  var maxMolWt = form_data.maxMolecularWeight;
  var formula = form_data.formula;
  var genus = form_data.sourcegenus;
  var species = form_data.sourcespecies;
  var inchi = form_data.inchi;
  var inchikey = form_data.inchikey;
  var smilesForm = form_data.smilesForm;
  var mass = form_data.accuratemass;
  var mass_select = form_data.accuratemass_select;
  var mass_precision = form_data.amprecision;
  var mass_precision_unit = form_data.amprecision_select;

  if (typeof form_data.origintype === "undefined") var otype = "";
  else var otype = form_data.origintype;

  if (
    name != "" ||
    minMolWt != "" ||
    maxMolWt != "" ||
    formula != "" ||
    genus != "" ||
    smilesForm != "" ||
    species != "" ||
    inchi != "" ||
    inchikey != "" ||
    mass != "" ||
    (otype != "" && otype != "all" && otype != "Select an origin type") ||
    smiles.length != 0 ||
    customFormulaElement
  ) {
    // something in the form or in marvin
    // search type (options slighty differents)
    if (search_type == "SIMILARITY") {
      var search_options = {
        queryStructure: smiles,
        searchType: "SIMILARITY",
        similarity: { descriptor: "CFP", threshold: threshold },
      };
    } else if (search_type == "SUBSTRUCTURE")
      var search_options = {
        queryStructure: smiles,
        searchType: "SUBSTRUCTURE",
      };
    else if (search_type == "FULL")
      var search_options = { queryStructure: smiles, searchType: "FULL" };
    // i think this is not required (substructure condition is already mentioned above)
    else
      var search_options = { queryStructure: "", searchType: "SUBSTRUCTURE" };

    // get search otions
    //var smiles=document.getElementById("#molsource").value;
    if (
      name != "" ||
      minMolWt != "" ||
      maxMolWt != "" ||
      formula != "" ||
      genus != "" ||
      customFormulaElement ||
      smilesForm != "" ||
      species != "" ||
      inchi != "" ||
      inchikey != "" ||
      mass != "" ||
      (otype != "" && otype != "all" && otype != "Select an origin type")
    ) {
      // the form is completed
      //console.log('SearchOptions :', search_options);
      var conditions = { $and: [] };

      //test on every field
      if (name != "")
        conditions.$and.push({ compound_names: { $contains: [name] } });

      /* if(weight!="")
				{
				 conditions.$and.push({"compound_molecular_weight":{"$between":[parseFloat(weight)-1,parseFloat(weight)+1]}});
				}*/
      if (minMolWt)
        conditions.$and.push({
          compound_molecular_weight: { $gte: parseFloat(minMolWt) },
        });

      var table = document.getElementById("customFormTable");
      var maxLoopComp = maxID;
      if (jQuery("ul#customFormTable li").length > maxLoopComp)
        maxLoopComp = jQuery("ul#customFormTable li").length;
      for (var counter = 0; counter <= maxLoopComp; counter++) {
        if (document.getElementById("customFormulaElement" + counter)) {
          elementName = document.getElementById(
            "customFormulaElement" + counter
          ).value;
          if (elementName) {
            if (document.getElementById("customFormulaOperator" + counter)) {
              operatorValue = document.getElementById(
                "customFormulaOperator" + counter
              ).value;
              if (operatorValue) {
                if (document.getElementById("customFormulaValue" + counter)) {
                  value = document.getElementById(
                    "customFormulaValue" + counter
                  ).value;
                  if (value) {
                    var tempString = "number_" + elementName;
                    if (operatorValue == "lessThan") tempOperator = "$lt";
                    else if (operatorValue == "greaterThan")
                      tempOperator = "$gt";
                    else if (operatorValue == "equalTo") tempOperator = "$eq";

                    var tempString2 =
                      '{"' +
                      tempString +
                      '":{"' +
                      tempOperator +
                      '":' +
                      value +
                      "}}";
                    var tempJSON = JSON.parse(tempString2);
                    conditions.$and.push(tempJSON);
                  }
                }
              }
            }
          }
        }
      }

      if (maxMolWt)
        conditions.$and.push({
          compound_molecular_weight: { $lte: parseFloat(maxMolWt) },
        });
      if (formula != "")
        conditions.$and.push({
          compound_molecular_formula: { $eqIc: [formula] },
        });
      if (genus != "") conditions.$and.push({ genus: { $eqIc: [genus] } });
      if (species != "")
        conditions.$and.push({ origin_species: { $contains: [species] } });
      if (inchi != "")
        conditions.$and.push({ compound_inchi: { $eqIc: [inchi] } });
      if (inchikey != "")
        conditions.$and.push({ compound_inchikey: { $eqIc: [inchikey] } });
      if (smilesForm != "")
        conditions.$and.push({ compound_smiles: { $eqIc: [smilesForm] } });
      if (mass != "") {
        /*
					if (mass_select == "gt")
							conditions.$and.push({"compound_accurate_mass":{"$gte":parseFloat(mass)}});
					else if (mass_select == "lt")
						conditions.$and.push({"compound_accurate_mass":{"$lte":parseFloat(mass)}});	*/
        //	else if (mass_select == "eq"){
        if (mass_precision) {
          //console.log('mass_precision_unit: ',mass_precision_unit);
          if (mass_precision_unit == "Dalton")
            var precision = parseFloat(mass_precision);
          // PPM
          else
            var precision =
              (parseFloat(mass) * parseFloat(mass_precision)) / parseFloat(1e6);

          console.log("precision: ", precision);
          conditions.$and.push({
            compound_accurate_mass: { $gte: parseFloat(mass) - precision },
          });
          conditions.$and.push({
            compound_accurate_mass: { $lte: parseFloat(mass) + precision },
          });
          //		conditions.$and.push({"compound_accurate_mass":{"$between":[parseFloat(mass)-precision,parseFloat(mass)+precision]}});
        }
        /*	else
							error="molecularweight_no_precision";*/
        //	}
        /*	else
						var error="molecularweight_no_operation"; */
      }
      if (otype != "" && otype != "all" && otype != "Select an origin type")
        conditions.$and.push({ origin_type: { $contains: [otype] } });

      params = buildParamsWebServiceCall(
        search_options,
        offset,
        limit,
        conditions,
        error
      );
    } // nothing in the formula
    else {
      //console.log('SearchOptions :', search_options);
      var conditions = "";
      params = buildParamsWebServiceCall(
        search_options,
        offset,
        limit,
        conditions,
        error
      );

      console.log("nothing in the form");
    }
  } // nothing if the form
  else params = {};

  console.log("params: ", params);
  return params;
}

function create_result_table(results, length, offset) {
  document.getElementById("results").innerHTML = "";
  jQuery("#basic_search_result").show();
  jQuery("#total").show();

  if (document.contains(document.getElementById("result_table"))) {
    document.getElementById("result_table").remove();
  }
  window.location.hash = "#results";
  spacer = document.createElement("div");
  spacer.style.background = "white";
  spacer.innerHTML = "<br>";
  document.getElementById("results").appendChild(spacer);

  var nb_results = results.data.length;
  getCompoundImagePath().then((path) => {
    for (i = 0; i < Math.min(parseInt(length), nb_results); i++) {
      var result_div = document.createElement("div");
      result_div.setAttribute("class", "result_table");
      result_div.setAttribute("id", "result_table_id" + i.toString().trim());

      var number_div = document.createElement("div");
      number_div.setAttribute("class", "resultNum");
      number_div.innerHTML =
        "<h1 class='g-title'>#" +
        (parseInt(i) + 1 + parseInt(offset)).toString() +
        "<h1>";
      //	number_div.style.textAlign = "center";
      result_div.appendChild(number_div);

      var parent_div = document.createElement("div");
      parent_div.setAttribute("class", "parentDivResult");

      var image = document.createElement("img");
      var npa_id =
        "NPA" + results.data[i].compound_id.toString().padStart(6, "0");

      imageDataSource_global = path + npa_id + "_hw500.png";
      image.setAttribute("src", imageDataSource_global);
      image.setAttribute("class", "resultImage");
      image.setAttribute("onclick", "clickOnImage(this)");
      image.setAttribute("alt", npa_id);

      var image_container = document.createElement("div");
      //	image_container.setAttribute("id","structure_container");
      image_container.innerHTML = "";
      //	image_container.style.width = '47%';
      image_container.style.display = "block";
      image_container.setAttribute("class", "image-container");
      image_container.appendChild(image);
      image_container.style.cursor = "pointer";

      parent_div.appendChild(image_container);

      var compInfoDiv = document.createElement("div");
      compInfoDiv.setAttribute("class", "compInfoDivResults");
      //	compInfoDiv.style.width = '53%';
      var table = document.createElement("table");

      //	table.style.maxWidth = "540px";
      table.style.tableLayout = "fixed";
      table.style.border = "0";

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "NPA ID";
      th.setAttribute("class", "firstRowTH");
      //	th.style.borderTop = 0;
      line.appendChild(th);
      var td = document.createElement("td");
      //	td.innerHTML=npa_id;
      td.setAttribute("class", "firstRow");
      var a = document.createElement("a");
      a.innerHTML = npa_id;
      a.title = npa_id;
      a.href = "/joomla/index.php/explore/compounds?npaid=" + npa_id;
      //	a.setAttribute("target","_blank");
      td.appendChild(a);
      line.appendChild(td);
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Cluster ID";
      line.appendChild(th);
      var td = document.createElement("td");
      var a = document.createElement("a");
      a.innerHTML = results.data[i].compound_cluster_id;
      a.title = results.data[i].compound_cluster_id;
      a.href = "/joomla/index.php/explore/clusters?npaid=" + npa_id;
      td.appendChild(a);
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Node ID";
      line.appendChild(th);
      var td = document.createElement("td");
      var a = document.createElement("a");
      a.innerHTML = results.data[i].compound_node_id;
      a.title = results.data[i].compound_node_id;
      a.href = "/joomla/index.php/explore/nodes?npaid=" + npa_id;
      td.appendChild(a);
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Name(s)";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].compound_names;
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Formula";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].compound_molecular_formula;
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Molecular Weight (Da)";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].compound_molecular_weight.toFixed(2);
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Accurate Mass (Da)";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].compound_accurate_mass.toFixed(4);
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Origin Organism Type";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].origin_type;
      line.appendChild(td);
      table.appendChild(line);

      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Origin Genus";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].genus;
      line.appendChild(td);
      table.appendChild(line);
      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "Origin Species";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].origin_species;
      line.appendChild(td);
      table.appendChild(line);
      var line = document.createElement("tr");
      var th = document.createElement("th");
      th.style.textTransform = "uppercase";
      th.innerHTML = "InchIKey";
      line.appendChild(th);
      var td = document.createElement("td");
      td.innerHTML = results.data[i].compound_inchikey;
      line.appendChild(td);
      table.appendChild(line);

      // ALL BUTTONS

      var line = document.createElement("tr");
      var c = document.createElement("th");
      c.style.textTransform = "uppercase";
      c.innerHTML = "Export Options";
      line.appendChild(c);
      var buttons = document.createElement("td");

      var div1 = document.createElement("div");
      div1.setAttribute("id", "allButtons");
      var btn = document.createElement("BUTTON");
      btn.style.marginRight = "2%";
      btn.setAttribute("class", "btn btn-secondary");
      var t = document.createTextNode("TSV");

      btn.setAttribute(
        "onclick",
        "downloadCSV('" +
          npa_id +
          "','" +
          results.data[i].compound_inchikey +
          "','" +
          results.data[i].origin_type +
          "','" +
          results.data[i].genus +
          "','" +
          results.data[i].compound_names +
          "','" +
          results.data[i].compound_molecular_weight +
          "','" +
          results.data[i].compound_molecular_formula +
          "','" +
          results.data[i].compound_inchi +
          "','" +
          results.data[i].compound_cluster_id +
          "','" +
          results.data[i].compound_accurate_mass +
          "','" +
          results.data[i].cd_molweight +
          "','" +
          results.data[i].cd_id +
          "','" +
          results.data[i].compound_smiles +
          "')"
      );

      btn.appendChild(t);
      div1.appendChild(btn);

      var btn = document.createElement("a");
      btn.style.marginRight = "2%";
      btn.setAttribute("class", "btn btn-secondary");
      var t = document.createTextNode("MOL");
      btn.setAttribute("href", `/api/v1/compound/${npa_id}/mol?encode=file`);
      btn.setAttribute("download", `${npa_id}.mol`);
      btn.appendChild(t);
      div1.appendChild(btn);

      var btn = document.createElement("BUTTON");
      btn.style.marginRight = "2%";
      btn.setAttribute("class", "btn btn-secondary");
      var t = document.createTextNode("PNG");
      var imgData =
        "/custom/versions/" + currentVersion + "/png/" + npa_id + "_hw500.png";
      btn.setAttribute(
        "onclick",
        "downloadStructurePNG('" + npa_id + "','" + imgData + "')"
      );

      btn.appendChild(t);
      div1.appendChild(btn);
      buttons.appendChild(div1);
      line.appendChild(buttons);
      table.appendChild(line);

      var line = document.createElement("tr");
      var c = document.createElement("th");
      c.style.textTransform = "uppercase";
      c.innerHTML = "Project Molecule to Global View";
      line.appendChild(c);
      var buttons = document.createElement("td");
      var div1 = document.createElement("div");
      div1.setAttribute("id", "GlobalButton");
      var btn = document.createElement("a");
      btn.style.marginRight = "2%";
      btn.setAttribute("class", "btn btn-secondary");
      var t = document.createTextNode("Global View");

      btn.setAttribute(
        "href",
        `/joomla/index.php/explore/global?npaid=${npa_id}`
      );
      btn.setAttribute("target", "_self");
      btn.appendChild(t);

      div1.appendChild(btn);
      buttons.appendChild(div1);
      line.appendChild(buttons);
      table.appendChild(line);

      compInfoDiv.appendChild(table);
      parent_div.appendChild(compInfoDiv);

      result_div.appendChild(parent_div);

      document.getElementById("results").appendChild(result_div);

      spacer = document.createElement("div");
      spacer.style.background = "white";
      spacer.innerHTML = "<br>";
      document.getElementById("results").appendChild(spacer);
    }
  });

  jQuery("#results").css("display", "block");
}

function paginate_result(
  results,
  smiles,
  page,
  nb_pages,
  limit,
  pagi_id1,
  pagi_id2
) {
  if (results == 400) {
    jQuery("#message").dialog("open");
    jQuery(".ui-dialog-titlebar-close").remove();
  } else {
    var total = results.total;
    if (total == 0) {
      jQuery("#exportDiv").hide();
      jQuery("#pagSpaceDiv").hide();
      jQuery("#no_results").css("display", "block");
      jQuery("#total").css("display", "none");
      jQuery("#pagination_above").css("display", "none");
      jQuery("#pagination_above_count").css("display", "none");
      jQuery("#results").css("display", "none");
      jQuery("#pagination_under_count").css("display", "none");
      jQuery("#pagination_under").css("display", "none");
      jQuery("#basic_search_result").show();
      document.getElementById("no_results").innerHTML = "<p>No Result.<p>";
    } else if (total > limit) {
      jQuery("#exportDiv").show();
      jQuery("#pagSpaceDiv").show();
      jQuery("#no_results").css("display", "none");
      document.getElementById("results").innerHTML = "";
      document.getElementById("total").innerHTML = total + " result(s) found";
      jQuery("#pagination_above").css("display", "block");
      jQuery("#pagination_above_count").css("display", "block");
      jQuery("#pagination_under_count").css("display", "block");
      jQuery("#pagination_under").css("display", "block");
      create_pagination(pagi_id1, smiles, page, nb_pages, limit);
      create_pagination(pagi_id2, smiles, page, nb_pages, limit);
      display_paginated_result(
        results,
        smiles,
        page,
        nb_pages,
        limit,
        pagi_id1,
        pagi_id2
      );
    } else {
      jQuery("#exportDiv").show();
      jQuery("#pagSpaceDiv").show();
      jQuery("#no_results").css("display", "none");
      jQuery("#pagination_above").css("display", "none");
      jQuery("#pagination_above_count").css("display", "none");
      jQuery("#pagination_under_count").css("display", "none");
      jQuery("#pagination_under").css("display", "none");

      document.getElementById("results").innerHTML = "";
      document.getElementById("total").innerHTML = total + " result(s) found";
      create_result_table(results, total, 0);
    }
  }
}

function display_paginated_result(
  results,
  smiles,
  page,
  nb_pages,
  limit,
  pagi_id1,
  pagi_id2
) {
  var total = results.total;

  slide_on_pagination(pagi_id1, page, nb_pages, total, limit);
  slide_on_pagination(pagi_id2, page, nb_pages, total, limit);
  create_result_table(results, limit, (parseInt(page) - 1) * limit);
}

function slide_on_pagination(pagi_id, page, nb_pages, total, limit) {
  if (nb_pages <= 5) {
    for (i = 1; i <= nb_pages; i++) {
      document
        .getElementById(pagi_id + "_page" + i.toString().trim())
        .removeAttribute("class");
      document.getElementById(
        pagi_id + "_page" + i.toString().trim()
      ).style.display = "inline-block";
    }
  } else {
    for (i = 2; i < nb_pages; i++) {
      if (
        document.contains(
          document.getElementById(pagi_id + "_page" + i.toString().trim())
        )
      )
        document.getElementById(
          pagi_id + "_page" + i.toString().trim()
        ).style.display = "none";
    }
    for (i = 1; i <= nb_pages; i++) {
      if (
        document.contains(
          document.getElementById(pagi_id + "_page" + i.toString().trim())
        )
      )
        document
          .getElementById(pagi_id + "_page" + i.toString().trim())
          .removeAttribute("class");
    }

    document.getElementById(pagi_id + "_page1").style.display = "inline-block";
    document.getElementById(
      pagi_id + "_page" + page.toString().trim()
    ).style.display = "inline-block";
    document.getElementById(
      pagi_id + "_page" + page.toString().trim()
    ).innerHTML = page.toString().trim();
    document
      .getElementById(pagi_id + "_page" + page.toString().trim())
      .setAttribute("class", "active");
    document.getElementById(
      pagi_id + "_page" + nb_pages.toString().trim()
    ).style.display = "inline-block";
    if (page > 3) {
      document.getElementById(
        pagi_id + "_page" + (parseInt(page) - 1).toString().trim()
      ).style.display = "inline-block";
      document.getElementById(
        pagi_id + "_page" + (parseInt(page) - 1).toString().trim()
      ).title = "«";
      document.getElementById(
        pagi_id + "_page" + (parseInt(page) - 1).toString().trim()
      ).innerHTML = "«";
    }
    if (page < nb_pages - 2) {
      document.getElementById(
        pagi_id + "_page" + (parseInt(page) + 1).toString().trim()
      ).style.display = "inline-block";
      document.getElementById(
        pagi_id + "_page" + (parseInt(page) + 1).toString().trim()
      ).title = "»";
      document.getElementById(
        pagi_id + "_page" + (parseInt(page) + 1).toString().trim()
      ).innerHTML = "»";
    }
    if (page <= 3) {
      document.getElementById(pagi_id + "_page2").style.display =
        "inline-block";
      document.getElementById(pagi_id + "_page2").title = "2";
      document.getElementById(pagi_id + "_page2").innerHTML = "2";
      document.getElementById(pagi_id + "_page3").style.display =
        "inline-block";
      document.getElementById(pagi_id + "_page3").title = "3";
      document.getElementById(pagi_id + "_page3").innerHTML = "3";
      document.getElementById(pagi_id + "_page4").style.display =
        "inline-block";
      document.getElementById(pagi_id + "_page4").title = "»";
      document.getElementById(pagi_id + "_page4").innerHTML = "»";
    }
    if (page >= nb_pages - 2) {
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 3).toString().trim()
      ).style.display = "inline-block";
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 3).toString().trim()
      ).title = "«";
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 3).toString().trim()
      ).innerHTML = "«";
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 2).toString().trim()
      ).style.display = "inline-block";
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 2).toString().trim()
      ).title = parseInt(nb_pages) - 2;
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 2).toString().trim()
      ).innerHTML = parseInt(nb_pages) - 2;
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 1).toString().trim()
      ).style.display = "inline-block";
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 1).toString().trim()
      ).title = parseInt(nb_pages) - 1;
      document.getElementById(
        pagi_id + "_page" + (parseInt(nb_pages) - 1).toString().trim()
      ).innerHTML = parseInt(nb_pages) - 1;
    }
  }

  document
    .getElementById(pagi_id + "_page" + parseInt(page).toString().trim())
    .setAttribute("class", "active");

  var count =
    "Compound(s) " +
    ((parseInt(page) - 1) * limit + 1).toString().trim() +
    " - " +
    Math.min(total, parseInt(page) * limit)
      .toString()
      .trim() +
    " on " +
    total.toString().trim();

  document.getElementById(pagi_id + "_count").innerHTML = count;
}

function create_pagination(pagi_id, smiles, page, nb_pages, limit) {
  var pagi = document.getElementById(pagi_id);
  pagi.style.backgroundColor = "white";
  if (pagi_id == "pagination_above") {
    //generate the pagination
    for (i = 1; i <= nb_pages; i++) {
      var a = document.createElement("a");
      var t = document.createTextNode(i.toString());
      a.appendChild(t);
      a.id = pagi_id + "_page" + i.toString().trim();
      a.title = i.toString();
      a.href =
        "javascript:getResult('" +
        smiles +
        "'," +
        i.toString() +
        ",1," +
        limit.toString() +
        ",'pagination_above','pagination_under',display_paginated_result, false, true,'', '#loadingIcon', '" +
        currentVersion +
        "')";
      a.style.display = "none";
      pagi.appendChild(a);
    }
  } else {
    if (document.contains(document.getElementById("pagination_under"))) {
      // document.getElementById("pagination_under").remove();
      document.getElementById("pagination_under").innerHTML = "";
    }
    //generate the pagination
    for (i = 1; i <= nb_pages; i++) {
      /*
			var a1=document.createElement('a');

			a1.href = "javascript:void(0);";
			a1.setAttribute("onclick","window.scroll(0,1);");
		//	a1.style.display="none";
			pagi.appendChild(a1);
			*/
      var a = document.createElement("a");
      var t = document.createTextNode(i.toString());
      a.appendChild(t);
      a.id = pagi_id + "_page" + i.toString().trim();
      a.title = i.toString();
      a.href =
        "javascript:getResult('" +
        smiles +
        "'," +
        i.toString() +
        ",1," +
        limit.toString() +
        ",'pagination_above','pagination_under',display_paginated_result, false, true,'', '#loadingIcon','" +
        currentVersion +
        "')";
      a.setAttribute(
        "onclick",
        "window.scroll({top: 1000,behavior: 'smooth'});"
      );
      //	a.setAttribute("onclick","location.href='#basic_search_result'");
      a.style.display = "none";
      pagi.appendChild(a);
    }
  }
}

var editorControl = (function () {
  var currentPict = null;

  var controlObject = {
    picture: function picture(pict) {
      currentPict = pict;
    },
    open: function openEditor() {
      if (currentPict != null) {
        var cp = currentPict;
        console.log("cp.alt " + cp.alt);
        var image = document.getElementById("marvin_popup_image");

        if (cp != null) {
          image.setAttribute(
            "src",
            "/custom/versions/" +
              currentVersion +
              "/png/" +
              cp.alt +
              "_hw500.png"
          );

          var image_container = document.getElementById("sketchContainer"); //createElement('div');

          image_container.style.display = "inline-block";
          image_container.style.backgroundColor = "white";
          image_container.style.styleFloat = "left";
        }

        jQuery("#popup").css("visibility", "visible");
        jQuery("#popup").css("opacity", 1);
      }
    },

    close: function closeEditor() {
      jQuery("#popup").css("visibility", "hidden");
      jQuery("#popup").css("opacity", 0);
    },
  };
  return controlObject;
})();

function clickOnImage(pict) {
  editorControl.picture(pict);
  editorControl.open();
}

function eachCompToGlobal(npaid, nodeID) {
  console.log(npaid + " " + globalID);
  var searchResults = [];
  var tempComp = { nodeID: nodeID };
}

function allResultsGlobalView() {
  getResult(
    globalSmiles,
    1,
    1,
    basicSearchTotalResults,
    "pagination_above",
    "pagination_under",
    showGlobalCB,
    false,
    true,
    "",
    "#loadingIcon",
    currentVersion
  );
}

async function showGlobalCB(response) {
  // get all the node IDs of all the compounds and form the array
  if (response.data.length > 0) {
    jQuery("#loadingIcon").show();
    var npaidArr = response.data.map((x) => x.compound_id);
    let resp = await instance.post("/nodeSearch/", { npaids: npaidArr });
    console.log(resp);
    sessionStorage.setItem(
      "basicSearchResults",
      JSON.stringify(resp.data.map((x) => x.id))
    );
    window.open("/joomla/index.php/explore/global", "_self");
    jQuery("#loadingIcon").hide();
  }
}

function autoComplete(elementID, data) {
  var $ = jQuery;
  var $input = $("#" + elementID);
  $input.typeahead({
    source: data,
    autoSelect: false,
  });
}

function allCompCB(data) {
  if (data == 400) {
    jQuery("dialogLoadingPageError").show();
  } else {
    compoundNames = data;
    //	var abc = 'compNameBscSearch .typeahead';
    // Alphabetize
    compoundNames.sort();
    autoComplete("compoundname", compoundNames);
  }
}

function allGenusCB(data) {
  if (data == 400) {
    jQuery("dialogLoadingPageError").show();
  } else {
    genusNames = data.map((x) => x.name);
    //	var abc = 'GenusNameBscSearch .typeahead';
    autoComplete("sourcegenus", genusNames);
  }
}

function allSpeciesCB(data) {
  if (data == 400) {
    jQuery("dialogLoadingPageError").show();
  } else {
    speciesNames = [];
    data.forEach(function (tempComp) {
      speciesNames.push(tempComp[0]);
    });
    //	var abc = 'SpeciesNameBscSearch .typeahead1';
    autoComplete("sourcespecies", speciesNames);
  }
}

function closeLoadingPageErrorPopup() {
  jQuery("#dialogLoadingPageError").hide();
}

function closeSearchErrorPopup() {
  jQuery("#dialogSearchError").hide();
}

function remRow(input) {
  var ul = document.getElementById("customFormTable");
  var i = parseInt(input.id.substring(3, input.id.length));
  jQuery("#row" + i).remove();
}

var maxID = 0;

function addRow() {
  maxID++;
  var ul = document.getElementById("customFormTable");
  var li = document.createElement("li");

  var divCon = document.createElement("div");
  var li = document.createElement("li");
  li.setAttribute("id", "row" + maxID);

  var content =
    '<select id="customFormulaElement' +
    maxID +
    '" name="customFormulaElement' +
    maxID +
    '" style="margin: 0; margin-right: 2%; margin-bottom: 10px; width: 25%; background-color:#D9D9D9; height:35px;"><option selected value=""></option><option value="C">C</option><option value="N">N</option><option value="H">H</option><option value="O">O</option><option value="CL">Cl</option></select>';

  content +=
    '<select id="customFormulaOperator' +
    maxID +
    '" name="customFormulaOperator' +
    maxID +
    '" style=" margin: 0; margin-bottom: 10px; margin-right: 2%;width: 21%; background-color:#D9D9D9; height:35px;"><option selected value=""></option><option value="lessThan"><</option><option value="greaterThan">></option><option value="equalTo">=</option></select>';

  content +=
    '<input id="customFormulaValue' +
    maxID +
    '" name="customFormulaValue' +
    maxID +
    '" type="number" step="1" size="4" style="width:25%;margin-bottom: 10px; margin-right: 5px;" autocomplete=off><span id="btA' +
    maxID +
    '"class="icon-plus" style="cursor: pointer; margin-top: 10px; margin-left: 4px; margin-right: 10px;" onclick="addRow(this)" ></span><span id="btD' +
    maxID +
    '"class="icon-remove" onclick="remRow(this)" style="cursor: pointer;" style="margin-top: 10px;">';

  divCon.innerHTML = content;
  li.appendChild(divCon);
  ul.appendChild(li);
}
