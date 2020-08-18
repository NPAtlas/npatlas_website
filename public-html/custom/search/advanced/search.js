const MAX_QUERY = 100000;
var maxID = 0;
function addRow() {
  maxID++;

  var buttonHTML = `<span id="btA${maxID}" class="icon-plus" style="cursor: pointer; margin-top: 10px; margin-right: 14px;" onclick="addRow(this)" ></span><span id="btD${maxID}" class="icon-remove" onclick="remRow(this)" style="cursor: pointer;" style="margin-top: 10px;">`;

  var valueHTML = `<div><input type="text" autocomplete=off name="value${maxID}" style="height:30px; width:100%; margin-bottom: 0px; position: relative;" class="form-control valueClass" id="value${maxID}"/></div>`;

  var operatorHTML = `<select id="operator${maxID}" name="selectOperator${maxID}" class="operatorClass"> <option selected value="">Select</option> <option></option> </select>`;

  var gateHTML = `
  <select class="gateClass" name="selectgate0${maxID}" id="gate${maxID}">
    <option selected value="">Select</option>
    <option value="and">AND</option>
    <option value="or">OR</option>
    <option value="not">NOT</option>
  </select>`;

  var fieldHTML = `
  <select class="fieldClass" name="selectField${maxID}" id="field${maxID}" onChange="updateField(this)">
    <option selected value="">Select</option>
    <option value="compID">Compound ID</option>
    <option value="clusterID">Cluster ID</option>
    <option value="nodeID">Node ID</option>
    <option value="compName">Compound Name</option>
    <option value="compInchi">InChI</option>
    <option value="inchiKey">InChI Key</option>
    <option value="molFormula">Molecular Formula</option>
    <option value="molWt">Molecular Weight</option>
    <option value="molAccMass">Accurate Mass</option>
    <option value="m_plus_H">[M+H]&#x207a;</option>
    <option value="m_plus_Na">[M+Na]&#x207a;</option>
    <option value="smiles">SMILES</option>
    <option value="author">Reference Authors</option>
    <option value="year">Reference Year</option>
    <option value="volume">Reference Volume</option>
    <option value="issue">Reference Issue</option>
    <option value="pages">Reference Pages</option>
    <option value="doi">Reference DOI</option>
    <option value="pmid">Reference PMID</option>
    <option value="refTitle">Reference Title</option>
    <option value="journalTitle">Journal Title</option>
    <option value="genus">Genus</option>
    <option value="species">Species</option>
    <option value="originType">Origin Type</option>
    <option value="hasSynthesis">Compound has Synthesis</option>
    <option value="hasReassignment">Compound has Reassignment</option>
    <option value="hasMIBIG">Compound has MIBIG</option>
    <option value="hasGNPS">Compound has GNPS</option>
    <option value="C">Element Count C</option>
    <option value="N">Element Count N</option>
    <option value="H">Element Count H</option>
    <option value="O">Element Count O</option>
    <option value="CL">Element Count Cl</option>
    <option value="S">Element Count S</option>
    <option value="B">Element Count B</option>
    <option value="P">Element Count P</option>
    <option value="BR">Element Count Br</option>
    <option value="F">Element Count F</option>
    <option value="I">Element Count I</option>
  </select>`;

  if (checkMobileView()) {
    var table = document.getElementById("myTableMobile");
    var row = table.insertRow(table.rows.length);
    row.id = "row" + maxID;
    var cell = row.insertCell(0);

    var innerTable = document.createElement("TABLE");

    cell.appendChild(innerTable);
    var innerTrow = table.insertRow(table.rows.length);
    var innerTcell = innerTrow.insertCell(0);
    innerTcell.style.width = "30%";
    innerTcell.innerHTML = "<label>And/Or/Not</label>";
    var innerTcell1 = innerTrow.insertCell(1);
    innerTcell1.style.width = "100%";
    innerTcell1.innerHTML = gateHTML;
    innerTable.appendChild(innerTrow);

    var innerTrow1 = table.insertRow(table.rows.length);
    var innerTcel2 = innerTrow1.insertCell(0);
    innerTcel2.style.width = "30%";
    innerTcel2.innerHTML = "<label>Field</label>";
    var innerTcell3 = innerTrow1.insertCell(1);

    innerTcell3.innerHTML = fieldHTML;
    innerTable.appendChild(innerTrow1);

    var innerTrow2 = table.insertRow(table.rows.length);
    var innerTcel4 = innerTrow2.insertCell(0);
    innerTcel4.style.width = "30%";
    innerTcel4.innerHTML = "<label>Operator</label>";
    var innerTcell5 = innerTrow2.insertCell(1);

    innerTcell5.innerHTML = operatorHTML;
    innerTable.appendChild(innerTrow2);

    var innerTrow3 = table.insertRow(table.rows.length);
    var innerTcel6 = innerTrow3.insertCell(0);
    innerTcel6.style.width = "30%";
    innerTcel6.innerHTML = "<label>Value</label>";
    var innerTcell7 = innerTrow3.insertCell(1);
    innerTcell7.style.width = "100%";
    innerTcell7.innerHTML = valueHTML;
    innerTable.appendChild(innerTrow3);

    var innerTrow4 = table.insertRow(table.rows.length);
    var innerTcel8 = innerTrow4.insertCell(0);

    var innerTcel9 = innerTrow4.insertCell(1);
    innerTcel9.innerHTML =
      '<span id="btA' +
      maxID +
      '"class="icon-plus" style="cursor: pointer;" onclick="addRow(this)" ></span><span id="btD' +
      maxID +
      '"class="icon-remove" onclick="remRow(this)" style="cursor: pointer; margin-left: 5%;">';
    innerTable.appendChild(innerTrow4);
  } else {
    var table = document.getElementById("myTable");
    var row = table.insertRow(table.rows.length);
    row.id = "row" + maxID;

    var cell = row.insertCell(0);
    cell.style.border = 0;
    cell.style.width = "10%";
    cell.innerHTML = gateHTML;

    var cell = row.insertCell(1);
    cell.style.border = 0;
    cell.style.width = "25%";

    cell.innerHTML = fieldHTML;

    var cell = row.insertCell(2);
    cell.style.border = 0;
    cell.style.width = "15%";
    cell.innerHTML = operatorHTML;

    var cell = row.insertCell(3);
    cell.style.border = 0;
    cell.style.width = "30%";
    cell.innerHTML = valueHTML;

    var cell = row.insertCell(4);
    cell.style.border = 0;
    cell.style.width = "5%";
    cell.innerHTML = buttonHTML;
  }
}

