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
