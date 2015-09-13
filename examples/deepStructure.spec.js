const test = require('../src').test,
    expect = require('chai').expect,
    assert = require('chai').assert

/**************************************************
Minmal Mocha version for nesting tests.
***************************************************/
test("Mu-mocha varation for nesting tests",
  {
    "Boolean tests": {
      "Test that true is true": () => expect(true).to.be.true,
      "Test that false is false": () => expect(false).to.be.false,
      "Test that 1 is truthy": () => expect(1).to.be.ok
    },
    "Number tests": {
      "Expect 1 + 1 = 2": () => expect(1+1).to.be.equal(2),
      "Expect 1 - 1 = 0": () => expect(1-1).to.be.equal(0)
    }
  })

/**************************************************
Mocha version for nesting tests
***************************************************/
describe("Mocha varation for nesting tests", function(){
  describe("Boolean tests", function(){
    it("Test that true is true", function() {
      expect(true).to.be.true
    })
    it("Test that false is false", function(){
      expect(false).to.be.false
    })
    it("Test that 1 is truthy", function(){
      expect(1).to.be.ok
    })
  })

  describe("Number tests", function(){
    it("Expect 1 + 1 = 2", function(){
      expect(1+1).to.be.equal(2)
    })
    it("Expect 1 - 1 = 0", function() {
      expect(1-1).to.be.equal(0)
    })
  })
})