function remRow(input) {
  if (checkMobileView()) var table = document.getElementById("myTableMobile");
  else var table = document.getElementById("myTable");

  var i = parseInt(input.id.substring(3, input.id.length));
  var ind = table.rows["row" + i].rowIndex;
  table.deleteRow(ind);

  var tempGateValue = document.querySelector(
    'input[name="structureSearch"]:checked'
  ).value;
  if (tempGateValue == "false") {
    var maxLoop = maxID;
    if (table.rows.length > maxID) maxLoop = table.rows.length;

    for (var counter = 0; counter <= maxLoop; counter++) {
      if (jQuery("#gate" + counter).length) {
        jQuery("#gate" + counter)
          .find("option")
          .remove();
        jQuery("#gate" + counter).append(
          jQuery("<option>", {
            value: "",
            text: "Select",
          })
        );
        break;
      }
    }
  }
}

function updateField(row) {
  var $ = jQuery;

  var i = parseInt(row.id.substring(5, row.id.length));
  if (row.value.length == 0) {
    document.getElementById("operator" + i).innerHTML = "<option></option>";
  } else {
    var value = document.getElementById("field" + i).value;
    document.getElementById("value" + i).disabled = false;
    var tempHTML = "";
    if (
      value == "compID" ||
      value == "molWt" ||
      value == "molAccMass" ||
      value == "m_plus_H" ||
      value == "m_plus_Na" ||
      value == "clusterID" ||
      value == "nodeID" ||
      value == "referenceID" ||
      value == "year" ||
      value == "C" ||
      value == "N" ||
      value == "H" ||
      value == "O" ||
      value == "N" ||
      value == "CL" ||
      value == "S" ||
      value == "B" ||
      value == "P" ||
      value == "BR" ||
      value == "F" ||
      value == "I"
    ) {
      tempHTML =
        '<td style="border: 0px;width:15%"><select class="required operatorClass" name="selectOperator' +
        (i + 1) +
        '" id="operator' +
        (i + 1) +
        '" style="width:100%; background-color:#D9D9D9; height:30px; margin-bottom: 0px;">  <option  selected value="" id="">Select</option><option value="equalTo">=</option><option value="notEqualTo">!=</option><option value="lessThan"><</option><option value="greaterThan">></option><option value="greaterThanEqualTo">>=</option><option value="lessThanEqualTo"><=</option></select></td>';

      document.getElementById("operator" + i).innerHTML = tempHTML;
      $("#value" + i).typeahead("destroy");
    } else if (
      value == "compInchi" ||
      value == "inchiKey" ||
      value == "molFormula" ||
      value == "smiles" ||
      value == "doi" ||
      value == "pmid" ||
      value == "originType" ||
      value == "volume" ||
      value == "issue" ||
      value == "pages"
    ) {
      tempHTML =
        '<td style="border: 0px;width:15%"><select class="required operatorClass" name="selectOperator' +
        (i + 1) +
        '" id="operator' +
        (i + 1) +
        '" style="width:100%; background-color:#D9D9D9; height:30px; margin-bottom: 0px;">  <option  selected value="" id="">Select</option><option value="exactMatch">Exact Match</option></select></td>';

      document.getElementById("operator" + i).innerHTML = tempHTML;
      $("#value" + i).typeahead("destroy");

      if (value == "originType") {
        $("#value" + i).typeahead("destroy");
        autoComplete("value" + i, originNames);
      }
    } else if (
      value == "compName" ||
      value == "author" ||
      value == "journalTitle" ||
      value == "species" ||
      value == "refTitle" ||
      value == "genus" ||
      value == "abbrevation" ||
      value == "reassignmentDesc"
    ) {
      tempHTML =
        '<td style="border: 0px;width:15%"><select class="required operatorClass" name="selectOperator' +
        (i + 1) +
        '" id="operator' +
        (i + 1) +
        '" style="width:100%; background-color:#D9D9D9; height:30px; margin-bottom: 0px;">  <option  selected value="" id="">Select</option><option value="exactMatch">Exact Match</option><option value="StringSearch">String Search</option></select></td>';

      document.getElementById("operator" + i).innerHTML = tempHTML;

      if (value == "compName") {
        $("#value" + i).typeahead("destroy");
        autoComplete("value" + i, compoundNames);
      } else if (value == "species") {
        $("#value" + i).typeahead("destroy");
        autoComplete("value" + i, speciesNames);
      } else if (value == "genus") {
        $("#value" + i).typeahead("destroy");
        autoComplete("value" + i, genusNames);
      }
    } else if (
      value == "hasSynthesis" ||
      value == "hasReassignment" ||
      value == "hasGNPS" ||
      value == "hasMIBIG"
    ) {
      tempHTML =
        '<td style="border: 0px;width:15%"><select class="required operatorClass" name="selectOperator' +
        (i + 1) +
        '" id="operator' +
        (i + 1) +
        '" style="width:100%; background-color:#D9D9D9; height:30px; margin-bottom: 0px;">  <option  selected value="" id="">Select</option><option value="boolTrue">True</option><option value="boolFalse">False</option></select></td>';

      document.getElementById("operator" + i).innerHTML = tempHTML;
      // disable text input
      document.getElementById("value" + i).disabled = true;
    }
  }
}

