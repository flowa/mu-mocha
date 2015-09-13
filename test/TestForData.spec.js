const _ = require('lodash'),
      {test, build} = require('../src'),
      expect = require('chai').expect

test("TestForData.js test", {
  "Test default instantiation mechanism": () => {
    var instance = build.TestForData([1])
    expect(instance.test).to.be.a.function
    expect(instance.data).to.be.deep.equal([1])
    expect(instance.name).to.be.null
  },

  "setNameFn method should set name functions": () => {
    var instance = build.TestForData([1])
    expect(instance.name).to.be.null
    instance.setNameFn((item) => "hello " + item)
    expect(instance.name).to.be.a.function
    expect(instance.name('foo')).to.be.equal("hello foo")
  },

  "setTestFn should set test functions": () => {
    var instance = build.TestForData([1])
    instance.setTestFn((item) => "works " + item)
    expect(instance.test(1)).to.be.equal("works 1")
  },

  "setTestFn should set async test functions": (done) => {
    var instance = build.TestForData([1])
    instance.setTestFn((item, done1) => {
      done1();
      return "works " + item;
    })

    expect(instance.test(1, done)).to.be.equal("works 1")
  },

  "bindContext should allow user to bind anything to test builder": () => {
    var instance = build.TestForData([1])
    instance.bindContext((builder) => builder.attribute = 1)
    expect(instance.attribute).to.be.equal(1)
  },

  "setTestWithContextFn should allow use of builder as a context in tests": () => {
    var instance = build.TestForData([1])
    instance.bindContext((builder) => builder.attribute = 1)

    instance.setTestWithContextFn((context, item) => {
      expect(context.attribute).to.be.equal(1)
      return "works " + item;
    })

    expect(instance.test(1)).to.be.equal("works 1")
  },

  "setTestWithContextFn should allow use of builder as a context in async tests": (done) => {
    var instance = build.TestForData([1])
    instance.bindContext((builder) => builder.attribute = 1)

    instance.setTestWithContextFn((context, item, done1) => {
      expect(context.attribute).to.be.equal(1)
      done1()
      return "works " + item;
    })
    expect(instance.test(1, done)).to.be.equal("works 1")
  }
})
