import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function powHandler() {
  // se si è premuto = allora pulisci il calculus altrimenti dà problemi
  if (stateApp.calculus.includes("=")) {
    stateApp.calculus = "";
  }
  // rimuovi cleanResult
  if (stateApp.cleanResult) stateApp.cleanResult = false;

  // se già si sta svolegendo hasInnerCalculationPow allora ritorna
  if (stateApp.hasInnerCalculationPow) return;
  // imposta hasInnerCalculationPow
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
