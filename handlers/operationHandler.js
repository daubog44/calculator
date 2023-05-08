import stateApp from "../stateClass.js";
import * as utils from "../utils.js";
import { equalHandler } from "./equalHandler.js";

export function operationHandler(operation) {
  if (stateApp.hasInnerCalculationPow && !stateApp.result.split("(")[1]) {
    stateApp.setStateError();
    return;
  }

  if (stateApp.hasInnerCalculationPow) {
    equalHandler();
    operationHandler(operation);
    return;
  }

  if (!stateApp.calculus && !stateApp.result) return;
  if (!stateApp.calculus && stateApp.result) {
    stateApp.calculus = stateApp.result + " " + operation;
    stateApp.result = "";
    stateApp.currentNumber = 0;
    return;
  }
  stateApp.cleanResult = true;
  const [previousMathOperation, leftNumber, currentNumber] =
    utils.getMathOperationAndLeftRightNumber(stateApp);
  if (currentNumber === 0) {
    stateApp.calculus = `${stateApp.calculus.split(" ")[0]} ${operation}`;
    return;
  }
  const calculatedVal = utils.getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );
  if (isNaN(calculatedVal)) {
    stateApp.setStateError();
    return;
  }
  const result = utils.fromNumberToResult(calculatedVal);
  stateApp.result = result;
  stateApp.calculus = `${result} ${operation}`;
  stateApp.currentNumber = 0;
}
