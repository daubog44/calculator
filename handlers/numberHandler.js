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
  // se ha hasInnerCalculationPow allora svolgi l' operazione dentro la ^(
  if (stateApp.hasInnerCalculationPow) {
    const [base, esponent] = stateApp.result.split("(");
    const number = esponent * -1;
    stateApp.result = base + "(" + utils.fromNumberToResult(number);
    return;
  }
  // questa riga è spiegata in handleReverse
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  const number = esponent * -1;
  stateApp.result = utils.fromNumberToResult(number);
  stateApp.currentNumber = number;
}

export function FPointHandler() {
  // se il risultato non include "," oppure se cleanResult oppure se hasInnerCalculationPow non include "," allora chiama handleNumber che aggiornerà lo state.
  const commaInnerCalculus =
    stateApp.hasInnerCalculationPow && stateApp.result.split("(")[1];
  if (
    !stateApp.result.includes(",") ||
    stateApp.cleanResult ||
    (commaInnerCalculus && !commaInnerCalculus.includes(","))
  )
    // se result esiste e cleanResult = false allora chiama handleNumber con solo "," altrimenti "0,"
    handleNumber(stateApp.result && !stateApp.cleanResult ? "," : "0,");
}
