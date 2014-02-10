/**
 * Handles require calls to files with an extension of .handlebars or .hbs. 
 */
var fs = require("fs");
var path = require("path");
var url = require("url");

var handlebars = require("handlebars");
var jsEscape = require("js-string-escape");

var fp = jsEscape(path.join(
	__dirname,
	"..",
	"node_modules",
	"handlebars",
	"dist",
	"cjs",
	"handlebars.runtime.js"
));

module.exports = {
	willHandle:function(filePath,settings){
		if (url.parse(filePath,false,true).host) {
			return false;
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
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			if (!settings.hasOwnProperty("requireRuntime") || settings.requireRuntime) {
				done(null,"module.exports = require('!" + fp + "')['default'].template("+handlebars.precompile(c.toString())+");");
			} else {
				done(null,"module.exports = "+handlebars.precompile(c.toString())+"\n");
			}
		});
	}
};