import * as utils from "./utils.js";
import { updateUI, addEventListenerToBtnsContainer } from "./view.js";

const stateApp = {
  result: "", // result è il risultato che verrà visualizzato
  calculus: "", // è il calcolo che si sta eseguendo
  currentNumber: 0, // numero corrente per svolgere i calcoli (dovrebbe essere uguale al result)
  cleanResult: false, // flag
  hasInnerCalculationPow: false, // se si sta svolgendo un operazione particolare ad es. 2^(..)
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

// set current number by result
function updateStateByResult() {
  const currentNumber = utils.getNumberByStr(stateApp.result);
  stateApp.currentNumber = currentNumber;
}

function handleNumber(number) {
  // se si è appena svolta un' operazione con l' uguale ad es. 2 + 2 =, pulisci lo state
  if (stateApp.calculus.includes("=")) {
    resetState();
  }
  // se cleanResult è true, imposta il risultato al numero schiacciato altriementi aggiugni il numero al risultato
  stateApp.result = !stateApp.cleanResult
    ? `${stateApp.result}${number}`
    : `${number}`;

  // se cleanResult, impostalo su false
  if (stateApp.cleanResult) stateApp.cleanResult = false;
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
  console.log(res);
  if (stateApp.calculus.includes("=")) {
    stateApp.calculus = "";
  }
  stateApp.result = res;
  updateStateByResult();
}

function handleEqual() {
  // imposta cleanResult
  stateApp.cleanResult = true;

  // se hasInnerCalculationPow allora svolgi l' operazione
  if (stateApp.hasInnerCalculationPow) {
    const tmp = stateApp.result.split("(");
    const left = utils.getNumberByStr(tmp[0]);
    const result = Math.pow(left, utils.getNumberByStr(tmp[1]));
    if (isNaN(result)) {
      setStateError();
      return;
    }

    // imposta il nuovo state in base al risultato dell' operazione
    stateApp.currentNumber = result;
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.hasInnerCalculationPow = false;
    // se c'è un' altra operazione in corso ad esempio un addizione: "2 + 2^(2)" diventerà "2 + 4", quindi svolgi "2 + 2" richiamando la funzione
    return stateApp.calculus.length > 0 ? handleEqual() : undefined;
  }

  // prende i valori del calcolo corrente, ad esempio se calculus è "2 +" e stateApp.currentNumber = 2, llora previousMathOperation = "+"; leftNumber = 2; currentNumber = 2;
  const [previousMathOperation, leftNumber, currentNumber] =
    getMathOperationAndLeftRightNumber();

  // prende il risultato dell' operzione ad esempio "2 + 2" farà 4
  const calculatedVal = utils.getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );

  // se già si è svolta l' operazione ad esempio "2 + 2 = 4" allora svolgi di nuovo l' operazione quindi sarà "4 + 2 = 6"
  if (stateApp.calculus.includes("=")) {
    const result = utils.getCalculatedOperation(
      previousMathOperation,
      calculatedVal,
      currentNumber
    );
    stateApp.result = utils.fromNumberToResult(result);
    stateApp.calculus = `${calculatedVal} ${previousMathOperation} ${currentNumber} =`;
    return;
  }

  // si spiega da solo
  if (isNaN(calculatedVal)) {
    setStateError();
    return;
  }
  // imposta la variabile calculus che verrà visualizzata e il risultato
  stateApp.calculus = stateApp.calculus + " " + currentNumber + " =";
  stateApp.result = utils.fromNumberToResult(calculatedVal);
}

// prende l' operazione corrente e la ritorna (spiegato sopra).
function getMathOperationAndLeftRightNumber() {
  const calculus = stateApp.calculus.split(" ");
  return [
    calculus[1],
    utils.getNumberByStr(calculus[0]),
    stateApp.currentNumber,
  ];
}

function handleOperation(operation) {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }

  // se hasInnerCalculationPow allora calcola il risultato con handleEqual() e poi esegui l' oprazione con handleOperation
  if (stateApp.hasInnerCalculationPow) {
    handleEqual();
    handleOperation(operation);
    return;
  }
  // se non c'è calculus e nemmeno result (ad esempio all' inizio quando non si è schiacciato nulla) allora ritorna.
  if (!stateApp.calculus && !stateApp.result) return;

  // se non c'è calculus ma c'è result (ad esempio 3), allora pulisci result e spostalo in calculus con l'operando schiacciato ad esempio "+", calculus diventerà "3 +"
  if (!stateApp.calculus && stateApp.result) {
    stateApp.calculus = stateApp.result + " " + operation;
    stateApp.result = "";
    return;
  }
  // se nessuno dei casi sopra si è attivato allora vuol dire che si sta svolgendo delle operazione l' una dopo l' altra ad esempio "1 + 2" seguito da un "+ 3"

  // imposta cleanResult su true
  stateApp.cleanResult = true;

  // prendi i valori dell' operazione
  const [previousMathOperation, leftNumber, currentNumber] =
    getMathOperationAndLeftRightNumber();

  // calcola l' operazione
  const calculatedVal = utils.getCalculatedOperation(
    previousMathOperation,
    leftNumber,
    currentNumber
  );
  if (isNaN(calculatedVal)) {
    setStateError();
    return;
  }

  // aggiorna lo stato
  const result = utils.fromNumberToResult(calculatedVal);
  stateApp.result = result;
  stateApp.calculus = `${result} ${operation}`;
  stateApp.currentNumber = 0;
}

function handleReverse() {
  // se si sta svolgendo un' operazione ad esempio "2^(2)", allora ritorna.
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  // il valore su cui applicare reverse, può essere il result o current number
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;

  if (toCompute === 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }

  // calcola il valore e impost il nuovo state
  const val = 1 / toCompute;
  const result = utils.fromNumberToResult(val);
  // se si è premuto = allora pulisci il calculus altrimenti dà problemi, se togli la riga e provi a fare "5 + 5 = 10" poi schiacci la funzione reverse (quindi il risultato sarà 0.1) e poi un' operazione ad esempio "+" darà un risutlato inaspettato (5.1)
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = result;
}

// simile a handleReverse
function handleSqrt() {
  if (stateApp.hasInnerCalculationPow) return;
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute < 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }
  const val = Math.sqrt(toCompute);
  const result = utils.fromNumberToResult(val);
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = result;
}

// simile a handleReverse
function handleLog() {
  if (stateApp.hasInnerCalculationPow) {
    return;
  }
  const toCompute =
    utils.getNumberByStr(stateApp.result) ?? stateApp.currentNumber;
  if (toCompute <= 0 || isNaN(toCompute)) {
    setStateError();
    return;
  }
  const val = Math.log(toCompute);
  const result = utils.fromNumberToResult(val);
  if (stateApp.calculus.includes("=")) stateApp.calculus = "";
  stateApp.currentNumber = val;
  stateApp.cleanResult = true;
  stateApp.result = result;
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
    console.log(stateApp);
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
        if (stateApp.calculus.includes("=")) stateApp.calculus = "";
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
      case "log":
        handleLog();
        break;
      default:
        break;
    }
    updateUI(stateApp.result, stateApp.calculus);
  }
});
