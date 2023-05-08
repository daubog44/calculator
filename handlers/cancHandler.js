import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function cancHandler() {
  if (
    stateApp.hasInnerCalculationPow &&
    stateApp.result.split("(")[1].length === 0
  ) {
    stateApp.hasInnerCalculationPow = false;
    stateApp.result = utils.fromNumberToResult(
      utils.getNumberByStr(stateApp.result)
    );
    return;
  }

  if (stateApp.calculus.includes("=")) {
    stateApp.calculus = "";
    return;
  }

  if (stateApp.cleanResult) stateApp.cleanResult = false;
  if (
    stateApp.result.slice(0, -1) === "" ||
    (stateApp.result.slice(0, -1) === "-" && stateApp.result)
  ) {
    stateApp.result = "0";
    stateApp.cleanResult = true;
  } else {
    stateApp.result = stateApp.result.slice(0, -1);
  }
  stateApp.currentNumber = utils.getNumberByStr(stateApp.result);
}
