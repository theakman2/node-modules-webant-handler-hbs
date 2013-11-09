# node-modules-webant-handler-hbs

_Require handlebars templates with [webant](https://github.com/theakman2/node-modules-webant)_

## Installation

There should be no need to install this module since it's required by the [webant](https://github.com/theakman2/node-modules-webant) module by default.

If for some reason you'd like to use the module outside of webant, install as follows:

    $ npm install webant-handler-hbs

## Usage

Ensure the `hbs` handler is present in your webant configuration file. For example:

````json
{
    "entry":"src/js/main.js",
    "dest":"build/main.js",
    "handlers":{
        "hbs":{
            "requireRuntime":true
        }
    }
}
````

You may now `require` handlebars files:

````javascript
var tmpl = require("./path/to/template.hbs");
var otherTmpl = require("./path/to/template.handlebars");
var html = tmpl({name:"Jane Doe"});
````

## Settings

The following configuration settings are available:

`requireRuntime`

Can be either `true` (default) or `false`. If `true`, the handlebars runtime is automatically `require`d along with the template. This allows easier usage of the template as follows:

```javascript
var tmpl = require("./path/to/template.hbs");
var html = tmpl({name:"Jane Doe"});
```

If set to `false`, you'll need to include the handlebars runtime yourself as follows:

```javascript
var hbs = require("path/to/handlebars.runtime.js");
var tmpl = require("./path/to/template.hbs");
var tmplFunc = hbs.template(tmpl);
var html = tmplFunc({name:"Jane Doe"});
```

It may be necessary to modify the handlebars runtime to export the Handlebars object by appending the following line:

```javascript
// Handlebars code...
module.exports = Handlebars;
```

## Tests

    $ npm test