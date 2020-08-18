// Constant for defining host
var ws_host = "http://localhost";

var webServiceResultArray = [];
var basicSearchCurrentPageNo = "";
var basicSearchTotalResults = 0;

var userSelectedVersion_global = "";
async function getResult(
  smiles,
  page,
  nb_pages,
  limit,
  pagi_id1,
  pagi_id2,
  callback,
  isExport,
  isBasicSearch,
  params,
  divID,
  dbVersion
) {
  if (dbVersion === "") {
    dbVersion = await getCurrentVersion();
  }
  jQuery(divID).show();
  if (isBasicSearch) {
    basicSearchCurrentPageNo = page;

    //first encode parameters of the search
    var form_data = objectifyForm("basicsearch");
    if (isExport)
      params = webservices_params(
        form_data,
        smiles,
        (parseInt(page) - 1) * 10,
        limit
      );
    else {
      params = webservices_params(
        form_data,
        smiles,
        (parseInt(page) - 1) * limit,
        limit
      );
      var currentPageNo = {};
      currentPageNo["BasicSearch"] = page;
      sessionStorage.setItem("BSCurrentPageNo", JSON.stringify(currentPageNo));
    }
  }

  if (!jQuery.isEmptyObject(params) && jQuery.isEmptyObject(params.error)) {
    // perform the search
    var xhr = new XMLHttpRequest();
    console.log("Data fetching starts: " + Date.now());
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        //the response is ready
        jQuery(divID).hide();
        if (isBasicSearch)
          document.getElementById("no_results").style.display = "none";

        results = JSON.parse(xhr.responseText);
        console.log("Data fetching over: " + Date.now());
        //   webServiceResultArray.push(results);
        var total = results.total;
        console.log(total);
        basicSearchTotalResults = total;
        var nb_pages = Math.ceil(parseInt(total) / parseInt(limit));
        console.log("nb_pages: ", nb_pages);
        callback(
          results,
          smiles,
          page,
          nb_pages,
          limit,
          pagi_id1,
          pagi_id2,
          200
        );
      } else if (xhr.readyState == 4 && xhr.status == 400) {
        jQuery(divID).hide();
        callback(400);
      }
    };
    xhr.open(
      "POST",
      `${ws_host}/webservices2/rest-v0/data/JCHEM_NPAtlas/table/search_${dbVersion}/search`,
      true
    );
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.send(JSON.stringify(params));
  } else {
    jQuery(divID).hide();
    param_error(params);
  }
}

function buildParamsWebServiceCall(
  search_options,
  offset,
  limit,
  conditions,
  error
) {
  var params = "";

  if (error) params = { error: error };
  else {
    params = {
      searchOptions: search_options,
      paging: { offset: offset, limit: limit },
      filter: {
        conditions: conditions,
        orderBy: "compound_id",
      },
      display: {
        include: [
          "cd_id",
          "cd_molweight",
          "npa_id",
          "compound_id",
          "compound_names",
          "compound_molecular_formula",
          "compound_molecular_weight",
          "compound_accurate_mass",
          "genus",
          "origin_type",
          "compound_inchikey",
          "compound_inchi",
          "compound_smiles",
          "compound_cluster_id",
          "compound_node_id",
          "origin_species",
          "original_reference_author_list",
          "original_reference_year",
          "original_reference_issue",
          "original_reference_volume",
          "original_reference_pages",
          "original_reference_doi",
          "original_reference_pmid",
          "original_reference_title",
          "original_reference_type",
          "original_journal_title",
          "original_journal_abbreviation",
          "reassignment_description",
          "compound_m_plus_h",
          "compound_m_plus_na",
          "compound_has_reassignment",
          "compound_has_synthesis",
          "compound_has_mibig",
          "compound_has_gnps",
        ],
      },
    };
  }
  return params;
}
function PicToXMLString(divID, type, cb) {
  var marvinSketcherInstance;
  var p = MarvinJSUtil.getEditor(divID);

  return p.then(
    function (sketcherInstance) {
      marvinSketcherInstance = sketcherInstance;
      marvinSketcherInstance.exportStructure(type).then(function (source) {
        cb(source);
      });
    },
    function (error) {
      alert("Molecule export failed:" + error);
    }
  );
}
// to send mail from correction page
function sendMail(
  correctionsData,
  userName,
  userEmail,
  structurePicture,
  cb,
  divID
) {
  jQuery(divID).show();
  var xhr_mail = new XMLHttpRequest();
  xhr_mail.onreadystatechange = function () {
    if (xhr_mail.readyState == 4 && xhr_mail.status == 200) {
      jQuery(divID).hide();
      var message = xhr_mail.responseText;
      console.log(message);
      cb(message);
    } else if (xhr_mail.readyState == 4 && xhr_mail.status == 400) {
      cb(400);
    }
  };
  xhr_mail.open("POST", "/custom/corrections/php/sendMailPost.php", true);
  xhr_mail.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr_mail.send(
    JSON.stringify({
      correctionsJSON: JSON.stringify(correctionsData),
      userName: userName,
      userEmail: userEmail,
      structurePicture: structurePicture,
    })
  );
}

