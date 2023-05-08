import { updateUI, addEventListenerToBtnsContainer } from "./view.js";
import stateApp from "./stateClass.js";
import {
  numberHandler,
  negateHandler,
  FPointHandler,
} from "./handlers/numberHandler.js";
import { cancHandler } from "./handlers/cancHandler.js";
import { powHandler } from "./handlers/complexMathOperations.js";
import {
  logHandler,
  reverseHandler,
  sqrtHandler,
} from "./handlers/functionsMathHandler.js";
import { operationHandler } from "./handlers/operationHandler.js";
import { equalHandler } from "./handlers/equalHandler.js";

addEventListenerToBtnsContainer((e) => {
  if (e.target !== e.currentTarget) {
    const typeOfBtn = e.target.style.gridArea.split(" ")[0];
    if (stateApp.result === "Error") {
      stateApp.resetState();
    }
    switch (typeOfBtn) {
      case "zero":
        numberHandler(0);
        break;
      case "one":
        numberHandler(1);
        break;
      case "two":
        numberHandler(2);
        break;
      case "three":
        numberHandler(3);
        break;
      case "four":
        numberHandler(4);
        break;
      case "five":
        numberHandler(5);
        break;
      case "six":
        numberHandler(6);
        break;
      case "seven":
        numberHandler(7);
        break;
      case "eight":
        numberHandler(8);
        break;
      case "nine":
        numberHandler(9);
        break;
      case "f-point":
        FPointHandler();
        break;
      case "negate":
        negateHandler();
        break;
      case "C":
        stateApp.resetState();
        break;
      case "CE":
        stateApp.hasInnerCalculationPow = false;
        stateApp.result = "0";
        stateApp.currentNumber = 0;
        stateApp.cleanResult = true;
        break;
      case "CANC":
        cancHandler();
        break;
      case "plus":
        operationHandler("+");
        break;
      case "minus":
        operationHandler("-");
        break;
      case "multiply":
        operationHandler("x");
        break;
      case "divide":
        operationHandler("/");
        break;
      case "equal":
        equalHandler();
        break;
      case "reverse":
        reverseHandler();
        break;
      case "sqrt":
        sqrtHandler();
        break;
      case "pow":
        powHandler();
        break;
      case "log":
        logHandler();
        break;
      default:
        break;
    }
    updateUI(stateApp.result, stateApp.calculus);
  }
});
