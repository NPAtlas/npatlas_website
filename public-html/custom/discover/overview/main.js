getCurrentVersion().then((dbVersion) => {
	top50Genus_All_query("#loadingIcon", dbVersion).then((response) => {
  
		createChart('pie',response, "#chartGenus", showLegend);
	});
	top50Bacteria_query("#loadingIcon",dbVersion).then((response) => {
	  
		createChart('pie',response, "#chartBacteria", showLegend);
	});
	top50Fungus_query("#loadingIcon",dbVersion).then((response) => {
	  
		createChart('pie',response, "#chartFungus", showLegend);
	}); 

	clusterCount_query("#loadingIcon",dbVersion).then((response) => {
		jQuery('#noOfClusters').text(response["cluster_count"]);
	});

	biggestClusterInfo_query("#loadingIcon",dbVersion).then((response) => {
		var label = document.getElementById("biggestClusterID");

		var a= document.createElement('a');    a.innerHTML=response["biggest_cluster_id"];   a.title =response["biggest_cluster_id"];

		 a.href = "/joomla/index.php/explore/clusters#clusterID="+response["biggest_cluster_id"];
		 label.appendChild(a);
		jQuery('#biggestClusterCount').text(response["count_of_compounds"]);
	});

	numberOfClustersBySize_query("#loadingIcon",dbVersion).then((response) => {
		var sizeArr = []; var countArr = [];
		sizeArr.push('x');
		countArr.push('Total Clusters');
		for(var i=0; i< response.length; i++){
			sizeArr.push(response[i][0]);
			countArr.push(response[i][1]);
		}

		createLineGraph([sizeArr, countArr],"#chartCluster", "Cluster Size","Number of Clusters");
	});

	nodeCount_query("#loadingIcon",dbVersion).then((response) => {
		jQuery('#noOfNodes').text(response["node_count"]);
	});

	biggestNodeInfo_query("#loadingIcon",dbVersion).then((response) => {
		var label = document.getElementById("biggestNodeID");

		var a= document.createElement('a');    a.innerHTML=response["biggest_node_id"];   a.title =response["biggest_cluster_id"];

		 a.href = "/joomla/index.php/explore/nodes#nodeID="+response["biggest_node_id"];
		 label.appendChild(a);
		jQuery('#biggestNodeCount').text(response["count_of_compounds"]);
	});

	numberOfNodesBySize_query("#loadingIcon",dbVersion).then((response) => {
		var sizeArr = []; var countArr = [];
		sizeArr.push('x');
		countArr.push('Total Nodes');
		for(var i=0; i< response.length; i++){
			sizeArr.push(response[i][0]);
			countArr.push(response[i][1]);
		}

		createLineGraph([sizeArr, countArr],"#chartNode", "Node Size","Number of Nodes");
	});
	
	compMolWtBac_Fungi_query("#loadingIcon",dbVersion).then((response) => {
		var bacMolWtArr = []; var fungiMolWtArr = [];
		for(var i=0; i<response.length; i++){
			if(response[i][1] === 1)
				bacMolWtArr.push(response[i][0]);
			else
				fungiMolWtArr.push(response[i][0]);
		}
		var countBacArr = calcBinMolWt(bacMolWtArr, Math.min(parseInt(bacMolWtArr[0]),parseInt(fungiMolWtArr[0])));
		var countFungArr = calcBinMolWt(fungiMolWtArr, Math.min(parseInt(bacMolWtArr[0]),parseInt(fungiMolWtArr[0])));
		var originArr = [];
		for(var i = 0; i < countBacArr.length; i++){
			originArr.push(countBacArr[i] + countFungArr[i]);
		}

		countBacArr.unshift('Bacteria');
		countFungArr.unshift('Fungi');
		originArr.unshift('Total');
	 
		createBarChartGraph([originArr,countBacArr,countFungArr], "#chartMolWt",compWtArr, "Number of Compounds");
	});
	compByYearBac_Fungi_query("#loadingIcon",dbVersion).then((response) => {    
		var fungi = {}; var bacteria = {};  var YearArr = []; var originCount = []; var originYearArr = []; var total = {};
		var bacCount = []; var fungiCount = [];
		for(var i=0; i<response.length; i++){        
			if(response[i][1] === 1){
				if(! fungi[response[i][0]])
					fungi[response[i][0]] = 0;
				bacteria[response[i][0]] = response[i][2];
			}            
			else{
				if(! bacteria[response[i][0]])
					bacteria[response[i][0]] = 0;
				fungi[response[i][0]] = response[i][2];
			}
			total[response[i][0]] =  fungi[response[i][0]] + bacteria[response[i][0]];  
		}
		YearArr = Object.keys(bacteria);
		bacCount = Object.values(bacteria);
		fungiCount = Object.values(fungi);
		originCount = Object.values(total);
		debugger;
		YearArr.unshift('x');
		bacCount.unshift('Bacteria');
		fungiCount.unshift('Fungi');
		originCount.unshift('Total');
	  createLineGraph([YearArr,originCount,bacCount,fungiCount], "#compCountDiv","Year","Number of Compounds");
		
	});
	compOverview_query("#loadingIcon",dbVersion).then((response) => {
		jQuery('#noOfComp').text(response[0]);
		jQuery('#noOfBacteria').text(response[1]);
		jQuery('#noOfFungus').text(response[2]);
	});
});


