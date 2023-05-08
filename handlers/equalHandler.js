import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function equalHandler() {
  stateApp.cleanResult = true;
  if (stateApp.hasInnerCalculationPow) {
    const tmp = stateApp.result.split("(");
    const left = utils.getNumberByStr(tmp[0]);
    const result = Math.pow(left, utils.getNumberByStr(tmp[1]));
    if (isNaN(result)) {
      stateApp.setStateError();
      return;
    }
    stateApp.currentNumber = result;
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.hasInnerCalculationPow = false;
    return stateApp.calculus.length > 0 ? equalHandler() : undefined;
  }

  const [previousMathOperation, leftNumber, currentNumber] =
    utils.getMathOperationAndLeftRightNumber(stateApp);
  const resultCurrentNumber =
    currentNumber < 0 && previousMathOperation === "-"
      ? `(${currentNumber})`
      : currentNumber;

  const calculatedVal = utils.getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );
  if (stateApp.calculus.includes("=")) {
    const result = utils.getCalculatedOperation(
      previousMathOperation,
      calculatedVal,
      currentNumber
    );
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.calculus = `${calculatedVal} ${previousMathOperation} ${resultCurrentNumber} =`;
    return;
  }
  stateApp.calculus = stateApp.calculus + " " + resultCurrentNumber + " =";
  if (isNaN(calculatedVal)) {
    stateApp.setStateError();
    return;
  }
  stateApp.result = utils.fromNumberToResult(calculatedVal);
}
