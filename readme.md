# Reasoning

Mu-mocha is a wrapper around Mocha-test runner. The main design principles are:

1. **Less boilerplate**. While Mocha (and other BDD-frames) is generally less verbose
than TDD traditionally, there's still quite a lot boilerplate code that is not
necessary. Mu-mocha tries to reduce amount of boilerplate code.
2. **Context driven approach**. In the most popular test frameworks, the background
presupposition seems to be that the optimal way to unit test code is more or
lest the same in all cases. Usually, test frameworks are not easy to extend
so that testing different types of code would be as simple as possible. The most
popular frameworks also lack simple and efficient way to write data driven tests.

Mu-mocha makes data driven testing easier and allows you to write your own test builder
that makes testing of your code as simple as possible.


# Installing Mu-mocha

In order to use Mu-mocha you need to take care of two things:

1. Ensure that you can use ES6 in tests. There are many ways to take care of this.
Mu-mocha uses Babel and I instruct you to use it, but you can use another approach.
2. Install and configure Mocha. Then install Mu-mocha .
3. Ensure you have configured mocha to seek the test from correct place.

**Step 1.**  Install Babel (or enable use of ES6 in tests in another way.)

First install Babel from npm:
```
npm install babel --save-dev
```

Then run Mocha with ```--compilers js:babel/register``` switch.

You can also add this to packages.json or use any other mocha compatible build tool
like Gulp, Grunt or WebPack. Internally Mu-mocha uses npm script for tests.

```
"scripts": {
  "test": "mocha --compilers js:babel/register"
},
```

**Step 2.** Install Mocha and Mu-mocha by using npm:

```
npm install mocha --save-dev
npm install mu-mocha  --save-dev
```

**Step 3.** Ensure you have configured Mocha to seek the test from correct place.

By default Mocha seeks test from test folder. If you go with the default create
test folder for your tests.

You can also configura mocha to seek tests by file name pattern (e.g. seek files by pattern *.spec.js)

# Getting started

## Basic usage

You just need to pass and object to run Mu-mocha's ```test``` function.

```
var test = require('mu-mocha ').test,
    expect = require('chai').expect

test({
  "This is Mu-mocha descriptions": {
    "This is Mu-mocha test name":    () => expect(true).to.be.true,
    "This is inner description block": {
      "This is another Mu-mocha test": () => expect(true).to.be.true,  
    }
  }
})
```


This is same as:
```
describe("This is Mocha descriptions", function(){
  it("This is Mocha test name", function(){
    expect(true).to.be.true
  })
  describe("This is inner description block, function(){
    it("This is another Mocha test", function(){
      expect(true).to.be.true
    })
  })
})
```

## How it works

Mocha build a test tree that have two kind of nodes: describe (or context)
nodes and tests. In Mocha you build an expression tree by using describe- and
it-functions. describe and it are actually global functions that executes
that expression three you past to them as parameters.

In in Mu-mocha you use have this information in an object graph. Minimal
mocha converts an object graph into Mocha's function and then and Mocha test
runner takes care of everything else.

In practice Mu-mocha's ```test```-function loops through the all object's
attributes recursively, and converts them into mocha function calls.

There are two main rules:

1. Attributes have a function as are actual tests, what will be converted into
it-function calls. With one exception:
  1. If attribute name is after, afterEach, before, or beforeEach it will be
  converted into the corresponding Mocha test hook functions. I.e. if you need to have
  tests which name is 'after', 'afterEach', 'before' or 'beforeEach', don't use
  Minimal  Mocha - write them with Mocha instead.
2. Attributes that have an object as its value are description nodes. There is an exception to this rule:
  1. if object have both 1) ```data``` and 2) ```test``` attributes, it will be converted into a test. (Notice: ```test``` attribute must be a function and ```data``` attribute must be either an array or an object. Notice also that 'test' and 'data' are reserved word and cannot be used in the names of tests just like you cannot use names of Mocha test hooks.)


Example:

```
test({
  // Attribute values is a object and neither of the exceptions applies --> describe block
  "Mu-mocha variant for nesting tests" : {
    // Again attribute values is a object and neither of the exceptions applies --> describe block
    "Boolean tests": {
      // Attribute values is a function and the for rule 1 does apply --> after block
      after: () -> {}
      // Attribute values is a function and the for rule 1 does not apply --> it block
      "Test that true is true": () => expect(true).to.be.true,
      // Attribute values is object, but exception 1 applies -> it block
      "Test that 1,2,3 are truthy": {
          data: [1,2,3];
          test: () => expect(1).to.be.ok
      }
    }
})
```

## Overloads for ```test``` function

The main idea is to trip off everything that is not necessary, in this case
describe and it function-names and a lot of brackets. Passing a object graph that
converted into an executable expression tree reduce a quite a lot of them.
However there are still way extra brackets you can get ride of:

You can also call test function with following parameters:

### 1. test(name: string, testGraph: object)

I.e.
```
test("Test(string, object): This is Mu-mocha descriptions",
  {
    "This is Mu-mocha test name":    () => expect(true).to.be.true,
    "This is another Mu-mocha test": () => expect(true).to.be.true
  })
```

Is same as:
```
test({
  "Test(string, object): This is Mu-mocha descriptions":
  {
    "This is Mu-mocha test name":    () => expect(true).to.be.true,
    "This is another Mu-mocha test": () => expect(true).to.be.true
  }
})
```

Saves: {} if you have only one root description for all tests.

### 2. test(name: string, testFn : function)

For instance

```
test("This is Mu-mocha test",  () => expect(true).to.be.true)
```

...is same as...

```
it("This is Mu-mocha test",  function(){ expect(true).to.be.true })
```

This is here for sake of consistency, savings comes from ES6 lamda syntact and
you can use it with Mocha as well.

