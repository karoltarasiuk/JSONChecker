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

        describe("Object object", function () {

            it("should always validate correctly", function () {

                args = [
                    {
                        json: {},
                        spec: { type: 'object' },
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'object' },
                        context: '',
                        result: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'object' },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: { 1: "string" },
                        spec: {
                            type: 'object',
                            properties: [
                                { name: 1, spec: { type: "string" }}
                            ]
                        },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context',
                            properties: {
                                1: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.1',
                                    json: "string",
                                    spec: { type: "string" }
                                }
                            }
                        }
                    },
                    {
                        json: { a: "string", b: 1 },
                        spec: {
                            type: 'object',
                            properties: [
                                { name: "a", spec: { type: "string" }},
                                { name: "b", spec: { type: "number" }}
                            ]
                        },
                        context: 'some.nested.context',
                        result: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context',
                            properties: {
                                a: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.a',
                                    json: "string",
                                    spec: { type: "string" }
                                },
                                b: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.b',
                                    json: 1,
                                    spec: { type: "number" }
                                }
                            }
                        }
                    },
                    {
                        json: { a: "string", b: 1, c: true },
                        spec: {
                            type: 'object',
                            properties: [
                                { name: "a", spec: { type: "string" }},
                                { name: "b", spec: { type: "number" }},
                                { name: "c", spec: { type: "object" }}
                            ]
                        },
                        context: 'some.nested.context',
                        result: {
                            valid: false,
                            errors: [],
                            context: 'some.nested.context',
                            properties: {
                                a: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.a',
                                    json: "string",
                                    spec: { type: "string" }
                                },
                                b: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.b',
                                    json: 1,
                                    spec: { type: "number" }
                                },
                                c: {
                                    valid: false,
                                    errors: ["Provided JSON is not an object"],
                                    context: 'some.nested.context.c',
                                    json: true,
                                    spec: { type: "object" }
                                }
                            }
                        }
                    },
                    {
                        json: [],
                        spec: {
                            type: 'object'
                        },
                        context: 'some.nested.context',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not an object"],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: 1,
                        spec: { type: 'object' },
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not an object"],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'object' },
                        context: '',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not an object"],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'object' },
                        context: '',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not an object"],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'object' },
                        context: '',
                        result: {
                            valid: false,
                            errors: ["Provided JSON is not an object"],
                            context: ''
                        }
                    }
                ];

                _.each(args, tester(true));
            });

            it("validation should always fail", function () {

                args = [
                    {
                        json: {},
                        spec: { type: 'object' },
                        result: {
                            valid: false,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'object' },
                        context: '',
                        result: {
                            valid: true,
                            errors: ['some error'],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'object' },
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
