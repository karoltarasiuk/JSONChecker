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

        var i, checker, args, result, comparer, temp,
            tester = function (toBe) {

                return function (arg) {

                    checker = new JSONChecker(arg.spec);
                    result = checker.check(arg.json, arg['context']);

                    // setting spec & json as they're always in result
                    arg.result.spec = arg.spec;
                    arg.result.json = arg.json;

                    comparer = new ObjectComparer();
                    temp = comparer.areEqual(result, arg.result);

                    expect(temp).toBe(toBe);

                    if (temp !== toBe) {
                        console.log('not equal', result, arg.result);
                    }
                };
            };

        describe("String object", function () {

            it("should always validate correctly", function () {

                args = [
                    {
                        json: "string",
                        spec: { type: 'string' },
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: '',
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: 1,
                        spec: { type: 'string' },
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'string' },
                        context: '',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'string' },
                        context: '',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'string' },
                        context: '',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not a string"],
                            context: ''
                        }
                    },
                    {
                        json: "a",
                        spec: { type: 'string', length: 1 },
                        context: '',
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "a",
                        spec: { type: 'string', length: 2 },
                        context: '',
                        result: {
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
                        result: {
                            valid: false,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: '',
                        result: {
                            valid: true,
                            errors: ['some error'],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'string' },
                        context: 'some.nested.context',
                        result: {
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