function populateForm(storedSearchResultArr) {
  var arr = storedSearchResultArr["conditions"];
  if (arr.length > 3) {
    for (var i = 0; i < arr.length - 3; i++) addRow();
  }

  if (!storedSearchResultArr["structureSearch"]) {
    for (var i = 0; i < arr.length; i++) {
      document.getElementById("value" + i).value = arr[i]["value"];
      jQuery("#field" + i)
        .val(arr[i]["field"])
        .change();
      jQuery("#operator" + i).val(arr[i]["operator"]);
      jQuery("#gate" + i).val(arr[i]["gate"]);
    }
    processForm();
  } else {
    jQuery("#structureYesRadio").prop("checked", true);
    showMarvinEditor();
    if (storedSearchResultArr["search_options"]["searchType"] == "FULL")
      document.getElementById("full_structure").checked = true;
    else if (
      storedSearchResultArr["search_options"]["searchType"] == "SUBSTRUCTURE"
    )
      document.getElementById("substructure").checked = true;
    else if (
      storedSearchResultArr["search_options"]["searchType"] == "SIMILARITY"
    ) {
      document.getElementById("similarity").checked = true;
      jQuery("#threshold").val(
        storedSearchResultArr["search_options"]["similarity"]["threshold"]
      );
    }

    marvinSketcherInstance
      .importStructure(
        "smiles",
        storedSearchResultArr["search_options"]["queryStructure"]
      )
      .then(function () {
        for (var i = 0; i < arr.length; i++) {
          document.getElementById("value" + i).value = arr[i]["value"];
          jQuery("#field" + i)
            .val(arr[i]["field"])
            .change();
          jQuery("#operator" + i).val(arr[i]["operator"]);
          jQuery("#gate" + i).val(arr[i]["gate"]);
        }
        processForm();
      });
  }
}

var marvinSketcherInstance;

function checkMobileView() {
  if (jQuery(window).width() < 770) return true;
  else return false;
}

var minmax = {};
var currentVersion = "";
getCurrentVersion().then((dbVersion) => {
  currentVersion = dbVersion;
  axios.get("/api/v1/compounds/names/").then((resp) => {
    allCompCB(resp.data);
  });
  axios.get("/api/v1/taxon/genus/").then((resp) => {
    allGenusCB(resp.data);
  });
});

$(document).ready(function () {
  if (jQuery(window).width() < 770) {
    jQuery("#myTable").empty();
    jQuery("#myTable").remove();
  } else {
    jQuery("#myTableMobile").empty();
    jQuery("#myTableMobile").remove();
  }
  // Start with three rows
  addRow();
  addRow();
  jQuery("#resultBlock").hide();
  jQuery("#structureSearchDiv").hide();
  //  joomlaGetSession();

  MarvinJSUtil.getEditor("#sketch").then(
    function (sketcherInstance) {
      marvinSketcherInstance = sketcherInstance;

      // if results is present in the URL, that means we have to show the results, otherwise clear session storage
      if (window.location.hash.substring(1) == "results") {
        var storedAdvancedSearchResultArr = JSON.parse(
          sessionStorage.getItem("advancedSearchResults")
        );
        if (storedAdvancedSearchResultArr)
          populateForm(storedAdvancedSearchResultArr);
      } else sessionStorage.removeItem("advancedSearchResults");
    },
    function (error) {
      alert("Cannot retrieve sketcher instance from iframe:" + error);
    }
  );

  jQuery("#advancedSearchForm").on("submit", function (event) {
    event.preventDefault();

    var tempGateValue = document.querySelector(
      'input[name="structureSearch"]:checked'
    ).value;
    isTrueSet = false;
    if (tempGateValue == "true") isTrueSet = true;

    var maxLoop = maxID;
    if (checkMobileView()) var table = document.getElementById("myTableMobile");
    else var table = document.getElementById("myTable");

    if (table.rows.length > maxID) maxLoop = table.rows.length;
    // increment 1 to maxLoop so that if there is only 1 condition, blankRow == (maxLoop -1) should pass
    if (checkMobileView()) maxLoop = maxLoop + 1;

    var foundFirstGate = false;
    blankRow = 0;
    for (var counter = 0; counter <= maxLoop; counter++) {
      if (jQuery("#gate" + counter).length) {
        if (foundFirstGate == false) {
          foundFirstGate = true;
          rowOfGate = counter;
        }

        allBlank = true;
        var valueField = document.getElementById("field" + counter).value;
        if (!valueField) {
          var valueOperator = document.getElementById("operator" + counter)
            .value;
          if (!valueOperator) {
            var value = document.getElementById("value" + counter).value;
            if (!value) {
              var valueGate = document.getElementById("gate" + counter).value;
              if (!valueGate) {
              } else allBlank = false;
            } else allBlank = false;
          } else allBlank = false;
        } else allBlank = false;

        if (allBlank == false) {
          if (counter == rowOfGate) {
            jQuery("#gate" + counter).rules("add", { required: isTrueSet });
          } else jQuery("#gate" + counter).rules("add", { required: true });

          jQuery("#field" + counter).rules("add", { required: true });
          jQuery("#operator" + counter).rules("add", { required: true });
          jQuery("#value" + counter).rules("add", { required: true });
          jQuery("#value" + counter).rules("add", { required: true });
        } else {
          blankRow++;
          jQuery("#field" + counter).rules("remove");
          jQuery("#operator" + counter).rules("remove");
          jQuery("#value" + counter).rules("remove");
          jQuery("#gate" + counter).rules("remove");

          jQuery("#field" + counter).removeClass("error");
          jQuery("#operator" + counter).removeClass("error");
          jQuery("#value" + counter).removeClass("error");
          jQuery("#gate" + counter).removeClass("error");
        }
      }
    }
    var structure = false;
    if (blankRow == maxLoop - 1) {
      structureSearchRadio = document.querySelector(
        'input[name="structureSearch"]:checked'
      ).value;
      if (structureSearchRadio == "true") {
        PicToXMLString("#sketch", "smiles", smilesCallback);
        structure = true;
        function smilesCallback(smiles) {
          if (smiles) {
            if (jQuery("#advancedSearchForm").validate().form()) processForm();
          } else {
            jQuery("#noCriteria").show();
            jQuery("#searchQueryDiv").hide();
            jQuery("#errorCompoundID").hide();
            jQuery("#resultBlock").hide();
            jQuery("#zeroResultDiv").hide();
            return;
          }
        }
      } else {
        jQuery("#noCriteria").show();
        jQuery("#searchQueryDiv").hide();
        jQuery("#errorCompoundID").hide();
        jQuery("#resultBlock").hide();
        jQuery("#zeroResultDiv").hide();
        return;
      }
    }
    if (structure == false) {
      if (jQuery("#advancedSearchForm").validate().form()) {
        console.log("Form validated");
        processForm();
      } else console.log("Form not validated");
    }
  });
  jQuery("#advancedSearchForm").validate();

  jQuery("#btn-reset").on("click", function () {
    if (checkMobileView()) var table = document.getElementById("myTableMobile");
    else var table = document.getElementById("myTable");
    var maxLoop = maxID;
    if (table.rows.length > maxID) maxLoop = table.rows.length;
    for (var counter = 0; counter <= maxLoop; counter++) {
      if (document.getElementById("field" + counter)) {
        jQuery("#field" + counter).rules("remove");
        jQuery("#operator" + counter).rules("remove");
        jQuery("#value" + counter).rules("remove");
        jQuery("#gate" + counter).rules("remove");
      }
    }
  });

  jQuery("#demoTable")
    .tablesorter({
      theme: "green",
    })
    .tablesorterPager({
      container: jQuery(".pager"),
    });
});

