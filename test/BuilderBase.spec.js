const { test, build } = require("../src"),
    BuilderBase = require("../src/builders/BuilderBase.js"),
    expect = require('chai').expect;

test("BuilderBase.js test", {
  "Test default constructor": () => {
    var instance = new BuilderBase()
    expect(instance.test).to.be.a.function
    expect(instance.data).to.be.deep.equal([])
    expect(instance.name).to.be.null
  },

  "setNameFn method should set name functions": () => {
    var instance = new BuilderBase()
    expect(instance.name).to.be.null
    instance.setNameFn((item) => "hello " + item)
    expect(instance.name).to.be.a.function
    expect(instance.name('foo')).to.be.equal("hello foo")
  },

  "bindContext should allow user to bind anything to test builder": () => {
    var instance = new BuilderBase()
    instance.bindContext((builder) => builder.attribute = 1)
    expect(instance.attribute).to.be.equal(1)
  },

  "setBeforeFn": () => {
    var instance = new BuilderBase()
    expect(instance.before).to.be.undefined
    expect(instance.attribute).to.be.undefined
    instance.attr = 1

    instance.setBeforeFn((builder) => builder.attribute = instance.attr)
    expect(instance.before).to.be.function

    instance.before()
    expect(instance.attribute).to.be.equal(1)
  },

  "setBeforeEachFn": () => {
    var instance = new BuilderBase()
    expect(instance.beforeEach).to.be.undefined
    expect(instance.attribute).to.be.undefined
    instance.attr = 1

    instance.setBeforeEachFn((builder) => builder.attribute = instance.attr)
    expect(instance.beforeEach).to.be.function

    instance.beforeEach()
    expect(instance.attribute).to.be.equal(1)
  },

  "setAfterFn": () => {
    var instance = new BuilderBase()
    expect(instance.after).to.be.undefined
    expect(instance.attribute).to.be.undefined
    instance.attr = 1

    instance.setAfterFn((builder) => builder.attribute = instance.attr)
    expect(instance.after).to.be.function

    instance.after()
    expect(instance.attribute).to.be.equal(1)
  },

  "setAfterEachFn": () => {
    var instance = new BuilderBase()
    expect(instance.afterEach).to.be.undefined
    expect(instance.attribute).to.be.undefined
    instance.attr = 1

    instance.setAfterEachFn((builder) => builder.attribute = instance.attr)
    expect(instance.setAfterEachFn).to.be.function

    instance.afterEach()
    expect(instance.attribute).to.be.equal(1)
  }


})
