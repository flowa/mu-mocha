const test = require('../src').test,
    expect = require('chai').expect


/************************************************
Simple test in Mu-Mocha
************************************************/
test({
  "This is Mu-Mocha descriptions": {
    "This is Mu-mocha test name":    () => expect(true).to.be.true,
    "This is another Mu-mocha test": () => expect(true).to.be.true
  }
})

/************************************************
This is same as
************************************************/
describe("This is Mocha descriptions", function(){
  it("This is Mocha test name", function(){
    expect(true).to.be.true
  })

  it("This is another Mocha test", function(){
    expect(true).to.be.true
  })
})

/************************************************
test function overlouadas
************************************************/

// test(string, obj)
test("Test(string, object): This is Mu-mocha descriptions",
  {
    "This is Mu-mocha test name":    () => expect(true).to.be.true,
    "This is another Mu-mocha test": () => expect(true).to.be.true
  })

// test(string, function)
test("Test(string, function): This is Mu-mocha test",  () => expect(true).to.be.true)

// test(string, data, function)
var counter = 1
test("Test(string, data, function): This is Mu-mocha test",
    [1,2,3],
    (item) => expect(item).to.be.equal(counter++))