function autoComplete(elementID, data) {
  var $ = jQuery;
  var $input = $("#" + elementID);
  $input.typeahead({
    source: data,
    autoSelect: false,
  });
}

function processForm() {
  structureSearchRadio = document.querySelector(
    'input[name="structureSearch"]:checked'
  ).value;
  if (structureSearchRadio == "true") {
    PicToXMLString("#sketch", "smiles", smilesCallback);

    function smilesCallback(smiles) {
      if (smiles) {
        searchType = document.querySelector('input[name="search_type"]:checked')
          .value;
        if (searchType == "SIMILARITY") {
          var threshold = document.getElementById("threshold").value;
          var search_options = {
            queryStructure: smiles,
            searchType: "SIMILARITY",
            similarity: { descriptor: "CFP", threshold: threshold },
          };
        } else
          var search_options = {
            queryStructure: smiles,
            searchType: searchType,
          };

        formQueryCallWB(search_options, smiles, searchType);
      }
    }
  } else formQueryCallWB();
}

function formQueryCallWB(search_options, smiles, searchType) {
  var $ = jQuery;

  var tempArray = [];
  var tempArrayUser = [];
  var gate = "";
  var maxLoop = maxID;
  if (checkMobileView()) var table = document.getElementById("myTableMobile");
  else var table = document.getElementById("myTable");

  if (table.rows.length > maxID) maxLoop = table.rows.length;
  var arraySize = 0;
  var conditionsArr = [];
  var tempArrSession = [];
  for (var counter = 0; counter <= maxLoop; counter++) {
    field = "";
    operator = "";
    value = "";
    gate = "";
    if (document.getElementById("field" + counter)) {
      field = webServiceMap[document.getElementById("field" + counter).value];
      fieldForSession = document.getElementById("field" + counter).value;
    }
    if (document.getElementById("operator" + counter)) {
      operator =
        webServiceMap[document.getElementById("operator" + counter).value];
      operatorForSession = document.getElementById("operator" + counter).value;
    }
    if (document.getElementById("value" + counter))
      value = document.getElementById("value" + counter).value;

    if (document.getElementById("gate" + counter)) {
      gate = webServiceMap[document.getElementById("gate" + counter).value];
      gateForSession = document.getElementById("gate" + counter).value;
    }

    if (!gate) gate = "";

    if (field) {
      // forming the input for sessionstorage
      var tempObj = {};
      tempObj.gate = gate;
      tempObj.field = field;
      tempObj.operator = operator;
      tempObj.value = value;
      conditionsArr.push(tempObj);

      // back to normal advanced search
      tempArray[arraySize] = [];
      tempArrayUser[arraySize] = [];
      var e = document.getElementById("field" + counter);
      var text1 = e.options[e.selectedIndex].text;

      if (field == "compound_id") {
        var response = compoundIDCheck(value);
        if (response == -1) {
          // there is some problem, need to see what to do here
          jQuery("#errorCompoundID").show();
          jQuery("#zeroResultDiv").hide();
          jQuery("#resultBlock").hide();
          jQuery("#noCriteria").hide();
          return;
        } else {
          jQuery("#noCriteria").hide();
          jQuery("#errorCompoundID").hide();
          jQuery("#zeroResultDiv").hide();
          jQuery("#resultBlock").show();
          jQuery("#searchQueryDiv").show();
          if (field) {
            tempArray[arraySize].push(gate, field, operator, response);

            var tempObj = {
              field: fieldForSession,
              gate: gateForSession,
              operator: operatorForSession,
              value: value,
            };
            tempArrSession.push(tempObj);

            tempArrayUser[arraySize].push(
              document.getElementById("gate" + counter).value,
              text1,
              document.getElementById("operator" + counter).value,
              value
            );
            arraySize++;
          }
        }
      } else {
        tempArray[arraySize].push(gate, field, operator, value);
        tempArrayUser[arraySize].push(
          document.getElementById("gate" + counter).value,
          text1,
          document.getElementById("operator" + counter).value,
          value
        );
        arraySize++;

        var tempObj = {
          field: fieldForSession,
          gate: gateForSession,
          operator: operatorForSession,
          value: value,
        };
        tempArrSession.push(tempObj);
      }
    }
  }
  console.log(tempArrSession);
  // joomlaSetSession(tempArrSession);

  // console.log(conditionsArr);

  // string + string1 are for building query string
  // outputString is output of advanced search query
  // string1 ultimately gets sent to query
  var string = "";
  string1 = "";
  outputString = "";

  if (searchType) outputString = "(" + searchType + " search)";

  // Build the query string to send to Marvin Webservices
  // tempArray -- 0: gate, 1: field, 2: operator, 3: value
  for (var counter = 0; counter <= tempArray.length - 1; counter++) {
    let gate = tempArray[counter][0];
    let field = tempArray[counter][1];
    let operator = tempArray[counter][2];
    let value = tempArray[counter][3];

    // Boolean True
    if (operator === "$eq1") {
      operator = "$eq";
      value = 1;
      // Boolean False
    } else if (operator === "$eq0") {
      operator = "$eq";
      value = 0;
    }

    // Not equal
    if (operator === "$neq") {
      string = '{"$not":{"' + field + '":{"$eq":"' + value + '"}}}';
      // AND NOT condition
    } else if (gate === "$not") {
      string =
        '{"$not":{"' + field + '":{"' + operator + '":"' + value + '"}}}';
      gate = "$and";
      // All else
    } else {
      string = '{"' + field + '":{"' + operator + '":"' + value + '"}}';
    }

    if (gate) {
      // add the gate before adding the next condition to the output shown to user
      outputString =
        "(" + outputString + "  " + tempArrayUser[counter][0] + "  ";
    }
    outputString =
      outputString +
      "(" +
      tempArrayUser[counter][1] +
      "  " +
      tempArrayUser[counter][2] +
      "  " +
      tempArrayUser[counter][3];
    if (counter == 0 && searchType) outputString = outputString + "))";
    else outputString = outputString + ")";
    if (!string1) string1 = string;
    else {
      string1 = string + "," + string1;
      outputString = outputString + ")"; // add this to close the condition
    }

    // add the gate to the condition for webservice call
    if (gate) {
      string1 = '{"' + gate + '":[' + string1 + "]}";
    }
  }
  console.log(string1);
  console.log("output to be shown to user " + outputString);
  document.getElementById("searchQueryUserFormat").value = outputString;

  if (string1) var conditions = JSON.parse(string1);
  else var conditions = "";

  if (!smiles) smiles = "";
  if (!search_options) {
    search_options = { queryStructure: smiles, searchType: "FULL" };
    sessionStorage.setItem(
      "advancedSearchResults",
      JSON.stringify({ conditions: tempArrSession })
    );
  } else {
    sessionStorage.setItem(
      "advancedSearchResults",
      JSON.stringify({
        conditions: tempArrSession,
        structureSearch: "true",
        search_options: search_options,
      })
    );
  }

  var params = buildParamsWebServiceCall(
    search_options,
    0,
    MAX_QUERY,
    conditions,
    ""
  );

  getResult(
    "",
    "",
    "",
    MAX_QUERY,
    "",
    "",
    CBResults,
    false,
    false,
    params,
    "#popup",
    currentVersion
  );
}

