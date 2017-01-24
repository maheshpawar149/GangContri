var myApp=angular.module('myModule',['ngRoute','ngMaterial','ngMessages']) 
//MAIN Service 
.service('mainService', function($http){ 
	this.expenseCount=[{id: 'exp1'},{id: 'exp2'}]; 
	this.newContriMembers=[]; 
	this.testmsg="hello";
	this.eventJson=[];
}) 
 
.factory('mainFactory', function($http){ 
	return { 
	 allmNames : function(callback){ 
	 			$http.get('resources/gangMembers.json').success(callback); 
	 		}   
	}; 
}) 
 
//Main Directive Config 
.config(function($routeProvider){ 
	$routeProvider 
	 .when("/",{ 
	 	templateUrl: "frontPage.html" 
	 	//controller: "myController" 
	 }) 
	.when("/viewnames",{ 
		templateUrl: "viewNames.html", 
		controller: "myController" 
	}) 
	.when ("/makeContri",{ 
		templateUrl: "makeContri.html", 
		controller: "makeContriCtrl" 
	}) 
	.when("/addContriMembers",{ 
		templateUrl:'addmembersContri.html', 
		controller:'makeContriCtrl'//myController 
	}) 
	.when('/MainContriPage',{ 
		templateUrl:'showGangContri.html', 
		controller: 'makeContriCtrl' 
	}) 
	.when ("/exitPage",{ 
		templateUrl: "frontPage.html" 
	}) 
	.otherwise({redirectTo: '/'}); 
}) 
 
 
.controller("myController", function($scope,$http, mainService, mainFactory){ 
	$scope.allNames={}; 
	mainFactory.allmNames(function(mainFactory){ 
		$scope.allNames=mainFactory; 
	})	  
}) 
 
