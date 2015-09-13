var _ = require('lodash');

function defaultNameFn(item, testIndexOrName, parent){
  var total = _.size(parent.data)
  if(_.isNumber(testIndexOrName)){
    var count = testIndexOrName + 1
    return 'Test ' + count + ' of ' + total
  } else {
    return testIndexOrName
  }
}

function getName(item, testIndexOrName, parent){
  if(_.isFunction(parent.name)){
    return parent.name(item, testIndexOrName, parent);
  }
  else if(_.isString(parent.name)){
    return parent.name
  } else {
    return  defaultNameFn(item, testIndexOrName, parent)
  }
}

function iter(data, iter){
    testFn.bind(data)
    it(name, testFn.bind(data))
}

function applyHooks(fnOrObject){
  if(_.isFunction(fnOrObject.before)){
    before(fnOrObject.before)
  }
  if(_.isFunction(fnOrObject.after)){
    after(fnOrObject.after)
  }
  if(_.isFunction(fnOrObject.afterEach)){
    afterEach(fnOrObject.afterEach)
  }
  if(_.isFunction(fnOrObject.beforeEach)){
    beforeEach(fnOrObject.beforeEach)
  }
}

var runTest = function(){
  // init
  var testContainer = {}
  if(arguments.length === 1){
    testContainer = arguments[0]
  } else if(arguments.length === 2 && _.isString(arguments[0])){
    testContainer[arguments[0]] = arguments[1]
  } else if(arguments.length === 3 &&
    _.isString(arguments[0]) &&
    _.isFunction(arguments[2])){
    testContainer[arguments[0]] = {
      data: arguments[1],
      test: arguments[2]
    }
  } else {
    var errorMsg =
      'Invalid params for test. Possible signatures are: \n' +
      'test(container: object): \n' +
      'test(testName: string, tests : object or function): \n' +
      'test(testName: string, data : collection, test : function): \n'

    throw new Error(errorMsg)
 }
 // iterate test object tree
  _.forEach(
    testContainer,
    function(fnOrObject, name){
      if(_.isFunction(fnOrObject)){
        switch(name){
          case 'before':
            return before(fnOrObject)
          case 'beforeEach':
            return beforeEach(fnOrObject)
          case 'after':
            return after(fnOrObject)
          case 'afterEach':
            return afterEach(fnOrObject)
          default:
            return it(name, fnOrObject)
        }
      }
      else if(typeof(fnOrObject) === 'object'){
         // Data driven testing
        if(_.isFunction(fnOrObject.test) && fnOrObject['data']){
          describe(name, function(){
            var total = _.size(fnOrObject.data)
            applyHooks(fnOrObject)
            _.forEach(fnOrObject.data, function(item, testIndexOrName){
                var testName = getName(item, testIndexOrName, fnOrObject)
                var testFn = fnOrObject.test.bind(null, item)
                return it(testName, testFn)
            })
          })
        } else {
           // Default handler for object vaalues in test graph
          describe(name, function(){
            runTest(fnOrObject)
          });
        }
      }
    });
}

class Builder {
  register(name, instantiationFn){
    this[name] = instantiationFn
  }
}


var builder = new Builder()
builder.register("TestForData", require("./builders/TestForData").instance)
builder.register("TestForFn",   require("./builders/TestForFn").instance)

export default {
  test: runTest,
  build: builder
}
