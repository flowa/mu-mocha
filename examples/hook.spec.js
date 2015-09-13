const test = require('../src').test,
    expect = require('chai').expect,
    assert = require('chai').assert


/*************************************
Mu-mocha exsample
*************************************/
test('Hooks in Mu-mocha',
  {
    before:     () => console.log("before"),
    after:      () => console.log("after"),
    beforeEach: () => console.log("beforeEach"),
    afterEach:  () => console.log("afterEach"),
    "This illustrated how hooks are used in Mu-mocha": () => {}
  })


/*************************************
Mocha exsample
*************************************/
describe('Hooks in mocha', function() {
  before(function() {
    console.log("before")
  })
  after(function(){
    console.log("after")
  })
  beforeEach(function(){
    console.log("beforeEach")
  })
  afterEach(function(){
    console.log("afterEach")
  })
  it("This illustrated how hooks are used in Mocha", function(){})
})