/*
// tried using joomla session from https://www.ostraining.com/blog/how-tos/development/how-to-use-sessions-in-joomla/
// https://stackoverflow.com/questions/23544091/fatal-error-class-jfactory-not-found-in-joomla-3-3
// https://stackoverflow.com/questions/8471945/how-can-you-use-php-in-a-javascript-function
// https://www.google.ca/search?q=joomla+session+storage&rlz=1C1CHBF_enCA789CA789&oq=joomla+session+&aqs=chrome.1.69i57j69i59j0l4.4207j0j7&sourceid=chrome&ie=UTF-8


function joomlaSetSession(tempArrSession){
  var tempJSON = JSON.stringify(tempArrSession);
  jQuery.post('/custom/search/advanced/script2.php', { num: tempJSON});
}

function joomlaGetSession(){
  jQuery.post('/custom/search/advanced/script.php', function(result) {
    console.log(result);
  });
}
*/
function CBResults(response) {
  var $ = jQuery;
  var dataArray = response.data;
  resultArray_global = dataArray;
  if (response == 400) {
    $("#dialogSearchError").show();
    jQuery("#resultBlock").hide();
    jQuery("#zeroResultDiv").hide();
  } else {
    if (dataArray.length > 0) {
      //    var totalResultsDiv=document.getElementById("totalResults");
      //    totalResultsDiv.innerHTML = "Total number of results : " + dataArray.length;
      window.location.hash = "#results";
      for (var checkCounter = 1; checkCounter <= 21; checkCounter++)
        $("#checkbox" + checkCounter).prop("checked", true);

      $("#checkAll").prop("checked", true);

      $("#resultBlock").show();
      $("#columnList").show();
      $("#downImg").hide();
      jQuery("#zeroResultDiv").hide();

      var table_container = "";
      $("#demoTable").trigger("destroyPager");
      jQuery("#demoTable").remove();
      jQuery("#demoTable").trigger("destroy");
      jQuery("#demoTable").trigger("updateAll");

      table_container = document.createElement("table");
      table_container.setAttribute("id", "demoTable");
      table_container.setAttribute(
        "class",
        "tablesorter table-bordered table-striped"
      );
      table_container.style.marginTop = "0";
      var header = table_container.createTHead();
      var line = document.createElement("tr");
      line.setAttribute("class", "sticky-row");
      var th = document.createElement("th");

      if (!checkMobileView()) th.setAttribute("class", "sticky-cell");

      th.innerHTML = "Compound ID";
      line.appendChild(th);

      var th = document.createElement("th");

      if (!checkMobileView()) th.setAttribute("class", "sticky-cell");
      // No longer necessary with new Grid column selection list
      // else {
      //   jQuery('#columnListMobile').show();
      //   jQuery('#columnList').empty();
      //   jQuery('#columnList').remove();
      // }

      th.innerHTML = "Compound Name";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Cluster ID";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Node ID";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "InChI";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "InChI Key";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Molecular Formula";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Molecular Weight";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Accurate Mass";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "[M+H]<sup>+</sup>";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "[M+Na]<sup>+</sup>";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "SMILES";
      th.style.textAlign = "center";
      line.appendChild(th);
      //  var th=document.createElement("th");th.innerHTML="Isolation Reference";line.appendChild(th);
      //  var th=document.createElement("th");th.innerHTML="Reference ID";line.appendChild(th);

      var th = document.createElement("th");
      th.innerHTML = "Reference Authors";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Journal Title";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference Year";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference Volume";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference Issue";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference Pages";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference DOI";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference PMID";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reference Title";
      th.style.textAlign = "center";
      line.appendChild(th);
      //  var th=document.createElement("th");th.innerHTML="Reference Type Name";line.appendChild(th);
      //  var th=document.createElement("th");th.innerHTML="Journal Abbrevation";line.appendChild(th);

      var th = document.createElement("th");
      th.innerHTML = "Genus";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Species";
      th.style.textAlign = "center";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Origin Type";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Reassignment?";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "Synthesis?";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "MIBiG?";
      line.appendChild(th);
      var th = document.createElement("th");
      th.innerHTML = "GNPS?";
      line.appendChild(th);
      //  var th=document.createElement("th");th.innerHTML="Reassignment Description";th.title="reassignment type (configurational, structural etc)";line.appendChild(th);

      header.appendChild(line);

      divContainer = document.getElementById("table-wrapper");
      divContainer.appendChild(table_container);
      var html = "";
      for (var i = 0; i < dataArray.length; i++) {
        var compound_has_reassignment = false;
        if (dataArray[i].compound_has_reassignment == 0)
          compound_has_reassignment = false;
        else compound_has_reassignment = true;

        var npa_id =
          "NPA" + results.data[i].compound_id.toString().padStart(6, "0");

        if (jQuery(window).width() < 770) {
          html += `<tr class="paginate">
          <td title="${npa_id}">
            <div class="compIDResTable">
              <a href="/joomla/index.php/explore/compounds#npaid=${npa_id}">${npa_id}</a>
            </div>
          </td>
          <td title="${dataArray[i].compound_names}">
            <div class="compNameResTable">${dataArray[i].compound_names}</div>
          </td>`;
        } else {
          html += `<tr class="paginate">
          <td class="sticky-cell" title = "${npa_id}">
            <div class="compIDResTable">
              <a href="/joomla/index.php/explore/compounds#npaid=${npa_id}">${npa_id}</a>
            </div>
          </td>
          <td class="sticky-cell" title="${dataArray[i].compound_names}">
            <div class="compNameResTable">${dataArray[i].compound_names}</div>
          </td>`;
        }

        html += `<td title="${dataArray[i].compound_cluster_id}">
          <div class="clusterIDResTable">
            <a href="/joomla/index.php/explore/clusters#clusterID=${
              dataArray[i].compound_cluster_id
            }">${dataArray[i].compound_cluster_id}</a>
          </div>
          </td>
          <td title="${dataArray[i].compound_node_id}">
            <div class="clusterIDResTable">
              <a href="/joomla/index.php/explore/nodes#nodeID=${
                dataArray[i].compound_node_id
              }">${dataArray[i].compound_node_id}</a>
            </div>
          </td>
          <td title="${dataArray[i].compound_inchi}">
            <div style="width : 350px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;";>${
              dataArray[i].compound_inchi
            }</div>
          </td>
          <td title="${dataArray[i].compound_inchikey}">${
          dataArray[i].compound_inchikey
        }</td>
          <td title="${dataArray[i].compound_molecular_formula}">${
          dataArray[i].compound_molecular_formula
        }</td>
          <td title="${dataArray[i].compound_molecular_weight.toFixed(
            2
          )}">${dataArray[i].compound_molecular_weight.toFixed(2)}</td>
          <td title="${dataArray[i].compound_accurate_mass.toFixed(
            4
          )}">${dataArray[i].compound_accurate_mass.toFixed(4)}</td>
          <td title="${dataArray[i].compound_m_plus_h.toFixed(4)}">${dataArray[
          i
        ].compound_m_plus_h.toFixed(4)}</td>
          <td title="${dataArray[i].compound_m_plus_na.toFixed(4)}">${dataArray[
          i
        ].compound_m_plus_na.toFixed(4)}</td>
          <td title="${dataArray[i].compound_smiles}">
            <div style="width : 400px; overflow: hidden;  text-overflow: ellipsis;white-space: nowrap;";>${
              dataArray[i].compound_smiles
            }</div>
          </td>
          <td title="${dataArray[i].original_reference_author_list}">
            <div style="width : 500px; overflow: hidden; text-overflow: ellipsis;white-space: nowrap;";>${
              dataArray[i].original_reference_author_list
            }</div>
          </td>
          <td title="${dataArray[i].original_journal_title}">
            <div style="width : 200px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">${
              dataArray[i].original_journal_title
            }</div>
          </td>
          <td title="${dataArray[i].original_reference_year}">${
          dataArray[i].original_reference_year
        }</td>
          <td title="${dataArray[i].original_reference_volume}">${
          dataArray[i].original_reference_volume
        }</td>
          <td title="${dataArray[i].original_reference_issue}">${
          dataArray[i].original_reference_issue
        }</td>
          <td title="${dataArray[i].original_reference_pages}">${
          dataArray[i].original_reference_pages
        }</td>
          <td title="${dataArray[i].original_reference_doi}">${
          dataArray[i].original_reference_doi
        }</td>
          <td title="${dataArray[i].original_reference_pmid}">${
          dataArray[i].original_reference_pmid
        }</td>
          <td title ="${dataArray[i].original_reference_title}">
            <div style="width : 400px; overflow: hidden;  text-overflow: ellipsis;white-space: nowrap;";>${
              dataArray[i].original_reference_title
            }</div>
          </td>
          <td title="${dataArray[i].genus}">${dataArray[i].genus}</td>
          <td title="${dataArray[i].origin_species}s">${
          dataArray[i].origin_species
        }</td>
          <td title="${dataArray[i].origin_type}"><div style="width:100px;">${
          dataArray[i].origin_type
        }</div></td>
          <td title="${dataArray[i].compound_has_reassignment}">${
          dataArray[i].compound_has_reassignment
        }</td>
          <td title="${dataArray[i].compound_has_synthesis}">${
          dataArray[i].compound_has_synthesis
        }</td>
          <td title="${dataArray[i].compound_has_mibig}">${
          dataArray[i].compound_has_mibig
        }</td>
          <td title="${dataArray[i].compound_has_gnps}">${
          dataArray[i].compound_has_gnps
        }</td>
        </tr>`;
      }

      var tbody = table_container.createTBody();
      tbody.innerHTML = html;
      table_container.appendChild(tbody);

      jQuery("#demoTable")
        .tablesorter({
          theme: "green",
        })
        .tablesorterPager({
          container: jQuery(".pager"),
        });
    } else {
      jQuery("#resultBlock").hide();
      jQuery("#columnList").hide();
      jQuery("#downImg").hide();
      jQuery("#zeroResultDiv").show();
    }
  }
}

