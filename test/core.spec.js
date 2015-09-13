const { test, build } = require("../src"),
    expect = require('chai').expect;

var beforeCount=0,
    beforeEachCount=0,
    afterCount = 0,
    afterEachCount=0,
    testCounter=0,
    iterCounter=0

function testHooks(){
  testCounter++;
  expect(beforeCount).to.be.equal(1)
  expect(beforeEachCount).to.be.equal(testCounter)
  expect(afterEachCount).to.be.equal(testCounter - 1)
  expect(afterCount).to.be.equal(0)
}

test({
  'Test test before, beforeEach, afterEach hooks': {
    before:     function(){ beforeCount++; },
    beforeEach: function(){ beforeEachCount++; },
    after:      function(){ afterCount++; },
    afterEach:  function(){ afterEachCount++; },
    'Test default hooks 1': testHooks,
    'Test default hooks 2': testHooks,
    'Test default hooks 3': testHooks,
  },

  'Test after hook': {
    'Value of after hook shold be 1 for the second describe block': function(){
      expect(afterCount).to.be.equal(1)
    },
  },

  'Test iterator with numbers': {
    data: [1,2,3,4],
    before: function(){
      iterCounter = 0;
    },
    test: (item) => {
      iterCounter++;
      expect(item).to.be.equal(iterCounter)
    }
  },

  'Test iterator with objects': {
    before: function(){
      iterCounter = 0;
    },
    data: [{data: 1}, {data: 2}, {data: 3}],
    test: (item) => {
      iterCounter++;
      expect(item.data).to.be.equal(iterCounter)
    }
  },

  'Test iterator with async tests': {
    data: [{data: 1}],
    test: (item, done) => {
      iterCounter++;
      expect(item.data).to.be.equal(1)
      expect(done).to.be.functions
      done()
    }
  },

  'Test iterator with name function; check that test names are reported correctly from test report': {
    before: function(){
      iterCounter = 0;
    },
    data: [{data: "If you see test this text, it works"}],
    name: (item) => { return item.data  },
    test: (item) => expect(item.data).to.be.equal("If you see test this text, it works")
  },

  'Test iterator with name string; check that test names are reported correctly from test report': {
    data: [{data: "If you see test this text, it works"}],
    name: "If you see test this text, it works",
    test: (item) => expect(item.data).to.be.equal("If you see test this text, it works")
  }
})
