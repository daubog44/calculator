import * as utils from "./utils.js";
import { updateUI, addEventListenerToBtnsContainer } from "./view.js";

const stateApp = {
  result: "",
  calculus: "",
  currentNumber: 0,
  cleanResult: false,
  hasInnerCalculationPow: false,
};

function resetState() {
  stateApp.hasInnerCalculationPow = false;
  stateApp.calculus = "";
  stateApp.result = "";
  stateApp.currentNumber = 0;
}

function setStateError() {
  stateApp.hasInnerCalculationPow = false;
  stateApp.currentNumber = 0;
  stateApp.calculus = "";
  stateApp.result = "Error";
}

function updateStateByResult() {
  const currentNumber = utils.getNumberByStr(stateApp.result);
  stateApp.currentNumber = currentNumber;
}

function handleNumber(number) {
  if (stateApp.calculus.includes("=")) {
    resetState();
  }
  stateApp.result = !stateApp.cleanResult
    ? `${stateApp.result}${number}`
    : `${number}`;
  stateApp.cleanResult = false;
  updateStateByResult();
}

function negateHandler() {
  // se ha hasInnerCalculationPow allora svolgi l' operazione dentro la ^(
  if (stateApp.hasInnerCalculationPow) {
    const tmp = stateApp.result.split("(");
    const result = utils.negateToStr(tmp[1], utils.getNumberByStr(tmp[1]));
    stateApp.result = tmp[0] + "(" + result;
    return;
  }
  // questa riga è spiegata in handleReverse
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  const res = utils.negateToStr(stateApp.result, stateApp.currentNumber);
  stateApp.result = res;
  updateStateByResult();
}

function handleEqual() {
  stateApp.cleanResult = true;
  if (stateApp.hasInnerCalculationPow) {
    const tmp = stateApp.result.split("(");
    const left = utils.getNumberByStr(tmp[0]);
    const result = Math.pow(left, utils.getNumberByStr(tmp[1]));
    if (isNaN(result)) {
      setStateError();
      return;
    }
    stateApp.currentNumber = result;
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.hasInnerCalculationPow = false;
    return stateApp.calculus.length > 0 ? handleEqual() : undefined;
  }

  const [previousMathOperation, leftNumber, currentNumber] =
    getMathOperationAndLeftRightNumber();
  if (stateApp.calculus.includes("=")) {
    const calculatedVal = utils.getCalculatedOperation(
      previousMathOperation,
      leftNumber,
      currentNumber
    );
    const result = utils.getCalculatedOperation(
      previousMathOperation,
      calculatedVal,
      currentNumber
    );
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.calculus = `${calculatedVal} ${previousMathOperation} ${currentNumber} =`;
    return;
  }
  stateApp.calculus = stateApp.calculus + " " + currentNumber + " =";
  const calculatedVal = utils.getCalculatedOperation(
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
  if (stateApp.hasInnerCalculationPowPow && !stateApp.result.split("(")[1]) {
    setStateError();
    return;
  }

  if (stateApp.hasInnerCalculationPow) {
    handleEqual();
    handleOperation(operation);
    return;
  }
  if (stateApp.calculus === "") {
    stateApp.calculus = stateApp.result + " " + operation;
    stateApp.result = "";
    stateApp.currentNumber = 0;
    return;
  }
  stateApp.cleanResult = true;
  const [previousMathOperation, leftNumber, currentNumber] =
    getMathOperationAndLeftRightNumber();
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
    setStateError();
    return;
  }
  const result = utils.fromNumberToResult(calculatedVal);
  stateApp.result = result;
  stateApp.calculus = `${result} ${operation}`;
  stateApp.currentNumber = 0;
}

function handleReverse() {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute === 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";

  const val = 1 / toCompute;
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = utils.fromNumberToResult(val);
}

function handleSqrt() {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute < 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  const val = Math.sqrt(toCompute);
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = utils.fromNumberToResult(val);
}

function handlePow() {
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
    setStateError();
    return;
  }
  // aggiorna lo state
  stateApp.result = utils.fromNumberToResult(toCompute) + "^(";
}

function handleCanc() {
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
  if (stateApp.result.slice(0, -1) === "") {
    stateApp.result = "0";
    stateApp.cleanResult = true;
  } else {
    stateApp.result = stateApp.result.slice(0, -1);
  }
  // aggiorna
  updateStateByResult();
}

function handleFPoint() {
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

addEventListenerToBtnsContainer((e) => {
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
        handleFPoint();
        break;
      case "negate":
        negateHandler();
        break;
      case "C":
        resetState();
        break;
      case "CE":
        stateApp.hasInnerCalculationPow = false;
        stateApp.result = "0";
        stateApp.currentNumber = 0;
        stateApp.cleanResult = true;
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
    updateUI(stateApp.result, stateApp.calculus);
  }
});
