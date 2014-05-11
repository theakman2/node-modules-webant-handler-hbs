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

module.exports = {
	settings:{
		requireRuntime:true
	},
	aliases:{
		"hbs/runtime":fp
	},
	extensions:[".hbs",".handlebars"],
	handle:function(filePath,done){
		fs.readFile(filePath,function(e,c){
			if (e) {
				done(e);
				return;
			}
			if (module.exports.settings.requireRuntime) {
				done(null,"module.exports = require('{hbs/runtime}|sameChunkAs={entry}')['default'].template("+handlebars.precompile(c.toString())+");");
			} else {
				done(null,"module.exports = "+handlebars.precompile(c.toString())+"\n");
			}
		});
	}
};