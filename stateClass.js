import { getNumberByStr } from "./utils.js";

class StateApp {
  result = "";
  calculus = "";
  currentNumber = 0;
  cleanResult = false;
  hasInnerCalculationPow = false;

  resetState() {
    this.hasInnerCalculationPow = false;
    this.currentNumber = 0;
    this.calculus = "";
    this.result = "";
  }

  setStateError() {
    this.hasInnerCalculationPow = false;
    this.currentNumber = 0;
    this.calculus = "";
    this.result = "Error";
  }

  /**
   * @param {Object} obj
   */
  set updateState(obj) {
    if (obj?.result) {
      this.result = result;
    }
    if (obj?.calculus) this.calculus = obj.calculus;
    if (obj?.cleanResult) this.cleanResult = obj.cleanResult;
    if (obj?.hasInnerCalculationPow)
      this.hasInnerCalculationPow = obj.hasInnerCalculationPow;
    if (obj?.currentNumber) {
      this.currentNumber = currentNumber;
    }
  }

  get getStateApp() {
    const val = {
      result: this.result,
      calculus: this.calculus,
      currentNumber: this.currentNumber,
      cleanResult: this.cleanResult,
      hasInnerCalculationPow: this.hasInnerCalculationPow,
    };
    return val;
  }

  get getCurrentOpration() {
    const operation = this.calculus.split(" ")[0];
    return {
      left: getNumberByStr(calculus[0]),
      operation,
      right: this.currentNumber,
    };
  }
}

export default new StateApp();