function molToPNG(mol, cb) {
  var picture_params = JSON.stringify({
    structure: mol,
    parameters: "png:w200,h200,b32",
  });
  var xhr_picture = new XMLHttpRequest();
  xhr_picture.onreadystatechange = function () {
    if (xhr_picture.readyState == 4 && xhr_picture.status == 200) {
      var resp = JSON.parse(xhr_picture.responseText);
      console.log("resp:", resp);
      //	var structurePicture = "<img alt=''  src='data:image/png;base64,"+resp['binaryStructure']+"'>";
      cb(resp["binaryStructure"]);
    }
  };
  xhr_picture.open(
    "POST",
    `${ws_host}/webservices2/rest-v0/util/calculate/molExport`,
    true
  );
  xhr_picture.setRequestHeader(
    "Content-Type",
    "application/json;charset=UTF-8"
  );
  xhr_picture.send(picture_params);
}

function compoundIDCheck(npaID) {
  var npaid_regex = new RegExp("^(NPA|npa)[0-9]{1,6}$");
  var digits_regex = new RegExp("^[0-9]{1,6}$");

  if (npaid_regex.test(npaID) || digits_regex.test(npaID)) {
    if (npaid_regex.test(npaID)) var id = npaID.match(/\d+/g).map(Number);
    else var id = parseInt(npaID);

    return id;
  } else return -1;
}

function downloadCSVBrowser(args) {
  var data, link;

  var csv = convertArrayOfObjectsToCSV({
    data: args.data,
  });
  if (csv == null) return;
  const date = new Date();
  var filename = `np_atlas_export_${date.toISOString()}.tsv`;
  if (args.npaid) filename = `${args.npaid}_${date.toISOString()}.tsv`;

  /*    if (!csv.match(/^data:text\/csv/i)) {
    csv = 'data:text/csv;charset=utf-8,' + csv;
  } */

  var blob = new Blob([csv], { type: "text/plain" });
  var url = window.URL.createObjectURL(blob);
  var a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function convertArrayOfObjectsToCSV(args) {
  var result, ctr, keys, columnDelimiter, lineDelimiter, data;

  data = args.data || null;
  if (data == null || !data.length) {
    return null;
  }

  columnDelimiter = args.columnDelimiter || "\t";
  lineDelimiter = args.lineDelimiter || "\n";

  keys = Object.keys(data[0]);

  result = "";
  result += keys.join(columnDelimiter);
  result += lineDelimiter;

  data.forEach(function (item) {
    ctr = 0;
    keys.forEach(function (key) {
      if (ctr > 0) result += columnDelimiter;

      result += item[key];
      ctr++;
    });
    result += lineDelimiter;
  });

  return result;
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

function getCurrentVersion() {
  return new Promise(function (resolve, reject) {
    userSelectedVersion_global = sessionStorage.getItem("selectedVersion");
    if (!userSelectedVersion_global) {
      var globalVersion = "/custom/common/xhr/versionConfig.json";
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          var obj = JSON.parse(this.responseText);
          userSelectedVersion_global = obj["currentVersion"];
          resolve(userSelectedVersion_global);
        }
      };
      xmlhttp.open("GET", globalVersion, true);
      xmlhttp.send();
    } else resolve(userSelectedVersion_global);
  });
}

function getCompoundImagePath() {
  return new Promise(function (resolve, reject) {
    getCurrentVersion().then((version) => {
      var path = "/custom/versions/" + version + "/png/";
      resolve(path);
    });
  });
}
