export function getNumberByStr(str) {
  return parseFloat(str.replace(",", "."));
}

export function fromNumberToResult(result) {
  return String(result).replace(".", ",");
}

export function getCalculatedOperation(op, left, right) {
  // https://blog.luismarques.io/why-01-02-03-in-javascript-and-how-to-fix-it#heading-using-fixed-point-arithmetic
  const precision = 1000;
  switch (op) {
    case "+":
      return (left * precision + right * precision) / precision;
    case "-":
      return (left * precision - right * precision) / precision;
    case "x":
      return (left * precision * (right * precision)) / precision / precision;
    case "/":
      if (right === 0) {
        return NaN;
      }
      return ((left * precision) / (right * precision) / precision) * precision;
    default:
      return NaN;
  }
}

export function getMathOperationAndLeftRightNumber(stateApp) {
  const [leftNumber, operation] = stateApp.calculus.split(" ");
  return [operation, getNumberByStr(leftNumber), stateApp.currentNumber];
}
