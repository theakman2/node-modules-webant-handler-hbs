/**
 * Handles require calls to files with an extension of .handlebars or .hbs. 
 */
var path = require("path");
var handlebars = require("handlebars");

function Handler() {
	this.extensions = [".hbs",".handlebars"];
	this.requireAliases = {
		'@@hbs/runtime':path.resolve(__dirname,"data/handlebars.runtime.js")
	};
	
	this.go = function(data,update,done) {
		if (!this.settings.hasOwnProperty("requireRuntime") || this.settings.requireRuntime) {
			update({
				type:"internalJs",
				content:"module.exports = require('@@hbs/runtime').template("+handlebars.precompile(data.content)+");"
			},done);
		} else {
			update({
				type:"internalJs",
				content:"module.exports = "+handlebars.precompile(data.content)+"\n"
			},done);
		}
	};	
};

module.exports = Handler;