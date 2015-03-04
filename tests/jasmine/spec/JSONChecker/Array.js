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

        describe("Array object", function () {

            it("should always validate correctly", function () {

                args = [
                    {
                        json: [],
                        spec: { type: 'array' },
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'array' },
                        context: '',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'array' },
                        context: 'some.nested.context',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: [1, 2],
                        spec: { type: 'array', length: 2 },
                        context: 'some.nested.context',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: [1, "string"],
                        spec: {
                            type: 'array',
                            elements: [
                                { index: 1, spec: { type: "string" }}
                            ]
                        },
                        context: 'some.nested.context',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context',
                            elements: {
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
                        json: [1, "string", true],
                        spec: {
                            type: 'array',
                            elements: [
                                { index: 1, spec: { type: "string" }},
                                { index: 0, spec: { type: "number" }}
                            ],
                            length: 3
                        },
                        context: 'some.nested.context',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: 'some.nested.context',
                            elements: {
                                1: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.1',
                                    json: "string",
                                    spec: { type: "string" }
                                },
                                0: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.0',
                                    json: 1,
                                    spec: { type: "number" }
                                }
                            }
                        }
                    },
                    {
                        json: [1, "string", true],
                        spec: {
                            type: 'array',
                            elements: [
                                { index: 1, spec: { type: "string" }},
                                { index: 0, spec: { type: "number" }}
                            ],
                            length: 4
                        },
                        context: 'some.nested.context',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON array doesn't have required length"],
                            context: 'some.nested.context',
                            elements: {
                                1: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.1',
                                    json: "string",
                                    spec: { type: "string" }
                                },
                                0: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.0',
                                    json: 1,
                                    spec: { type: "number" }
                                }
                            }
                        }
                    },
                    {
                        json: [1, "string", true],
                        spec: {
                            type: 'array',
                            elements: [
                                { index: 1, spec: { type: "string" }},
                                { index: 0, spec: { type: "number" }},
                                { index: 2, spec: { type: "object" }}
                            ],
                            length: 3
                        },
                        context: 'some.nested.context',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: [],
                            context: 'some.nested.context',
                            elements: {
                                1: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.1',
                                    json: "string",
                                    spec: { type: "string" }
                                },
                                0: {
                                    valid: true,
                                    errors: [],
                                    context: 'some.nested.context.0',
                                    json: 1,
                                    spec: { type: "number" }
                                },
                                2: {
                                    valid: false,
                                    errors: ["Provided JSON is not an object"],
                                    context: 'some.nested.context.2',
                                    json: true,
                                    spec: { type: "object" }
                                }
                            }
                        }
                    },
                    {
                        json: [1, "string", true],
                        spec: {
                            type: 'array',
                            elements: [
                                { index: 2, spec: { type: "object" }}
                            ],
                            length: 4
                        },
                        context: 'some.nested.context',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON array doesn't have required length"],
                            context: 'some.nested.context',
                            elements: {
                                2: {
                                    valid: false,
                                    errors: ["Provided JSON is not an object"],
                                    context: 'some.nested.context.2',
                                    json: true,
                                    spec: { type: "object" }
                                }
                            }
                        }
                    },
                    {
                        json: {},
                        spec: {
                            type: 'array',
                            length: 4
                        },
                        context: 'some.nested.context',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not an array"],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'array', length: 2 },
                        context: 'some.nested.context',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON array doesn't have required length"],
                            context: 'some.nested.context'
                        }
                    },
                    {
                        json: 1,
                        spec: { type: 'array' },
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not an array"],
                            context: ''
                        }
                    },
                    {
                        json: true,
                        spec: { type: 'array' },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not an array"],
                            context: ''
                        }
                    },
                    {
                        json: "string",
                        spec: { type: 'array' },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not an array"],
                            context: ''
                        }
                    },
                    {
                        json: {},
                        spec: { type: 'array' },
                        context: '',
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: ["Provided JSON is not an array"],
                            context: ''
                        }
                    }
                ];

                _.each(args, tester(true));
            });

            it("validation should always fail", function () {

                args = [
                    {
                        json: [],
                        spec: { type: 'array' },
                        result: false,
                        fullResult: {
                            valid: false,
                            errors: [],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'array' },
                        context: '',
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: ['some error'],
                            context: ''
                        }
                    },
                    {
                        json: [],
                        spec: { type: 'array' },
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
