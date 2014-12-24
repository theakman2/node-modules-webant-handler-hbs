var fs = require("fs");
var path = require("path");
var childProcess = require("child_process");

var shellEscape = require("shell-escape");
var Webant = require("webant");

var handler = require("../lib/index.js");

function phantom(assert,done,cb) {
	var pjs = childProcess.exec(
		'phantomjs ' + shellEscape([path.join(__dirname,"headless","phantomwebant.js")]),
		{
			cwd:path.join(__dirname,"headless"),
			maxBuffer:1024*1024
		},
		function(err,stdout,stderr) {
			pjs.kill();
			if (err) {
				assert.fail("phantomjs reports an error: " + err);
				done();
				return;
			}
			if (stderr) {
				assert.fail("phantomjs reports content in stderror: " + stderr);
				done();
				return;
			}
			var out;
			try {
				out = JSON.parse(stdout.trim());
			} catch(e) {
				assert.fail("Could not JSON.parse() stdout [stdout is: " + stdout + "]");
				done();
				return;
			}
			cb(out);
		}
	);
}

var tests = {
	"test handler":function(assert,done) {
		var webant = new Webant({
			entry:path.join(__dirname,"headless","entry.js"),
			dest:path.join(__dirname,"headless","main.js"),
			handlers:[handler]
		});
		webant.build(function(err){
			if (err) {
				assert.fail("Webant should not error when parsing javascript (error: " + err + ")");
				done();
				return;
			}
			phantom(assert,done,function(out){
				assert.strictEqual(
					out,
					"My name is foo!Your name is bar.6",
					"handlebars should be compiled correctly"
				);
				done();
			});
		});
	}
};

require("test").run(tests);