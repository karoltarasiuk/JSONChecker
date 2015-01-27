/*
 * ObjectComparer v1.1.0
 * License: https://github.com/karoltarasiuk/ObjectComparer/blob/master/LICENSE.md
 * Version: https://github.com/karoltarasiuk/ObjectComparer/releases/tag/v1.1.0
 */
define(function () {

    /**
     * Compares plain objects by sorting properties alphabetically
     * and creating a JSON string to compare.
     *
     * Passing true will make it compare inherited properties as well.
     *
     * @param {[boolean]} dontUseHasOwnProperty
     */
    var ObjectComparer = function (dontUseHasOwnProperty) {

        if (dontUseHasOwnProperty !== true) {
            dontUseHasOwnProperty = false;
        }

        this.dontUseHasOwnProperty = dontUseHasOwnProperty;
    };

    /**
     * Returns true if all objects are equal, false otherwise.
     * Pass any number of objects to compare at once.
     *
     * @return {[boolean]}
     */
    ObjectComparer.prototype.areEqual = function () {

        var i, j, found,
            jsons = [];

        if (arguments.length < 2) {
            throw "min 2 arguments needed";
        }

        this.objects = arguments;

        for (i = 0; i < this.objects.length; i++) {
            jsons.push(JSON.stringify(
                copyObjectAlphabetically(this.objects[i], this.dontUseHasOwnProperty)
            ));
        }

        for (i = 0; i < jsons.length; i++) {
            for (j = 0; j < jsons.length; j++) {
                if (i !== j && jsons[i] !== jsons[j]) {
                    found = true;
                }
            }
        }

        if (found) {
            return false;
        }

        return true;
    };

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
    if (!Array.isArray) {
        Array.isArray = function(arg) {
           return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }

    // http://underscorejs.org/docs/underscore.html#section-134
    var isObject = function (obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    var extractPropertiesAlphabetically = function (obj, dontUseHasOwnProperty) {

        var i,
            properties = [];

        for (i in obj) {
            if (dontUseHasOwnProperty || obj.hasOwnProperty(i)) {
                properties.push(i);
            }
        }

        return properties.sort();
    };

    var copyObjectAlphabetically = function (obj, dontUseHasOwnProperty) {

        var i, arr, ret;

        if (Array.isArray(obj)) {
            ret = [];
            for (i = 0; i < obj.length; i++) {
                ret[i] = copyObjectAlphabetically(obj[i], dontUseHasOwnProperty);
            }
        } else if (isObject(obj)) {
            ret = {};
            arr = extractPropertiesAlphabetically(obj, dontUseHasOwnProperty);
            for (i = 0; i < arr.length; i++) {
                ret[arr[i]] = copyObjectAlphabetically(obj[arr[i]], dontUseHasOwnProperty);
            }
        } else {
            ret = obj;
        }

        return ret;
    };

    return ObjectComparer;
});
