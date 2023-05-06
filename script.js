import * as utils from "./utils.js";

const btnsContainer = document.querySelector(".calculator-btns__container");

const stateApp = {
  result: "",
  calculus: "",
  currentNumber: 0,
  hasCalculusChain: false,
  hasInnerCalculation: false,
};

const displayResult = document.querySelector(".calculator-current__result");

const currentCalculus = document.querySelector(
  ".calculator-current__calculation"
);

function resetState() {
  stateApp.hasInnerCalculation = false;
  stateApp.calculus = "";
  stateApp.result = "";
  stateApp.currentNumber = 0;
}

function setStateError() {
  stateApp.hasInnerCalculation = false;
  stateApp.currentNumber = 0;
  stateApp.calculus = "";
  stateApp.result = "Error";
}

function updateStateOperation(operation, resultNumber) {
  const result = utils.fromNumberToResult(resultNumber);
  stateApp.result = result;
  stateApp.calculus = `${result} ${operation}`;
  stateApp.currentNumber = 0;
}

function updateUI() {
  displayResult.innerHTML = stateApp.result;
  currentCalculus.innerHTML = stateApp.calculus;
}

function updateStateByResult() {
  const currentNumber = utils.getNumberByStr(stateApp.result);
  stateApp.currentNumber = currentNumber;
}

function handleNumber(number) {
  if (stateApp.calculus.includes("=")) {
    resetState();
  }
  stateApp.result = !stateApp.hasCalculusChain
    ? `${stateApp.result}${number}`
    : `${number}`;
  stateApp.hasCalculusChain = false;
  updateStateByResult();
}

function negateToStr(number, numberToCompare) {
  if (numberToCompare > 0) {
    return `-${number}`;
  } else {
    return number.replace("-", "");
  }
}

function negateHandler() {
  if (stateApp.hasInnerCalculation) {
    const tmp = stateApp.result.split("(");
    console.log(tmp);
    const result = negateToStr(tmp[1], utils.getNumberByStr(tmp[1]));
    stateApp.result = tmp[0] + "(" + result;
    return;
  }
  if (stateApp.hasCalculusChain) return;
  stateApp.result = negateToStr(stateApp.result, stateApp.currentNumber);
  updateStateByResult();
}

function handleEqual() {
  if (stateApp.hasInnerCalculation) {
    const tmp = stateApp.result.split("(");
    const left = utils.getNumberByStr(tmp[0]);
    const result = Math.pow(left, tmp[1]);
    // stateApp.calculus = stateApp.result + ") =";
    stateApp.currentNumber = result;
    // const calculus = stateApp.calculus.split(" ");
    // stateApp.calculus = `${calculus[0]} ${calculus[1]}`;
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.hasInnerCalculation = false;
    return stateApp.calculus.length > 0 ? handleEqual() : undefined;
  }
  stateApp.hasCalculusChain = true;
  const [previousMathOperation, leftNumber, currentNumber] =
    getMathOperationAndLeftRightNumber();
  console.log(stateApp.calculus.includes("="), stateApp.calculus);
  if (stateApp.calculus.includes("=")) {
    const calculatedVal = getCalculatedOperation(
      previousMathOperation,
      leftNumber,
      currentNumber
    );
    const result = getCalculatedOperation(
      previousMathOperation,
      calculatedVal,
      currentNumber
    );
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.calculus = `${calculatedVal} ${previousMathOperation} ${currentNumber} =`;
    return;
  }
  stateApp.calculus = stateApp.calculus + " " + currentNumber + " =";
  const calculatedVal = getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );
  if (isNaN(calculatedVal)) {
    setStateError();
    return;
  }
  stateApp.result = utils.fromNumberToResult(calculatedVal);
}

function getMathOperationAndLeftRightNumber() {
  const calculus = stateApp.calculus.split(" ");
  return [
    calculus[1],
    utils.getNumberByStr(calculus[0]),
    stateApp.currentNumber,
  ];
}

