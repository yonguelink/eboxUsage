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
			  var formdata = document.formLogin;
			  formdata.usrname.value = settings.clientCode;
			  formdata.pwd.value = settings.clientPass;
			  formdata.submit();
		  }, settings);
	  });
  }
  
});

function evaluateOtherPage(){
	var text = page.evaluate(function(){
		var unCleanText = $(".text_summary3").text().trim().replace("\n", " ");
		while(unCleanText.indexOf("\t") > -1)unCleanText = unCleanText.replace("\t", "");
		while(unCleanText.indexOf("o") > -1)unCleanText = unCleanText.replace("o", "");
		unCleanText = unCleanText.replace(" / ", "/");
		return unCleanText;
	});
	return text;
}

function end(text){
	var path = settings.outputFile;
	fs.write(path, text, 'w');
	phantom.exit();
}