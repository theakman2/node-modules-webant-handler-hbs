var vm = require("vm");

var handlebars = require("handlebars");

var Handler = require("../lib/index.js");

var tests = {
	"test filetypes":function(assert) {
		var handler = new Handler();
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
			data.map(handler.willHandle),
			[false,false,true,true,true,true,true,false],
			"Should handle the correct files."
		);
	},
	"test response":function(assert,done) {
		var handler = new Handler({requireRuntime:false});
		
		handler.handle(__dirname+"/tmpl.hbs",function(err,content){
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
	}
};

require("test").run(tests);