//makeContriCtrl Controller----* 
.controller('makeContriCtrl',function($scope,mainService,mainFactory){ 
	 
	//console.log("controller init");
	mainService.eventJson=[]; 
	$scope.MainContriPage=[]; 
	$scope.manageContri=false; 
	//$scope.PaidorNot=true; 
	mainFactory.allmNames(function(mainFactory){ 
		$scope.addMemnamesContri=mainFactory; 
	}) 
	 
	$scope.expenseCount=mainService.expenseCount; 
	$scope.newContriMembers=mainService.newContriMembers; 
 
	var sumExpense=0; 
	$scope.addNewChoice=function(){ 
		$scope.newItemNo=$scope.expenseCount.length+1; 
		$scope.expenseCount.push({'id': 'exp'+$scope.newItemNo}); 
	}; 
 
	$scope.remChoice=function(index){ 
		$scope.expenseCount.splice(index,1); 
	}; 
	
 
//calculating Total Contri 
	$scope.totalExpense=function(){ 
		 $scope.sumExpense=0; 
		 if ($scope.sumExpense==NaN) { 
		 	$scope.sumExpense=0; 
		 } 
 
		for (var i=0; i<($scope.expenseCount.length);i++){ 
			var item=$scope.expenseCount[i].name; 
			$scope.sumExpense=($scope.sumExpense) + (item); 
			//$scope.sumExpense=sumExpense; 
		} //return sumExpense; 
 
	}; 
//member Selection 
	$scope.addToContri=function(item,index){ 
		$scope.newContriMembers.push({'name':item.name,'avatar':item.avatar}); 
		$scope.addMemnamesContri.splice(index,1); 
	}; 
	$scope.remToContri=function(item,index){ 
		$scope.addMemnamesContri.push({'name':item.name,'avatar':item.avatar}); 
		$scope.newContriMembers.splice(index,1); 
	}; 
 
//Export Data to Excel 
$scope.exportContriEntryExcel=function(){ 
	$scope.printpageMain();
	//$scope.mainService=mainService;
 	//(mainService.eventJson[0].eventName);           //excelname here
 	$scope.newEventname= "GangContri";
 	//$scope.eventJson[0].eventName; //excelname here
    var ds= new kendo.data.DataSource({ 
    data: $scope.MainContriPage, 
      schema:{ 
        model:{ 
          fields:{ 
            memberName: {type: "string"}, 
            Contri : {type: "number"}, 
            manage_Expense: {type: "number"}, 
            totToPay: {type: "number"},
            avatar: {type: "string"} 
          } 
        } 
      } 
    }); 
 
    var rows=[
    	{	cells:[{}]},
    	{	cells:[{},{value:''+$scope.newEventname+'',bold:true,colSpan:5,color: "#fdfefe",background:"#C70039",fontFamily: "Gisha",fontSize: 20 }], height:50},
    	{	cells:[{},
      			{value:"Member name",bold:true, color: "#fdfefe",background:"#2874a6"}, 
        		{value:"Contri",bold:true, color: "#fdfefe",background:"#2874a6"}, 
        		{value:"Expense By",bold:true, color: "#fdfefe",background:"#2874a6"}, 
        		{value:"Total to Pay",bold:true, color: "#fdfefe",background:"#2874a6"},
        		{value:"Paid/Not paid",bold:true, color: "#fdfefe",background:"#2874a6"} 
      		], height:30
      	}
    ];
   
   	//<img id='img-circleAddMem' class='img-circle'  src='data[i].avatar'/>"); 
    ds.fetch(function(){ 
      var data=this.data(); 
      //console.log(data); 
      $scope.myTemplate=kendo.template("<a>sadasd</a>");
//alert(data[0].avatar.)
      //var myTemplate="<img id='img-circleAddMem' class='img-circle'  src='data[i].avatar'/>";
      for(var i=0;i<data.length;i++) 
      { 
        rows.push({ 
          cells:[
          	{},
            {value: data[i].memberName,bold:true}, 
            {value: data[i].Contri}, 
            {value: data[i].manage_Expense}, 
            {value: data[i].totToPay,italic:true,bold: true, color:"#2ecc71"}, //#a93226
          ] 
        })   
      } 
      ///	alert($scope.myTemplate);
		rows.push(
      		{	cells:[{}]	},
      		{	cells:[{}]	},
      		{	cells:[{}]	},
      		{	cells:[{},{},{},{},{},{value: "__________________"}], height:50	},
      		{	cells:[{},{},{},{},{},{value: "Aungutha/Autograph",bold:true,italic:true}], height:30	}
      	);
 
      var workbook = new kendo.ooxml.Workbook({ 
          sheets:[ 
            { 
                columns:[{width:100,},{width:150},{width:100},{width:100},{width:100},{width:100}],
              	title: $scope.newEventname, 
                rows:rows 
              } 
          ] 
      }); 
 //	debugger;
    kendo.saveAs({ 
        dataURI: workbook.toDataURL(), 
        fileName: ''+$scope.newEventname+'.xlsx' 
    }); 

    	//Get Pdf here
    kendo.pdf.defineFont({
     //   "DejaVu Sans"             : "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans.ttf",
        "DejaVu Sans|Bold"        : "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Bold.ttf",
        "DejaVu Sans|Bold|Italic" : "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf",
        "DejaVu Sans|Italic"      : "//kendo.cdn.telerik.com/2016.2.607/styles/fonts/DejaVu/DejaVuSans-Oblique.ttf"
    });
  
  }); 

};

$scope.exportContriEntryPDF=function(){
	$scope.printpageMain();
	$scope.newEventname= "MyGangContri";
  	kendo.drawing.drawDOM($("#mainContriTable"))    //mainContriViewpdiv
  		.then(function(group){
  			return kendo.drawing.exportPDF(group,{
  				author:"Special 26",
  				creator:"Special 26",
  				//date:,
  				allpages:true,
  				paperSize:"A4",
  				multiPage: true,
  				landscape: false,
  				scale: 0.8,
  				//margin: "2cm"
  				margin: { left: "0cm", top: "1cm", right: "0cm", bottom: "1cm" }
  			});
  		})
  		.done(function(data){
  			kendo.saveAs({
  				dataURI: data,
  				fileName:''+$scope.newEventname+'_pdf.pdf'  //event name here
  			});
  		});
}

 
$scope.printpageExpense=function(){ 
	mainService.eventJson.push({'eventName': $("[name='Desc']").val()}); 
//	alert($scope.eventJson.eventPatriExpe.Desc);
	for(var i=0; i<=$scope.expenseCount.length-1;i++) 
	{		 
		mainService.eventJson.push({'eventPatriExpe':[{'Desc': $('input[name=parti'+i+']').val()},{'Amt':$('input[name=contriAmt'+i+']').val()}]});		 
	} 

	console.log("In ExpensePage",mainService.eventJson); 
	$scope.mainService=mainService;
	//alert(JSON.stringify($scope.eventJson)); 
}; 
 
$scope.printpageMain=function(){ 
	$scope.mainService=mainService;
 	//alert($scope.eventJson);
 	console.log("In printmainPage",$scope.eventJson);
	for(var i=0; i<=$scope.newContriMembers.length-1;i++) 
	{		 
		$scope.MainContriPage.push({'memberName': $('input[name=name'+i+']').val(),'Contri': $('input[name=contriDiv'+i+']').val(),'manage_Expense': $('input[name=amount'+i+']').val(),'totToPay': $('input[name=totToPay'+i+']').val() ,'avatar':$('[name=avatar'+i+']')});  
	} 
	
	//alert(JSON.stringify($scope.MainContriPage)); 
	console.log("In printmainPage",$scope.MainContriPage); 
	//debugger;
	//alert(($scope.MainContriPage[0].avatar).outerHTML());
	//var a= $scope.MainContriPage[0].avatar;
	//var b= a.contentDocument;
	//alert(b.getElemementByTag('img'));
	//var b= $('a').contents().find('img').html();
	//alert($(a).getElemementByTag('img').innerHTML());
//	alert(b);
	//console.log(b.getElemementByTag('img').outerHTML());
	//console.log(b);


	//debugger;
//	$scope.exportContriEntryExcel(); 
}; 


 
}); 