function hideAllColumn() {
  var value = {};
  jQuery("#popup").show();
  if (jQuery("#checkAll").is(":checked")) {
    jQuery("input:checkbox").attr("checked", true);
    for (var i = 3; i < 30; i++) {
      value["checked"] = true;
      hideColumn(value, i);
    }
  } else {
    jQuery("input:checkbox").attr("checked", false);

    for (var i = 3; i < 30; i++) {
      value["checked"] = false;
      hideColumn(value, i);
    }
  }
  jQuery("#popup").hide();
}

function hideColumn(value, columnNumber) {
  if (value.checked == false)
    jQuery(
      "#demoTable td:nth-child(" +
        parseInt(columnNumber) +
        "),#demoTable th:nth-child(" +
        parseInt(columnNumber) +
        ")"
    ).hide();
  else
    jQuery(
      "#demoTable td:nth-child(" +
        parseInt(columnNumber) +
        "),#demoTable th:nth-child(" +
        parseInt(columnNumber) +
        ")"
    ).show();
}

function columnListRes(property) {
  if (property == "show") {
    jQuery("#downImg").hide();
    jQuery("#upImg").show();
    jQuery("#columnList").show();
  } else {
    jQuery("#columnList").hide();
    jQuery("#downImg").show();
    jQuery("#upImg").hide();
  }
}

