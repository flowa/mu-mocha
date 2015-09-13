const _ = require('lodash'),
  {test, build} = require('../src'),
  expect = require('chai').expect

function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}


test("TestForFn.js test", {
  "Test default instantiation mechanism": () => {
    var instance = build.TestForFn(add)
    expect(instance.test).to.be.a.function
    expect(instance.fnToTest).to.be.a.function
    expect(instance.data).to.be.deep.equal([])
    expect(instance.name).to.be.function
  },

  "Test default name function": () => {
    var instance = build.TestForFn(add)
    expect(instance.name).to.be.a.funtion
    expect(instance.name({inputParams: [1]})).to.be.equal("Test function 'add' with params: 1")
    expect(instance.name({inputParams: [1,2]})).to.be.equal("Test function 'add' with params: 1,2")
  },

  "test that add() function can be tested with API by actually testing it":
    build.TestForFn(add)
      .withParams([1, 2]      ).itShouldReturn(3)
      .withParams([1, 2, 3]   ).itShouldReturn(6)
      .withParams([1, 2, 3, 4]).itShouldReturn(10),

  "setNameFn method should set name functions": () => {
    var instance = build.TestForFn(add)
    instance.setNameFn((item) => "hello " + item)
    expect(instance.name).to.be.a.function
    expect(instance.name('foo')).to.be.equal("hello foo")
  },

  "bindContext should allow user to bind anything to test builder": () => {
    var instance = build.TestForFn(add)
    instance.bindContext((builder) => builder.attribute = 1)
    expect(instance.attribute).to.be.equal(1)
  }
})
