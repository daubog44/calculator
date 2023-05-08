import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function cancHandler() {
  // se ci si trova nel caso in cui result è uguale "2^(" allora rimuovi "^("
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

  // se si ha schacciato = allora rimuovi calculus
  if (stateApp.calculus.includes("=")) {
    stateApp.calculus = "";
    return;
  }

  if (stateApp.cleanResult) stateApp.cleanResult = false;

  // logica che rimuove di una cifra il risultato
  if (stateApp.result.slice(0, -1) === "" && stateApp.result) {
    stateApp.result = "0";
    stateApp.cleanResult = true;
  } else {
    stateApp.result = stateApp.result.slice(0, -1);
  }
  // aggiorna
  stateApp.currentNumber = utils.getNumberByStr(stateApp.result);
}
