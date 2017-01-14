//Only info that cannot be placed in the config file
var configFile = "config.json";

//Requires
var fs = require('fs');
var isFirst = false;

//Settings
var settings = loadConfigs(configFile);

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
		end(text);
	}
};

page.open(settings.url, function(status) {
  if(status === "success") {
	  page.includeJs(settings.jQueryUrl, function() {
		  page.evaluate(function(settings){
			  var formdata = document.formSearchACO;
			  formdata.code.value = settings.clientCode;
			  formdata.submit();
		  }, settings);
	  });
  }
  
});

function evaluateOtherPage(){
	var text = page.evaluate(function(){
		var maxUsage = $(".nobr:contains('total')>div").text();
		maxUsage = maxUsage.substring(maxUsage.lastIndexOf(":")+2, maxUsage.length);
		var currentUsage = $(".nobr:contains('Available')>div").text();
		currentUsage = currentUsage.substring(currentUsage.lastIndexOf(":")+2, currentUsage.length);
		return currentUsage + "/" + maxUsage;
	});
	return text;
}

function end(text){
	var path = settings.outputFile;
	fs.write(path, text, 'w');
	phantom.exit();
}