require.config({
    paths: {
        jasmine: 'lib/jasmine-2.0.0/jasmine',
        jasminehtml: 'lib/jasmine-2.0.0/jasmine-html',
        boot: 'lib/jasmine-2.0.0/boot',
        lodash: 'lib/lodash.min',
        ObjectComparer: 'lib/ObjectComparer',
        JSONChecker: 'src/JSONChecker'
    },
    shim: {
        jasmine: {
            exports: 'jasmineRequire'
        },
        jasminehtml: {
            deps: ['jasmine'],
            exports: 'jasmineRequire'
        },
        boot: {
            deps: ['jasmine', 'jasminehtml'],
            exports: 'jasmineRequire'
        }
    }
});

require(['boot'], function () {

    var specs = [
            "spec/JSONChecker/Main",
            "spec/JSONChecker/Boolean",
            "spec/JSONChecker/Number",
            "spec/JSONChecker/String",
            "spec/JSONChecker/Array",
            "spec/JSONChecker/Object",
            "spec/JSONChecker/OR"
        ];

    require(specs, function () {
        window.onload();
    });
});
