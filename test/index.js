var vm = require("vm");

var handlebars = require("handlebars");

var Handler = require("../lib/index.js");
var HandlerBase = require("./lib/Handler.js");

function createHandler(Handler,settings) {
	var handlerBase = new HandlerBase(settings);
	
	Handler.prototype = handlerBase;
	Handler.prototype.constructor = Handler;
	
	return new Handler();
}

var tests = {
	"test handlebars 1":function(assert,done) {
		var handler = createHandler(Handler);
		var data = {
			filePath:"https://sfi9s.sdf.sd/vk93k.handlebars?bla=3",
			raw:"https://sfi9s.sdf.sd/vk93k.handlebars?bla=3",
			requireType:"comment"
		};
		handler.willHandle(data,function(err,yes){
			assert.strictEqual(err,null,"Handler should not report any errors.");
			assert.strictEqual(yes,false,"Handler should not claim to handle this file.");
			done();
		});
	},
	"test handlebars 2":function(assert,done) {
		var handler = createHandler(Handler);
		var data = {
			filePath:__dirname+"/path/to/bad/file.json",
			raw:"file.json",
			requireType:"function"
		};
		handler.willHandle(data,function(err,yes){
			assert.strictEqual(err,null,"Handler should not report any errors.");
			assert.strictEqual(yes,false,"Handler should not claim to handle this file.");
			done();
		});
	},
	"test handlebars 3":function(assert,done) {
		var handler = createHandler(Handler,{requireRuntime:false});
		var data = {
			filePath:__dirname+"/tmpl.hbs",
			requireType:"function",
			raw:"../tmpl.hbs"
		};
		
		handler.handle(data,function(resp){
			assert.strictEqual(
				resp.type,
				"internalJs",
				"Handler should be calling callback correctly (1)."
			);
			
			assert.strictEqual(
				resp.hasOwnProperty("content"),
				true,
				"Handler should be calling callback correctly (2)."
			);
			
			var context = vm.createContext({module: {exports: {}}});
			
			vm.runInContext(resp.content,context);
			
			assert.strictEqual(
				handlebars.template(context.module.exports)({name:"test"}),
				"Testing test.",
				"Handler should be calling callback correctly (3)."
			);
			
			done();
		});
	}
};

require("test").run(tests);