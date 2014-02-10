var fs = require("fs");
var path = require("path");
var vm = require("vm");
var execFile = require('child_process').execFile;

var handlebars = require("handlebars");
var jsEscape = require("js-string-escape");
var shellEscape = require("shell-escape");

var handler = require("../lib/index.js");

var tmpFile = __dirname + "/_hbs.js";
var nodeScript = __dirname + "/_test.js";

var fp = jsEscape(path.join(
	__dirname,
	"..",
	"node_modules",
	"handlebars",
	"dist",
	"cjs",
	"handlebars.runtime.js"
));

var tests = {
	"test filetypes":function(assert) {
		var data = [
		            "http://mysite.co.uk/bla.js",
		            "//cdn.google.com/path/to/assets.css",
		            "path/to/assets.hbs",
		            "/abs/path/to/assets.handlebars",
		            "path/to/assets.handlebars",
		            "/abs/path/to/assets.hbs",
		            "@@hbs/runtime",
		            "@@css/addStylesheet"
		            ];
		assert.deepEqual(
			data.map(function(fp){ return handler.willHandle(fp);}),
			[false,false,true,true,true,true,false,false],
			"Should handle the correct files."
		);
	},
	"test response":function(assert,done) {		
		handler.handle(__dirname+"/tmpl.hbs",{requireRuntime:false},function(err,content){
			assert.ok(!err,"There should be no errors handling this file.");
			
			var context = vm.createContext({module: {exports: {}}});
			
			vm.runInContext(content,context);
			
			assert.strictEqual(
				handlebars.template(context.module.exports)({name:"test"}),
				"Testing test.",
				"Handler should be calling callback correctly."
			);
			
			done();
		});
	},
	"test response 2":function(assert,done) {		
		handler.handle(__dirname+"/tmpl.hbs",{},function(err,content){
			assert.ok(!err,"There should be no errors handling this file.");
			// node doesn't understand the exclamation mark
			content = content.replace(
				"module.exports = require('!"+fp+"')",
				"module.exports = require('"+fp+"')"
			);
			fs.writeFile(tmpFile,content,function(err){
				if (err) {
					assert.fail("Error writing temp file at " + tmpFile + ": " + err);
					done();
					return;
				}
				var escaped = shellEscape([nodeScript]);
				var child = execFile(process.execPath,[escaped],function(err,stdout,stderr){
					child.kill();
					if (err || stderr) {
						assert.fail("error spawning separate node process: " + err + stderr);
						done();
						return;
					}
					assert.strictEqual(
						stdout,
						"Testing Bob.",
						"Handler should be calling callback correctly."
					);
					done();
				});
			});			
			
		});
	}
};

require("test").run(tests);