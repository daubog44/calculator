export function getNumberByStr(str) {
  return parseFloat(str.replace(",", "."));
}

export function fromNumberToResult(result) {
  return String(result).replace(".", ",");
}

export function getCalculatedOperation(op, left, right) {
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

export function negateToStr(number, numberToCompare) {
  if (numberToCompare > 0) {
    return `-${number}`;
  } else {
    return number.replace("-", "");
  }
}
