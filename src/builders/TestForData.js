const _ = require('lodash'),
      Base = require('./BuilderBase'),
      expect = require('chai').expect

export class TestForData extends Base{
  constructor(data){
    super()
    this.data = data
    this.test = (item) => {}
  }

  /* fn takes on param (item) and optionally done */
  setTestFn(fn){
    this.test = fn.bind(null)
    return this
  }

  /* fn takes two param context and item and optionally done */
  setTestWithContextFn(fn){
    this.test = fn.bind(null,this)
    return this
  }
}

export const instance = (fn) => new TestForData(fn)