### 3. test(name: string, data: array or object, testFn : function)**

E.g.
```
var counter = 1
test("Test(string, data, function): This is Mu-mocha test",
    [1,2,3],
    (item) => expect(item).to.be.equal(counter++))
```

---------------------------------------------------------------------------------------

# Data driven tests

Mu-mocha offers a set of tools for data driven testing. It's easier to
explain this by using and examples.

Task: You need to write a set of test for following function:

```
function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}
```

In Mu-mocha a test is *data driven* if (see main rule 2, exception 1):

* attribute values is an object.
* the object have a ```data``` attribute.
* the object have a ```test``` attribute that is a functions. (or testWithContext)

In addition

* the object can have other attributes, in currently you can pass name creation
function in the name attribute.

In practice:
```
test({
  "Data driven test must have...":
    data: ["attribute", "that", "is", "a", "array", "and", "..."]
    test: (param) => {
      /* test attributer must be a function and takes data in array as the first
         parameter and optionally async test's done function as second parameter */
    }
})
```

Thanks to test-funtion overloads you wan be even less verbose:
```
test("Data driven test must have...",
    ["attribute", "that", "is", "a", "array", "and", "..."],
    (param) => {
      /* test attributer must be a function and takes data in array as the first
         parameter and optionally async test's done function as second parameter */
    })
```



In practice:
```

test('Mu-mocha tests for add()':
  {
    data: [
      {args: [1, 2],       expected: 3},
      {args: [1, 2, 3],    expected: 6},
      {args: [1, 2, 3, 4], expected: 10}
    ],
    name: (item) => 'correctly adds ' + item.args.length + ' args',
    test: (data) => {
      var res = add.apply(null, data.args);
      assert.equal(res, data.expected);
    }
  })
```

In Mocha this is the simplest way to write this kind of test:
```
describe('Mocha tests for add()', function() {
  var tests = [
    {args: [1, 2],       expected: 3},
    {args: [1, 2, 3],    expected: 6},
    {args: [1, 2, 3, 4], expected: 10}
  ];

  tests.forEach(function(test) {
    it('correctly adds ' + test.args.length + ' args', function() {
      var res = add.apply(null, test.args);
      assert.equal(res, test.expected);
    });
  });
});
```

## Make data driven testing even more terse with builders

In the example above Mu-mocha reduces only a bit unnecessary boilerplate.
This is where builders comes into picture. You can write the test above as follows:

```
test('Mu-mocha tests for add()':
  build.TestForFn(add)
    .withParams([1, 2]      ).itShouldReturn(3)
    .withParams([1, 2, 3]   ).itShouldReturn(6)
    .withParams([1, 2, 3, 4]).itShouldReturn(10)
  })
```

This is a lot shorter than Mocha implementation and also a lot more readable.

## Default test builders

Currently there are to test builders:

1. TestForFn and
1. TestForData

### Common functions available in all builders

* **bindContext(bindFn: function)** bind variables and attributes to builder object. E.g. ```builder.TestForData([1]).bindContext(builder => builder.counter = 0)```. Remember great power comes with great responsibility. You can mutate builder in the way, that breaks it. If you decide to do so, it's your problem. If you don't want to have this responsibility, don't use bindContext method.
* **setNameFn(nameFn: function)** sets formating function for test name.
* **setBeforeFn(beroreFn: function)** sets before function. As in bindContext function builder context is available and can be mutated. Be careful!
* **setBeforeEachFn(beroreEachFn: function)** sets beforeEach function. As in bindContext function builder context is available and can be mutated. Be careful!
* **setAfterFn(beroreEachFn: function)** sets beforeEach function. As in bindContext function builder context is available and can be mutated. Be careful!
* **setAfterEachFn(beroreEachFn: function)** sets beforeEach function. As in bindContext function builder context is available and can be mutated. Be careful!


### 1. TestForFn(fn : function)

Fluent API (non chared members):

* **ofInstance(instance:object)**. Test builder call function by using apply functions. If you don't set instance this will be null.
* **withParam(inputParam : array of anything)**. This does not do anything if you dont call also ShouldReturn
* **isShouldReturn(returnValue : anything)** Adds a test data row for inputParam-returnValue pair.
* **setNameFn(nameFn: function)** sets formating function for test name.

### 2. TestForData(data : array or object)**

Fluent API (non chared members):

* **setTestFn(testFn : function)** Test funtion takes one or two parameters. The first parameter is current item in loop. The second (optional) param is Mocha's done function that can be used for asycn tests.
* **setTestWithContextFn(testFn : function)** testFn function takes two or three parameters. The first parameter is builder context, the second attribute is current item in the loop. The third (optional) parameter is Mocha's done function.

## Writing your own builders

Builder is a class that have data, test or testWithContext attributes, and that
is registered in for Mu-mocha builder. If you want to build your own test
builder use default builders as and example and register them as by using
builder objects ```register``` functions before you call ```test```-functions:

```
// Register
builder.register('MyTestBuilder', () => { /* return test object graph */})

// Use
test('Mu-mocha tests for add()': build.MyTestBuilder() })
```

# Future ideas

## 1. Allow reading test data from file.

```
// BOTH for TestForData-builder
builder.TestForData()
       .fromFile(path).mapRows(mapFn)
       .setTestFn(fn)

// AND for TestForFn-builder
builder.TestForFn(fn)
       .dataFromFile(path)
          .mapInputParams(mapFn)
          .mapExpectedReturnValue(mapFn)
```

## 2. Test builder for React. APi could be something like this:

```
builder.TestReactComponent(component)
       .CreateWithProps({ /* props heres */})
       .AfterRender((item, renderedComponent) => { /* do tests */ })
```

## 3. Some kind of support for mocking e.g. by embedding sinon into builder API.
