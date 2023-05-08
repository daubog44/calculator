import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function powHandler() {
  if (stateApp.calculus.includes("=")) {
    stateApp.calculus = "";
  }
  if (stateApp.cleanResult) stateApp.cleanResult = false;

  if (stateApp.hasInnerCalculationPow) return;
  stateApp.hasInnerCalculationPow = true;

  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (isNaN(toCompute)) {
    stateApp.setStateError();
    return;
  }
  // aggiorna lo state
  stateApp.result = utils.fromNumberToResult(toCompute) + "^(";
}
