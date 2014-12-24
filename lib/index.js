/**
 * Handles require calls to files with an extension of .handlebars or .hbs. 
 */
var fs = require("fs");
var path = require("path");

var handlebars = require("handlebars");

var fp = path.join(
	__dirname,
	"..",
	"node_modules",
	"handlebars",
	"dist",
	"cjs",
	"handlebars.runtime.js"
);

function HandlebarsHandler() {
	this.settings = {
		requireRuntime:true
	};
}

HandlebarsHandler.prototype = {
	aliases:{
		"hbs/runtime":fp
	},
	extensions:[".hbs",".handlebars"],
	handle:function(filePath,done){
		var _this = this;
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			if (_this.settings.requireRuntime) {
				done(null,"module.exports = require('{hbs/runtime}|sameAsChunk={entry}')['default'].template("+handlebars.precompile(c.toString())+");");
			} else {
				done(null,"module.exports = "+handlebars.precompile(c.toString())+"\n");
			}
		});
	}
};

module.exports = HandlebarsHandler;