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
});
