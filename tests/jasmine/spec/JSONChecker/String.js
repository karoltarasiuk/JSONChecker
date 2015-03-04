define([
    "lodash",
    "JSONChecker",
    "ObjectComparer"
], function(
    _,
    JSONChecker,
    ObjectComparer
) {

    describe("JSONChecker", function() {

        var i, checker, args, result, comparer, temp1, temp2,
            tester = function (toBe) {

                return function (arg) {

                    checker = new JSONChecker(arg.spec);
                    result = checker.check(arg.json, arg.context);
                    fullResult = checker.getLastReport();

                    // setting spec & json as they're always in result
                    arg.fullResult.spec = arg.spec;
                    arg.fullResult.json = arg.json;

                    comparer = new ObjectComparer();
                    temp1 = result === arg.result;
                    temp2 = comparer.areEqual(fullResult, arg.fullResult);

                    expect(temp1 && temp2).toBe(toBe);

                    if (temp1 && temp2 !== toBe) {
                        console.log('not equal', result, fullResult, arg.result, arg.fullResult);
                    }
                };
            };

        describe("String object", function () {

            it("should always validate correctly", function () {

                args = [
                    {
                        json: "string",
                        spec: { type: 'string' },
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: '',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: 'some.nested.context',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: 1,
                        spec: { type: 'string' },
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'string' },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'string' },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'string' },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: "a",
                        spec: { type: 'string', length: 1 },
                        context: '',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "a",
                        spec: { type: 'string', length: 2 },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON string doesn't have required length"],
                            context: ''
                        }
                    }
                ];

                _.each(args, tester(true));
            });

            it("validation should always fail", function () {

                args = [
                    {
                        json: "string",
                        spec: { type: 'string' },
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: '',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: ['some error'],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: 'some.nested.context',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: 'some.invalid.context'
                        }
                    }
                ];

                _.each(args, tester(false));
            });
        });
    });
});
