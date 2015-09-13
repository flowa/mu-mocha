const _ = require('lodash'),
      Base = require('./BuilderBase'),
      expect = require('chai').expect

class ReturnContinuationApi {
  constructor(parentApi, inputParams){
    this.parentApi = parentApi
    this.inputParams = inputParams
  }

  itShouldReturn(returnValue){
    var test = (item) => {
      var expectedReturnValue = item.returnValue
      var actualFn = this.parentApi.fnToTest.bind(this.parentApi.instance, item.inputParams)

      if(_.isObject(expectedReturnValue) || _.isArray(expectedReturnValue)){
        expect(actualFn()).to.be.deep.equal(expectedReturnValue)
      } else {
        expect(actualFn()).to.be.equal(expectedReturnValue)
      }
    }
    this.parentApi.data.push({
      inputParams: this.inputParams,
      returnValue: this.returnValue,
      testFn: (item) => test
    })
    return this.parentApi
  }
}

export class TestForFn extends Base {
  constructor(fn){
    super()
    this.data = []
    if(!_.isFunction(fn)){
      throw new Error("Parameter is not function")
    }
    this.fnToTest = fn;
    this.instance = null
    this.name = (item) => `Test function '${ this.fnToTest.name }' with params: ${ item.inputParams }`
    this.test = (item) => {  item.testFn(item)  }
  }

  withParams(inputParams) {
    return new ReturnContinuationApi(this, inputParams)
  }

  ofInstance(instance) {
    this.instance = instance
  }
}

export const instance = (fn) => new TestForFn(fn)
