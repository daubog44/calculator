import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function numberHandler(number) {
  if (stateApp.calculus.includes("=")) {
    stateApp.resetState();
  }
  stateApp.result = !stateApp.cleanResult
    ? `${stateApp.result}${number}`
    : `${number}`;
  stateApp.cleanResult = false;
  stateApp.currentNumber = utils.getNumberByStr(stateApp.result);
}

export function negateHandler() {
  if (stateApp.hasInnerCalculationPow) {
    const [base, esponent] = stateApp.result.split("(");
    const number = esponent * -1;
    stateApp.result = base + "(" + utils.fromNumberToResult(number);
    return;
  }
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  const number = stateApp.currentNumber * -1;
  stateApp.result = utils.fromNumberToResult(number);
  stateApp.currentNumber = number;
}

export function FPointHandler() {
  const commaInnerCalculus =
    stateApp.hasInnerCalculationPow && stateApp.result.split("(")[1];
  if (
    !stateApp.result.includes(",") ||
    stateApp.cleanResult ||
    (commaInnerCalculus && !commaInnerCalculus.includes(","))
  )
    numberHandler(stateApp.result && !stateApp.cleanResult ? "," : "0,");
}
