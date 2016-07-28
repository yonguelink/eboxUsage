//Time to wait for page load
var timeoutExit = 1000;
var canExit = true;
var isFirst = false;
var fs = require('fs');
//Settings
var settings = loadConfigs("../config.json");

function loadConfigs(path){
	var data = fs.read(path);
	while(data.indexOf("	") > -1)data = data.replace("	", "");
	return JSON.parse(data);
};


var page = require('webpage').create();

page.onLoadStarted = function() {
	canExit = false;
};

page.onLoadFinished = function(){
	if(!isFirst){
		isFirst = true;
	}else{
		var text = evaluateOtherPage();
		canExit = true;
		end(text);
	}
};
/*
page.open(settings.url, function(status) {
  console.log("Status: " + status);
  if(status === "success") {
	  page.includeJs("http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js", function() {
		  page.evaluate(function(settings){
			  var formdata = document.formSearchACO;
			  formdata.code.value = settings.clientCode;
			  formdata.submit();
		  }, settings);
	  });
  }
  
});
*/
function evaluateOtherPage(){
	//Wait for the 2nd page to have loaded
	if(!isFirst){
		setTimeout(evaluateOtherPage, timeoutExit);
	}else{
		var maxUsage = $(".nobr:contains('Total')>div").text();
		maxUsage.substring(maxUsage.lastIndexOf(":")+1, maxUsage.length)
	}
}

function end(text){
	page.render("lol.png");
	var path = 'output.txt';
	fs.write(path, text, 'w');
	phantom.exit();
}