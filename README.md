#JSONChecker readme

The goal of this library was to create a validator library for Java Script plain objects.

To assess validity the library needs a specification against which you could validate. Example specification may look as follows:
```
var spec = {
    type: "object"
};
```

You could then pass any plain object you want, and it will be valid. Passing value of another type would obviously fail e.g.
```
var valid = {};
var invalid = 1;
```

Simple check returns boolean value: either `true` or `false`.

Full output (after calling `getLastReport()` method) contains few informations, and the most important one is of course whether the object is valid or not, e.g.:
```
{
    valid: true,        // or false
    errors: [],         // can contain validation errors
    context: ""         // stores context of the processed object,
                        // handy when nested specifications exist
}
```
Output also contains original specification and passed value under `spec` and `json` keys correspondingly.

To see some really cool and complex examples see [DOCS.md](https://github.com/karoltarasiuk/JSONChecker/blob/master/DOCS.md) file.

##Changelog

You can find the changelog in [CHANGELOG.md](https://github.com/karoltarasiuk/JSONChecker/blob/master/CHANGELOG.md) file.

##Licence

You can find the licence in [LICENCE.md](https://github.com/karoltarasiuk/JSONChecker/blob/master/LICENCE.md) file.

##How to use

###Example page

The example page contains simple use case of the library. Run `make open` to see it in action.

It will create a simple local HTTP server using python using port 8000, and then it will try to open your default browser. If for some reason the second step didn't work navigate to this link in a browser of your choice: http://localhost:8000/

###Preview example code

index.html
```
<!DOCTYPE html>
<html>
    <head>
        <title>JSONChecker</title>
        <script type="text/javascript" data-main="script" src="lib/require.min.js"></script>
    </head>
    <body></body>
</html>

```

script.js
```
require.config({
    paths: {
        lodash: 'lib/lodash.min',
        JSONChecker: 'src/JSONChecker'
    }
});

require([
    'JSONChecker'
], function (
    JSONChecker
) {

    var json = {
        a: 1,
        b: [
            3
        ],
        c: {
            a: 1
        },
        d: "string",
        e: true
    };

    var spec = {
        type: "object",
        properties: [{
            name: "a",
            spec: {
                type: "number"
            }
        }, {
            name: "b",
            spec: {
                type: "array",
                length: 1,
                elements: [{
                    index: 0,
                    spec: {
                        type: "number"
                    }
                }]
            }
        }, {
            name: "c",
            spec: {
                type: "object"
            }
        }, {
            name: "d",
            spec: {
                type: "string"
            }
        }, {
            name: "e",
            spec: {
                type: "boolean"
            }
        }]
    };

    var checker = new JSONChecker(spec);
    console.log(checker.check(json, 'object'));
    console.log(checker.getLastReport());
});

```

###Automated tests

The library is using Jasmine for automated testing purposes. Run `make tests` in your terminal.
