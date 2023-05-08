import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function reverseHandler() {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute === 0 || isNaN(toCompute)) {
    stateApp.setStateError();
    return;
  }
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";

  const val = 1 / toCompute;
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = utils.fromNumberToResult(val);
}

export function sqrtHandler() {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute < 0 || isNaN(toCompute)) {
    stateApp.setStateError();
    return;
  }
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  const val = Math.sqrt(toCompute);
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = utils.fromNumberToResult(val);
}

export function logHandler() {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute <= 0 || isNaN(toCompute)) {
    stateApp.setStateError();
    return;
  }
  const val = Math.log(toCompute);
  const result = utils.fromNumberToResult(val);
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = result;
}
