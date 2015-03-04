#JSONChecker docs

##Get started

```
var json = {},
    spec = {
        type: "object"
    },
    checker = new JSONChecker(spec);

console.log(checker.check(json, 'object'));

// OUTPUTS:
// true

console.log(checker.getLastReport());

// OUTPUTS:
// {
//     valid: true,
//     errors: [],
//     context: "object"
// }
```

Second param passed to the `check` method is simply an initial `context`. See more about specifications below, to get the idea what context really is.

##Defining a specification

You've already noticed that specification contains a `type`. There a several available types you can use:

- boolean
- number
- string
- array
- object

Every object type can contain different properties it accepts to allow you to be even more precise with defining a specification.

###Boolean type

No extra properties - type only.

###Number type

No extra properties - type only.

###String type

####_length_

By setting this property you're simply telling that expected string must have some arbitrary length, e.g.

```
var json = "JSONChecker",
    spec = {
        type: "string",
        length: 11
    },
    checker = new JSONChecker(spec);

console.log(checker.check(json));
```

###Array type

####_length_

By setting this property you're simply telling that expected array must have some arbitrary length, e.g.

```
var json = [],
    spec = {
        type: "arrayg",
        length: 0
    },
    checker = new JSONChecker(spec);

console.log(checker.check(json));
```

####_elements_

By using this property you can create nested specification for some specific element, e.g.

```
var json = [1],
    spec = {
        type: "array",
        elements: [{
            index: 0,
            spec: {
                type: "number"
            }
        }]
    },
    checker = new JSONChecker(spec);

console.log(checker.check(json));
```

###Object type

####_properties_

By using this property you can create nested specification for some specific property, e.g.

```
var json = {a:1},
    spec = {
        type: "object",
        properties: [{
            name: "a",
            spec: {
                type: "number"
            }
        }]
    },
    checker = new JSONChecker(spec);

console.log(checker.check(json));
```

##Multiple specifications

Specification can be also passed as an array of specification objects, e.g.

```
var json = {},
    spec = [{
        type: 'object'
    }, {
        type: 'number'
    }],
    checker = new JSONChecker(spec);

console.log(checker.check(json));
```

This way you can allow two different json types to be valid. In this particular case json can be an object or can be a number.
Array of specifications also apply when we define object properties or array elements, e.g.

```
var json = {a:'string'},
    spec = [{
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
    checker = new JSONChecker(spec);

console.log(checker.check(json));
```

When you define a specification for child property (e.g. for `a`) as an array, and each of those specifications will fail,
parent object will be invalid as well, as JSONChecker iterates through each child and passes validation result to its parent.
This is why validation of the previous example will fail.

When the specification is given as an array, but contains only one element, it will be converted to the object.

Note also that following way of defining a spec is invalid and will raise an error:

```
var spec = [{
        type: 'object',
        properties: [{
            name: 'a',
            spec: {
                type: 'object'
            }
        }, {
            name: 'a',
            spec: {
                type: 'number'
            }
        }]
    }, {
        type: 'number'
    }];
```

##Context

As I already mentioned initial `context` can be passed when running a check on specific json data. By default it's an empty string.
Context is simply dot separated string storing the location of currently processed json. Let's see it on the following example:

```
var json = {
    a: {
        b: {
            c: {
                d: {
                    e: 1
                }
            }
        }
    }
};
```

The context of value `1` is `a.b.c.d.e`. The context of `{e:1}` is `a.b.c.d`. The context of `{b:{c:{d:{e:1}}}}` is simply `a`.
In comparison with objects, arrays context, instead of keys uses indexes. Context information is always being returned with the
result of validation, and allows you to quickly find which portion of json was validated.

Setting initial `context` allows you to prepend some information, in case of passing only part of your json data.
