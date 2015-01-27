define([
    'lodash'
], function (
    _
) {

    var JSONChecker = function (specification) {

        if ((
            !_.isArray(specification) ||
            specification.length < 1
        ) && (
            !JSONNodeTools.isPlainObject(specification) ||
            !_.isString(specification.type) ||
            !JSONNodeTools.typeExists(specification.type)
        )) {
            throw JSONNodeConstants.ERRORS.SPEC_NOT_VALID;
        }

        this.specification = specification;
    };

    _.extend(JSONChecker.prototype, {

        /**
         * Performs check on the passed valid JSON value against specification
         * passed in a constructor.
         *
         * Context (optional) is the initial location of the passed JSON expressed
         * in string using 'dot' notation. E.g. for
         *
         * var obj = {
         *     a: {
         *         a1: 1
         *     },
         *     b: 1
         * }
         *
         * - if you pass obj.a, passed context should be 'a'
         * - if you pass obj.a.a1, passed context should be 'a.a1'
         *
         * @param  {[JSON]} json
         * @param  {[string]} context (optional)
         *
         * @return {[type]}         [description]
         */
        check: function (json, context) {

            if (!_.isString(context)) {
                context = '';
            }

            var rootNode = JSONNodeFactory.createNode(
                json,
                this.specification,
                context
            );

            if (rootNode) {
                return rootNode.check();
            } else {
                return null;
            }
        }
    });

    var JSONNodeConstants = {

        // according to http://www.json.org/
        VALUE_TYPES: {
            ARRAY: 'array',
            OBJECT: 'object',
            STRING: 'string',
            NUMBER: 'number',
            // boolean is not a JSON value type, it's just a generalization
            // for true and false together
            BOOLEAN: 'boolean',
            TRUE: 'true',
            FALSE: 'false',
            NULL: 'null'
        },

        ERRORS: {
            SPEC_NOT_VALID: "Provided spec is invalid",
            SPEC_NOT_ARR_OBJ: "Specification must be either array or object",
            SPEC_TYPE_MISSING: "Specification must contain type",
            SPEC_NAME_MISSING: "Object properties specifications must contain name",
            SPEC_INDEX_MISSING: "Array elements specifications must contain index",
            VALUE_NOT_BOOLEAN: "Provided JSON is not boolean",
            VALUE_NOT_NUMBER: "Provided JSON is not a number",
            VALUE_NOT_STRING: "Provided JSON is not a string",
            VALUE_NOT_OBJECT: "Provided JSON is not an object",
            VALUE_NOT_ARRAY: "Provided JSON is not an array",
            VALUE_ARRAY_LENGTH: "Provided JSON array doesn't have required length",
            VALUE_STRING_LENGTH: "Provided JSON string doesn't have required length",
            VALUE_PROPERTY_MISSING: "Property missing in provided JSON object",
            VALUE_ELEMENT_MISSING: "Element missing in provided JSON array"
        }
    };

    var JSONNodeTools = {

        isTrue: function (val) { return val === true; },
        isFalse: function (val) { return val === false; },
        isPlainObject: function (val) {
            return _.isObject(val) && !_.isArray(val);
        },
        typeExists: function (type) {

            if (!_.isUndefined(type)) {

                for (var i in JSONNodeConstants.VALUE_TYPES) {

                    if (
                        JSONNodeConstants.VALUE_TYPES.hasOwnProperty(i) &&
                        JSONNodeConstants.VALUE_TYPES[i] === type
                    ) {
                        return true;
                    }
                }
            }

            return false;
        },
        typeError: function (type) {

            switch (type) {
                case "boolean":
                    return JSONNodeConstants.ERRORS.VALUE_NOT_BOOLEAN;
                case "number":
                    return JSONNodeConstants.ERRORS.VALUE_NOT_NUMBER;
                case "string":
                    return JSONNodeConstants.ERRORS.VALUE_NOT_STRING;
                case "object":
                    return JSONNodeConstants.ERRORS.VALUE_NOT_OBJECT;
                case "array":
                    return JSONNodeConstants.ERRORS.VALUE_NOT_ARRAY;
            }

            return "Specified type is wrong";
        }
    };

    var JSONNodeFactory = {

        /**
         * Detects the type of the node from passed JSON, and creates an instance
         * of it.
         *
         * @param  {[JSON]} json
         * @param  {[JSON]} specification
         * @param  {[string]} context
         *
         * @return {[
         *     null,
         *     JSONNodeBoolean,
         *     JSONNodeInteger,
         *     JSONNodeString,
         *     JSONNodeArray,
         *     JSONNodeObject
         * ]}
         */
        createNode: function (json, specification, context) {

            var obj;

            if (_.isArray(json)) {
                obj = new JSONNodeArray();
            } else if (JSONNodeTools.isPlainObject(json)) {
                obj = new JSONNodeObject();
            } else if (_.isString(json)) {
                obj = new JSONNodeString();
            } else if (_.isNumber(json) && !_.isNaN(json)) {
                obj = new JSONNodeNumber();
            } else if (_.isBoolean(json)) {
                obj = new JSONNodeBoolean();
            } else {
                return null;
            }

            obj.initialize(json, specification, context);
            return obj;
        }
    };

    var JSONNode = function () {};

    _.extend(JSONNode.prototype, {

        initialize: function(json, specification, context) {

            this.json = json;
            this.specification = specification;
            this.context = context;
        },

        check: function () {

            var i, actualCheck, ret,
                that = this;

            actualCheck = function (specification) {

                if (JSONNodeTools.typeExists(specification.type)) {

                    return that.checkAgainstOneSpec(specification);

                } else {

                    return {
                        valid: false,
                        context: that.context,
                        errors: [JSONNodeConstants.ERRORS.SPEC_TYPE_MISSING]
                    };
                }
            };

            // when spec is an array but contains only one element
            if (_.isArray(this.specification) && this.specification.length === 1) {
                this.specification = this.specification[0];
            }

            // every rule in an array is treated with OR operator
            if (_.isArray(this.specification)) {

                ret = [];

                // iterate through every spec and collect return values
                for (i = 0; i < this.specification.length; i++) {

                    ret.push(actualCheck(this.specification[i]));
                }

                return ret;

            // there is one single rule only
            } else if (JSONNodeTools.isPlainObject(this.specification)) {

                return actualCheck(this.specification);

            // specification must be either array or object
            } else {

                return {
                    valid: false,
                    context: this.context,
                    errors: [JSONNodeConstants.ERRORS.SPEC_NOT_ARR_OBJ]
                };
            }
        },

        checkAgainstOneSpec: function (specification) {

            return this.chainChecks(
                specification,
                _.bind(this.checkType, this)
            );
        },

        checkType: function (specification) {

            var ret = {
                context: this.context,
                errors: []
            };

            if (specification.type === this.type) {

                ret.valid = true;

            } else {

                ret.valid = false;
                ret.errors.push(
                    JSONNodeTools.typeError(specification.type)
                );
            }

            return ret;
        },

        /**
         * Allows chaining of check functions. Check functions need to be bound
         * to the object they should be invoked on, e.g.
         * _.bind(checkFunction, this);
         *
         * @return {[type]} [description]
         */
        chainChecks: function () {

            var i, j, k, ret,
                rets = [],
                specification = arguments[0];

            ret = {
                valid: true,
                errors: []
            };

            // iterating through check functions and caching check result
            for (k = 1; k < arguments.length; k++) {
                if (_.isFunction(arguments[k])) {
                    rets.push(arguments[k](specification));
                }
            }

            for (i = 0; i < rets.length; i++) {

                if (rets[i].valid === false) {

                    ret.valid = false;

                    for (j = 0; j < rets[i].errors.length; j++) {

                        ret.errors.push(rets[i].errors[j]);
                    }
                }

                // context should be the same for all check
                // functions so we can overwrite anytime,
                ret.context = rets[i].context;

                // object specification can contain properties
                // specifications as well
                if (JSONNodeTools.isPlainObject(rets[i].properties)) {

                    ret.properties = rets[i].properties;
                }

                // object specification can contain elements
                // specifications as well
                if (JSONNodeTools.isPlainObject(rets[i].elements)) {

                    ret.elements = rets[i].elements;
                }
            }

            ret.spec = specification;
            ret.json = this.json;

            return ret;
        }
    });

    var JSONNodeBoolean = function () {};

    _.extend(JSONNodeBoolean.prototype, JSONNode.prototype, {

        type: JSONNodeConstants.VALUE_TYPES.BOOLEAN
    });

    var JSONNodeNumber = function () {};

    _.extend(JSONNodeNumber.prototype, JSONNode.prototype, {

        type: JSONNodeConstants.VALUE_TYPES.NUMBER
    });

    var JSONNodeString = function () {};

    _.extend(JSONNodeString.prototype, JSONNode.prototype, {

        type: JSONNodeConstants.VALUE_TYPES.STRING,

        checkAgainstOneSpec: function (specification) {

            return this.chainChecks(
                specification,
                _.bind(this.checkType, this),
                _.bind(this.checkLength, this)
            );
        },

        checkLength: function (specification) {

            var ret = {
                valid: true,
                context: this.context,
                errors: []
            };

            if (
                _.isNumber(specification.length) &&
                !_.isNaN(specification.length) &&
                this.json.length !== specification.length
            ) {

                ret.valid = false;
                ret.errors.push(JSONNodeConstants.ERRORS.VALUE_STRING_LENGTH);
            }

            return ret;
        }
    });

    var JSONNodeArray = function () {};

    _.extend(JSONNodeArray.prototype, JSONNode.prototype, {

        type: JSONNodeConstants.VALUE_TYPES.ARRAY,

        checkAgainstOneSpec: function (specification) {

            return this.chainChecks(
                specification,
                _.bind(this.checkType, this),
                _.bind(this.checkLength, this),
                _.bind(this.checkElements, this)
            );
        },

        checkLength: function (specification) {

            var ret = {
                valid: true,
                context: this.context,
                errors: []
            };

            if (
                _.isNumber(specification.length) &&
                !_.isNaN(specification.length) &&
                this.json.length !== specification.length
            ) {

                ret.valid = false;
                ret.errors.push(JSONNodeConstants.ERRORS.VALUE_ARRAY_LENGTH);
            }

            return ret;
        },

        checkElements: function (specification) {

            var i, j, temp, context, index,
                ret = {
                valid: true,
                context: this.context,
                errors: []
            };

            if (!_.isArray(specification.elements)) {
                return ret;
            }

            for (i = 0; i < specification.elements.length; i++) {

                if (
                    !JSONNodeTools.isPlainObject(specification.elements[i])
                ) {
                    continue;
                }

                // if index is missing, we talk about any element
                if (_.isUndefined(specification.elements[i].index)) {

                    ret.valid = false;
                    ret.errors.push(
                        JSONNodeConstants.ERRORS.SPEC_INDEX_MISSING
                    );
                }

                index = specification.elements[i].index;

                // if the element with specified index doesn't exist
                if (_.isUndefined(this.json[index])) {

                    ret.valid = false;
                    ret.errors.push(
                        JSONNodeConstants.ERRORS.VALUE_ELEMENT_MISSING
                    );

                    continue;
                }

                // if there is no additional specification for an element
                if (_.isUndefined(specification.elements[i].spec)) {

                    continue;
                }

                context = this.context + (this.context === '' ? '' : '.')
                    + index;

                var node = JSONNodeFactory.createNode(
                    this.json[index],
                    specification.elements[i].spec,
                    context
                );

                if (node) {

                    if (!JSONNodeTools.isPlainObject(ret.elements)) {
                        ret.elements = {};
                    }

                    ret.elements[index] = node.check();

                    // if any of the properties is not valid,
                    // parent node is invalid too
                    if (_.isArray(ret.elements[index])) {

                        temp = false;

                        // array of specs work with OR operator, if one is
                        // valid, the spec is valid as a whole
                        for (j = 0; j < ret.elements[index].length; j++) {
                            temp = temp || ret.elements[index][j].valid;
                        }

                        if (temp === false) {
                            ret.valid = false;
                        }

                    } else if (ret.elements[index].valid === false) {
                        ret.valid = false;
                    }
                }
            }

            return ret;
        }
    });

    var JSONNodeObject = function () {};

    _.extend(JSONNodeObject.prototype, JSONNode.prototype, {

        type: JSONNodeConstants.VALUE_TYPES.OBJECT,

        checkAgainstOneSpec: function (specification) {

            return this.chainChecks(
                specification,
                _.bind(this.checkType, this),
                _.bind(this.checkProperties, this)
            );
        },

        checkProperties: function (specification) {

            var i, j, temp, context, name,
                ret = {
                valid: true,
                context: this.context,
                errors: []
            };

            if (!_.isArray(specification.properties)) {
                return ret;
            }

            for (i = 0; i < specification.properties.length; i++) {

                if (
                    !JSONNodeTools.isPlainObject(specification.properties[i])
                ) {
                    continue;
                }

                // property name can't be missing
                if (_.isUndefined(specification.properties[i].name)) {

                    ret.valid = false;
                    ret.errors.push(
                        JSONNodeConstants.ERRORS.SPEC_NAME_MISSING
                    );
                }

                name = specification.properties[i].name;

                // when property is defined but not found in the JSON
                if (_.isUndefined(this.json[name])) {

                    ret.valid = false;
                    ret.errors.push(
                        JSONNodeConstants.ERRORS.VALUE_PROPERTY_MISSING
                    );

                    continue;
                }

                // check whether spec for required property is provided
                if (_.isUndefined(specification.properties[i].spec)) {

                    continue;
                }

                context = this.context + (this.context === '' ? '' : '.')
                    + name;

                var node = JSONNodeFactory.createNode(
                    this.json[name],
                    specification.properties[i].spec,
                    context
                );

                if (node) {

                    if (!JSONNodeTools.isPlainObject(ret.properties)) {
                        ret.properties = {};
                    }

                    ret.properties[name] = node.check();

                    // if any of the properties is not valid,
                    // parent node is invalid too
                    if (_.isArray(ret.properties[name])) {

                        temp = false;

                        // array of specs work with OR operator, if one is
                        // valid, the spec is valid as a whole
                        for (j = 0; j < ret.properties[name].length; j++) {
                            temp = temp || ret.properties[name][j].valid;
                        }

                        if (temp === false) {
                            ret.valid = false;
                        }

                    } else if (ret.properties[name].valid === false) {
                        ret.valid = false;
                    }
                }
            }

            return ret;
        }
    });

    return JSONChecker;
});
