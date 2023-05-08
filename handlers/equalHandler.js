import stateApp from "../stateClass.js";
import * as utils from "../utils.js";

export function equalHandler() {
  stateApp.cleanResult = true;
  if (stateApp.hasInnerCalculationPow) {
    const tmp = stateApp.result.split("(");
    const left = utils.getNumberByStr(tmp[0]);
    const number = Math.pow(left, utils.getNumberByStr(tmp[1]));
    if (isNaN(number)) {
      stateApp.setStateError();
      return;
    }
    stateApp.currentNumber = number;
    stateApp.result = utils.fromNumberToResult(number);
    stateApp.hasInnerCalculationPow = false;
    return stateApp.calculus.length > 0 ? equalHandler() : undefined;
  }

  const [previousMathOperation, leftNumber, currentNumber] =
    utils.getMathOperationAndLeftRightNumber(stateApp);

  const rightNumber =
    currentNumber < 0 && previousMathOperation === "-"
      ? `(${currentNumber})`
      : currentNumber;

  const calculatedVal = utils.getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );
  if (isNaN(calculatedVal)) {
    stateApp.setStateError();
    return;
  }
  const calculatedValStr = utils.fromNumberToResult(calculatedVal);
  if (stateApp.calculus.includes("=")) {
    const number = utils.getCalculatedOperation(
      previousMathOperation,
      calculatedVal,
      currentNumber
    );
    stateApp.currentNumber = number;
    stateApp.result = utils.fromNumberToResult(number);
    stateApp.calculus = `${calculatedValStr} ${previousMathOperation} ${rightNumber} =`;
  } else {
    stateApp.calculus = stateApp.calculus + " " + rightNumber + " =";
    stateApp.result = calculatedValStr;
    stateApp.currentNumber = calculatedVal;
  }
}