function switchColumnsDisp() {
  if (jQuery("#columnList").css("display") == "none") {
    jQuery("#columnList").show();
    jQuery("#downImg").hide();
    jQuery("#upImg").show();
  } else {
    jQuery("#columnList").hide();
    jQuery("#downImg").show();
    jQuery("#upImg").hide();
  }
}

function allCompCB(data) {
  if (data == 400) {
    jQuery("#dialogLoadingPageError").show();
  } else {
    data.forEach(function (tempComp) {
      compoundNames.push(tempComp[1]);
    });
  }
}

function allGenusCB(data) {
  if (data == 400) {
    jQuery("#dialogLoadingPageError").show();
  } else {
    data.forEach(function (tempComp) {
      genusNames.push(tempComp[0]);
    });
  }
}

function allSpeciesCB(data) {
  if (data == 400) {
    jQuery("#dialogLoadingPageError").show();
  } else {
    data.forEach(function (tempComp) {
      speciesNames.push(tempComp[0]);
    });
  }
}

function showMarvinEditor() {
  jQuery("#structureSearchDiv").show();
  if (checkMobileView()) var table = document.getElementById("myTableMobile");
  else var table = document.getElementById("myTable");
  var maxLoop = maxID;
  if (table.rows.length > maxID) maxLoop = table.rows.length;

  for (var counter = 0; counter <= maxLoop; counter++) {
    if (jQuery("#gate" + counter).length) {
      jQuery("#gate" + counter).append(
        jQuery("<option>", {
          value: "and",
          text: "AND",
        })
      );
      jQuery("#gate" + counter).append(
        jQuery("<option>", {
          value: "or",
          text: "OR",
        })
      );
      jQuery("#gate" + counter).append(
        jQuery("<option>", {
          value: "not",
          text: "NOT",
        })
      );
      break;
    }
  }
}

function hideMarvinEditor() {
  jQuery("#structureSearchDiv").hide();
  if (checkMobileView()) var table = document.getElementById("myTableMobile");
  else var table = document.getElementById("myTable");
  var maxLoop = maxID;
  if (table.rows.length > maxID) maxLoop = table.rows.length;

  for (var counter = 0; counter <= maxLoop; counter++) {
    if (jQuery("#gate" + counter).length) {
      jQuery("#gate" + counter)
        .find("option")
        .remove();
      jQuery("#gate" + counter).append(
        jQuery("<option>", {
          value: "",
          text: "Select",
        })
      );
      break;
    }
  }
}

function resetMarvinEditor() {
  MarvinJSUtil.getEditor("#sketch").then(
    function (sketcherInstance) {
      marvinSketcherInstance = sketcherInstance;
      marvinSketcherInstance.clear();
    },
    function (error) {
      alert("Cannot retrieve sketcher instance from iframe:" + error);
    }
  );
}

function closeLoadingPageErrorPopup() {
  jQuery("#dialogLoadingPageError").hide();
}

function closeSearchErrorPopup() {
  jQuery("#dialogSearchError").hide();
}

function resetForm() {
  document.getElementById("advancedSearchForm").reset();
  hideMarvinEditor();
  jQuery("#resultBlock").hide();
  jQuery("#searchQueryDiv").hide();

  MarvinJSUtil.getEditor("#sketch").then(
    function (sketcherInstance) {
      marvinSketcherInstance = sketcherInstance;
      marvinSketcherInstance.clear();
    },
    function (error) {
      alert("Cannot retrieve sketcher instance from iframe:" + error);
    }
  );

  sessionStorage.removeItem("advancedSearchResults");
}

