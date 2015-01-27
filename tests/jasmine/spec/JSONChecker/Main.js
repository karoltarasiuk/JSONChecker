define([
    "lodash",
    "JSONChecker"
], function(
    _,
    JSONChecker
) {

    describe("JSONChecker", function() {

        var checker, args;

        describe("Class instance creation", function () {

            it("should always be a JSONChecker instance", function () {

                args = [
                    { type: 'boolean' },
                    { type: 'number' },
                    { type: 'string' },
                    { type: 'array' },
                    { type: 'object' }
                ];

                _.each(args, function (arg) {

                    checker = new JSONChecker(arg);
                    expect(checker instanceof JSONChecker).toBe(true);
                });
            });

            it("should throw an exception during creation", function () {

                args = [
                    undefined,
                    {},
                    true,
                    false,
                    2,
                    'string',
                    [],
                    { type: 'unknown' }
                ];

                _.each(args, function (arg) {
                    expect(
                        function () {
                            new JSONChecker(arg);
                        }
                    ).toThrow("Provided spec is invalid");
                });
            });
        });
    });
});
