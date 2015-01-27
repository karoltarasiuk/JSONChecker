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

        describe("Boolean object", function () {

            it("should always validate correctly", function () {

                args = [
                    {
                        json: false,
                        spec: { type: 'boolean' },
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'boolean' },
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: false,
                        spec: { type: 'boolean' },
                        context: '',
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'boolean' },
                        context: '',
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: false,
                        spec: { type: 'boolean' },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'boolean' },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    }
                ];

                _.each(args, tester(true));
            });

            it("validation should always fail", function () {

                args = [
                    {
                        json: false,
                        spec: { type: 'boolean' },
                        result: {
                            valid: false,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'boolean' },
                        result: {
                            valid: false,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: false,
                        spec: { type: 'boolean' },
                        context: '',
                        result: {
                            valid: true,
                            errors: ['some error'],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'boolean' },
                        context: '',
                        result: {
                            valid: true,
                            errors: ['some error'],
                            context: ''
                        }
                    },
                    {
                        json: false,
                        spec: { type: 'boolean' },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.invalid.context'
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'boolean' },
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