function exportResults() {
  var counter = 0;
  var compData = [];
  var counter = resultArray_global.length;

  for (var i = 0; i < counter; i++) {
    var npa_id =
      "NPA" + resultArray_global[i].compound_id.toString().padStart(6, "0");
    var tempCompData = {
      "NPA ID": npa_id,
      "CLUSTER ID": resultArray_global[i].compound_cluster_id,
      "NODE ID": resultArray_global[i].compound_node_id,
      "NAME(S)": resultArray_global[i].compound_names,
      FORMULA: resultArray_global[i].compound_molecular_formula,
      "MOLECULAR WEIGHT": resultArray_global[i].compound_molecular_weight,
      "ACCURATE MASS": resultArray_global[i].compound_accurate_mass,
      GENUS: resultArray_global[i].genus,
      "ORIGIN TYPE": resultArray_global[i].origin_type,
      INCHIKEY: resultArray_global[i].compound_inchikey,
      INCHI: resultArray_global[i].compound_inchi,
      SMILES: resultArray_global[i].compound_smiles,
      "M PLUS H": resultArray_global[i].compound_m_plus_h,
      "M PLUS Na": resultArray_global[i].compound_m_plus_na,
      "REFERENCE VOLUME": resultArray_global[i].original_reference_volume,
      "REFERENCE YEAR": resultArray_global[i].original_reference_year,
      "REFERENCE ISSUE": resultArray_global[i].original_reference_issue,
      "REFERENCE AUTHORS": resultArray_global[i].original_reference_author_list,
      "REFERENCE PAGES": resultArray_global[i].original_reference_pages,
      "REFERENCE DOI": resultArray_global[i].original_reference_doi,
      "REFERENCE PMID": resultArray_global[i].original_reference_pmid,
      "REFERENCE TITLE": resultArray_global[i].original_reference_title,
      "REFERENCE TYPE NAME": resultArray_global[i].original_reference_type,
      "JOURNAL TITLE": resultArray_global[i].original_journal_title,
      SPECIES: resultArray_global[i].origin_species,
      GENUS: resultArray_global[i].genus,
      "ORIGIN TYPE": resultArray_global[i].origin_type,
      "COMPOUND HAS REASSIGNMENT":
        resultArray_global[i].compound_has_reassignment,
      COMPOUND_HAS_SYNTHESIS: resultArray_global[i].compound_has_synthesis,
      COMPOUND_HAS_MIBIG: resultArray_global[i].compound_has_mibig,
      COMPOUND_HAS_GNPS: resultArray_global[i].compound_has_gnps,
    };
    compData.push(tempCompData);
  }

  downloadCSVBrowser({ data: compData });
}

var compoundNames = [];
var genusNames = [];
var speciesNames = [];
var webServiceMap = {};
var resultArray_global = [];
var originNames = ["Bacterium", "Fungus"];

webServiceMap["molWt"] = "compound_molecular_weight";
webServiceMap["compID"] = "compound_id";
webServiceMap["clusterID"] = "compound_cluster_id";
webServiceMap["nodeID"] = "compound_node_id";
webServiceMap["compName"] = "compound_names";
webServiceMap["compInchi"] = "compound_inchi";
webServiceMap["inchiKey"] = "compound_inchikey";
webServiceMap["molFormula"] = "compound_molecular_formula";
webServiceMap["molAccMass"] = "compound_accurate_mass";
webServiceMap["m_plus_H"] = "compound_m_plus_h";
webServiceMap["m_plus_Na"] = "compound_m_plus_na";
webServiceMap["smiles"] = "compound_smiles";
webServiceMap["referenceID"] = "";
webServiceMap["author"] = "original_reference_author_list";
webServiceMap["year"] = "original_reference_year";
webServiceMap["volume"] = "original_reference_volume";
webServiceMap["issue"] = "original_reference_issue";
webServiceMap["pages"] = "original_reference_pages";
webServiceMap["doi"] = "original_reference_doi";
webServiceMap["pmid"] = "original_reference_pmid";
webServiceMap["refTitle"] = "original_reference_title";
webServiceMap["typeName"] = "original_reference_type";
webServiceMap["abbrevation"] = "original_journal_abbreviation";
webServiceMap["journalTitle"] = "original_journal_title";
webServiceMap["species"] = "origin_species";
webServiceMap["genus"] = "genus";
webServiceMap["originType"] = "origin_type";
webServiceMap["hasReassignment"] = "compound_has_reassignment";
webServiceMap["hasSynthesis"] = "compound_has_synthesis";
webServiceMap["hasMIBIG"] = "compound_has_mibig";
webServiceMap["hasGNPS"] = "compound_has_gnps";
webServiceMap["reassignmentDesc"] = "reassignment_description";
webServiceMap["C"] = "number_C";
webServiceMap["N"] = "number_N";
webServiceMap["H"] = "number_H";
webServiceMap["O"] = "number_O";
webServiceMap["CL"] = "number_CL";
webServiceMap["S"] = "number_S";
webServiceMap["B"] = "number_B";
webServiceMap["P"] = "number_P";
webServiceMap["BR"] = "number_BR";
webServiceMap["F"] = "number_F";
webServiceMap["I"] = "number_I";

webServiceMap["equalTo"] = "$eq";
webServiceMap["lessThanEqualTo"] = "$lte";
webServiceMap["lessThan"] = "$lt";
webServiceMap["greaterThan"] = "$gt";
webServiceMap["greaterThanEqualTo"] = "$gte";
webServiceMap["notEqualTo"] = "$neq";

webServiceMap["and"] = "$and";
webServiceMap["or"] = "$or";
webServiceMap["not"] = "$not";

webServiceMap["exactMatch"] = "$eq";
webServiceMap["StringSearch"] = "$contains";
// Bool operators caucht in formQueryCallWB
webServiceMap["boolTrue"] = "$eq1";
webServiceMap["boolFalse"] = "$eq0";
