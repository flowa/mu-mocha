const test = require('../src').test,
    expect = require('chai').expect,
    assert = require('chai').assert

/****************************************
Item to test
****************************************/
function add() {
  return Array.prototype.slice.call(arguments).reduce(function(prev, curr) {
    return prev + curr;
  }, 0);
}

/***************************************
Mu-Mocha variant
*****************************************/
test('Mu-mocha tests for add()', {
    data: [
      {args: [1, 2],       expected: 3},
      {args: [1, 2, 3],    expected: 6},
      {args: [1, 2, 3, 4], expected: 10}
    ],
    name: (item) => `correctly adds ${ item.args.length } args`,
    test: (item) => {
      var res = add.apply(null, item.args);
      assert.equal(res, item.expected);
    }
  }
)

/***************************************
Original eample from Mocha doedumentation
*****************************************/
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
