const _ = require('lodash')

export default class BuilderBase {
  constructor(){
    this.data = []
    this.test = () => {}
    this.name = null
  }

  setNameFn(nameFn){
    this.name = nameFn
    return this
  }

  bindContext(fn) {
    fn(this)
    return this
  }

   setBeforeFn(fn){
     this.before = fn.bind(null,this)
     return this
   }

   setBeforeEachFn(fn){
     this.beforeEach = fn.bind(null,this)
     return this
   }

   setAfterFn(fn){
     this.after = fn.bind(null,this)
     return this
   }

   setAfterEachFn(fn){
     this.afterEach = fn.bind(null,this)
     return this
   }
}
