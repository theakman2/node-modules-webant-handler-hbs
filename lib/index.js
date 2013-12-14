/**
 * Handles require calls to files with an extension of .handlebars or .hbs. 
 */
var fs = require("fs");
var path = require("path");
var url = require("url");
var handlebars = require("handlebars");

module.exports = {
	willHandle:function(filePath,settings){
		if (url.parse(filePath,false,true).host) {
			return false;
		}
		if (filePath === "@@hbs/runtime") {
			return true;
		}
		if (filePath.indexOf("@@") === 0) {
			return false;
		}
		var ext = path.extname(filePath);
		if (ext === ".hbs") {
			return true;
		}
		if (ext === ".handlebars") {
			return true;
		}
		return false;
	},
	handle:function(filePath,settings,done){
		if (filePath === "@@hbs/runtime") {
			fs.readFile(__dirname+"/data/handlebars.runtime.js",function(e,c){
				if (e) {
					done(e);
					return;
				}
				done(null,c.toString());
			});
		} else {
			fs.readFile(filePath,function(e,c){
				if (e) {
					done(e);
					return;
				}
				if (!settings.hasOwnProperty("requireRuntime") || settings.requireRuntime) {
					done(null,"module.exports = require('!@@hbs/runtime').template("+handlebars.precompile(c.toString())+");");
				} else {
					done(null,"module.exports = "+handlebars.precompile(c.toString())+"\n");
				}
			});
		}
	}
};