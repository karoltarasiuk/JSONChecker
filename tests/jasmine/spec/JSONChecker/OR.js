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
                    for (i = 0; i < arg.spec.length; i++) {
                        if (_.isArray(arg.fullResult)) {
                            arg.fullResult[i].spec = arg.spec[i];
                            arg.fullResult[i].json = arg.json;
                        } else {
                            arg.fullResult.spec = arg.spec[i];
                            arg.fullResult.json = arg.json;
                        }
                    }

                    comparer = new ObjectComparer();
                    temp1 = result === arg.result;
                    temp2 = comparer.areEqual(fullResult, arg.fullResult);

                    expect(temp1 && temp2).toBe(toBe);

                    if (temp1 && temp2 !== toBe) {
                        console.log('not equal', result, arg.result);
                    }
                };
            };

        describe("Multiple specification per 1 json (OR operator)", function () {

            it("should always validate correctly", function () {

                args = [
                    {
                        json: {},
                        spec: [{
                            type: 'object'
                        }, {
                            type: 'number'
                        }],
                        result: true,
                        fullResult: [{
                            valid: true,
                            errors: [],
                            context: ''
                        }, {
                            valid: false,
                            errors: ['Provided JSON is not a number'],
                            context: ''
                        }]
                    },
                    {
                        json: {a:2},
                        spec: [{
                            type: 'object',
                            properties: [{
                                name: 'a',
                                spec: [{
                                    type: 'object'
                                }, {
                                    type: 'number'
                                }]
                            }]
                        }, {
                            type: 'number'
                        }],
                        result: true,
                        fullResult: [{
                            valid: true,
                            errors: [],
                            context: '',
                            properties: {
                                a: [{
                                    valid: false,
                                    errors: ['Provided JSON is not an object'],
                                    context: 'a',
                                    json: 2,
                                    spec: { type: 'object' }
                                }, {
                                    valid: true,
                                    errors: [],
                                    context: 'a',
                                    json: 2,
                                    spec: { type: 'number' }
                                }]
                            }
                        }, {
                            valid: false,
                            errors: ['Provided JSON is not a number'],
                            context: ''
                        }]
                    },
                    {
                        json: {a:'string'},
                        spec: [{
                            type: 'object',
                            properties: [{
                                name: 'a',
                                spec: [{
                                    type: 'object'
                                }, {
                                    type: 'number'
                                }]
                            }]
                        }, {
                            type: 'number'
                        }],
                        result: false,
                        fullResult: [{
                            valid: false,
                            errors: [],
                            context: '',
                            properties: {
                                a: [{
                                    valid: false,
                                    errors: ['Provided JSON is not an object'],
                                    context: 'a',
                                    json: 'string',
                                    spec: { type: 'object' }
                                }, {
                                    valid: false,
                                    errors: ['Provided JSON is not a number'],
                                    context: 'a',
                                    json: 'string',
                                    spec: { type: 'number' }
                                }]
                            }
                        }, {
                            valid: false,
                            errors: ['Provided JSON is not a number'],
                            context: ''
                        }]
                    },
                    {
                        json: [2],
                        spec: [{
                            type: 'array',
                            elements: [{
                                index: 0,
                                spec: [{
                                    type: 'object'
                                }, {
                                    type: 'number'
                                }]
                            }]
                        }, {
                            type: 'number'
                        }],
                        result: true,
                        fullResult: [{
                            valid: true,
                            errors: [],
                            context: '',
                            elements: {
                                0: [{
                                    valid: false,
                                    errors: ['Provided JSON is not an object'],
                                    context: '0',
                                    json: 2,
                                    spec: { type: 'object' }
                                }, {
                                    valid: true,
                                    errors: [],
                                    context: '0',
                                    json: 2,
                                    spec: { type: 'number' }
                                }]
                            }
                        }, {
                            valid: false,
                            errors: ['Provided JSON is not a number'],
                            context: ''
                        }]
                    },
                    {
                        json: ['string'],
                        spec: [{
                            type: 'array',
                            elements: [{
                                index: 0,
                                spec: [{
                                    type: 'object'
                                }, {
                                    type: 'number'
                                }]
                            }]
                        }, {
                            type: 'number'
                        }],
                        result: false,
                        fullResult: [{
                            valid: false,
                            errors: [],
                            context: '',
                            elements: {
                                0: [{
                                    valid: false,
                                    errors: ['Provided JSON is not an object'],
                                    context: '0',
                                    json: 'string',
                                    spec: { type: 'object' }
                                }, {
                                    valid: false,
                                    errors: ['Provided JSON is not a number'],
                                    context: '0',
                                    json: 'string',
                                    spec: { type: 'number' }
                                }]
                            }
                        }, {
                            valid: false,
                            errors: ['Provided JSON is not a number'],
                            context: ''
                        }]
                    },
                    {
                        json: {},
                        spec: [{
                            type: 'object'
                        }],
                        result: true,
                        fullResult: {
                            valid: true,
                            errors: [],
                            context: ''
                        }
                    }
                ];

                _.each(args, tester(true));
            });
        });
    });
});