var showLegend = true;

$(document).ready(function () {
    if(jQuery(window).width() < 770)
        showLegend = false;    
});


var compWtArr = [];

function calcBinMolWt(molWtArr, minMolWt){
    var countArr = []; var count = 1; var compWt = parseInt(minMolWt) + 20;  var beforeMolWt = parseInt(molWtArr[0]);
 
    for(var i=1; i<molWtArr.length; i++){
        if(compWt >= 2021)
            break;        
        else if(molWtArr[i] < compWt){
            count++;
        }        
        else{         
            compWtArr.push(beforeMolWt);
            beforeMolWt = compWt;
            compWt += 20;
            compWt = parseInt(compWt.toFixed(4));
            countArr.push(count);          
            count = 1;
        }
    }
    return countArr;    
}


function createChart(chartType,columnsArray, divID, showLegend){
	
	var chart = c3.generate({
		data: {
			columns : columnsArray,
			type : chartType,
			onclick: function (d, i) { 
            },
            
			onmouseover: function (d, i) { 
	
			},
			onmouseout: function (d, i) { 
//			console.log("onmouseout", d, i); 
			}
        },
        legend: {
            show: showLegend,
            position : "right"
        },
		 bindto: divID
	});
}

function createLineGraph(columnsArray, divID,xLabel, yLabel){
    var chart = c3.generate({
        data: {
            x: 'x',
            columns: columnsArray
        },
        axis: {
            y: {
                label: 
                {
                    text: yLabel,
                    position: 'outer-middle'
                }                
            },
            x: {
                label: 
                {
                    text: xLabel,
                    position: 'outer-center'
                }                
            },
        },
        bindto: divID
    });
}

function createBarChartGraph(columnsArray, divID,categoryArr, yLabel){
    var chart = c3.generate({
        data: {
            columns: columnsArray,
            type: 'bar',
            colors: {
                Bacteria: '#FF7F0E',
                Fungi:  '#2CA02C',
                Total: '#1F77B4'
                
            },           
        },
        axis: {
            x: {
                type: 'category',
                categories: categoryArr,
                tick: {
                //    rotate: -30,
                    multiline: false,
                    culling: {
                        max: 10 // the number of tick texts will be adjusted to less than this value
                    }
                },
                label: 
                {
                    text: "Molecular Weight",
                    position: 'outer-center'
                } 
            //    height: 100
            },
            y: {
                label: 
                {
                    text: yLabel,
                    position: 'outer-middle'
                }                
            }
        },
        bar: {
            width: {
                ratio: 0.6
            }            
        },
        // legend: {
        //     show: false
        // },
        tooltip: {
            format: {
                title: function (d) { 
                    return  compWtArr[d] + "-"+ (compWtArr[d]+20);
                }
            }
        },       
        bindto: divID
    });
}