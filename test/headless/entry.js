var handlebars = require("{hbs/runtime}");

var tmpl1 = require("tmpl1.hbs");
var tmpl2 = require("tmpl2.handlebars");

window.__global = tmpl1({name:"foo"}) + tmpl2({name:"bar"}) + handlebars['default'].COMPILER_REVISION;