function handleOperation(operation) {
  if (stateApp.hasInnerCalculation) {
    return;
  }
  if (stateApp.calculus === "") {
    stateApp.calculus = stateApp.result + " " + operation;
    stateApp.result = "";
    stateApp.currentNumber = 0;
    return;
  }
  stateApp.hasCalculusChain = true;
  const [previousMathOperation, leftNumber, currentNumber] =
    getMathOperationAndLeftRightNumber();
  if (currentNumber === 0) {
    stateApp.calculus = `${stateApp.calculus.split(" ")[0]} ${operation}`;
    return;
  }
  const calculatedVal = getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );
  if (isNaN(calculatedVal)) {
    setStateError();
    return;
  }
  updateStateOperation(operation, calculatedVal);
}

function getCalculatedOperation(op, left, right) {
  switch (op) {
    case "+":
      return left + right;
    case "-":
      return left - right;
    case "x":
      return left * right;
    case "/":
      if (right === 0) {
        return NaN;
      }
      return left / right;
    default:
      return NaN;
  }
}

function handleReverse() {
  if (stateApp.hasInnerCalculation) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute === 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }
  const val = 1 / toCompute;
  stateApp.currentNumber = val;
  stateApp.hasCalculusChain = true;
  stateApp.result = utils.fromNumberToResult(val);
}

function handleSqrt() {
  if (stateApp.hasInnerCalculation) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute < 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }
  const val = Math.sqrt(toCompute);
  stateApp.currentNumber = val;
  stateApp.hasCalculusChain = true;
  stateApp.result = utils.fromNumberToResult(val);
}

// function handlePow() {
//   const toCompute =
//     utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
//   if (isNaN(toCompute)) {
//     setStateError();
//     return;
//   }
//   const val = toCompute * toCompute;
//   stateApp.currentNumber = val;
//   stateApp.hasCalculusChain = true;
//   stateApp.result = utils.fromNumberToResult(val);
// }

function handlePow() {
  stateApp.hasInnerCalculation = true;
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (isNaN(toCompute)) {
    setStateError();
    return;
  }
  stateApp.result = utils.fromNumberToResult(toCompute) + "^(";
}

function handleCanc() {
  if (
    stateApp.hasInnerCalculation &&
    stateApp.result.split("(")[1].length === 0
  ) {
    stateApp.hasInnerCalculation = false;
    stateApp.result = utils.fromNumberToResult(
      utils.getNumberByStr(stateApp.result)
    );
  } else if (stateApp.calculus.includes("=")) {
    stateApp.calculus = "";
  } else {
    console.log(stateApp.result);
    if (stateApp.result.slice(0, -1) === "") {
      stateApp.result = "0";
    } else {
      stateApp.result = stateApp.result.slice(0, -1);
    }
    updateStateByResult();
    console.log(stateApp);
  }
}

btnsContainer.addEventListener("click", (e) => {
  if (e.target !== e.currentTarget) {
    const typeOfBtn = e.target.style.gridArea.split(" ")[0];
    if (stateApp.result === "Error") {
      resetState();
    }
    switch (typeOfBtn) {
      case "zero":
        handleNumber(0);
        break;
      case "one":
        handleNumber(1);
        break;
      case "two":
        handleNumber(2);
        break;
      case "three":
        handleNumber(3);
        break;
      case "four":
        handleNumber(4);
        break;
      case "five":
        handleNumber(5);
        break;
      case "six":
        handleNumber(6);
        break;
      case "seven":
        handleNumber(7);
        break;
      case "eight":
        handleNumber(8);
        break;
      case "nine":
        handleNumber(9);
        break;
      case "f-point":
        if (!stateApp.result.includes(",")) {
          handleNumber(stateApp.currentNumber ? "," : "0,");
        }
        break;
      case "negate":
        negateHandler();
        break;
      case "C":
        resetState();
        break;
      case "CE":
        stateApp.hasInnerCalculation = false;
        stateApp.result = "0";
        stateApp.currentNumber = 0;
        stateApp.hasCalculusChain = true;
        break;
      case "CANC":
        handleCanc();
        break;
      case "plus":
        handleOperation("+");
        break;
      case "minus":
        handleOperation("-");
        break;
      case "multiply":
        handleOperation("x");
        break;
      case "divide":
        handleOperation("/");
        break;
      case "equal":
        handleEqual();
        break;
      case "reverse":
        handleReverse();
        break;
      case "sqrt":
        handleSqrt();
        break;
      case "pow":
        handlePow();
        break;
      default:
        break;
    }
    updateUI();
  }
});
