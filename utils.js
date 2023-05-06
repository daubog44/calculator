export function getNumberByStr(str) {
  return parseFloat(str.replace(",", "."));
}

export function fromNumberToResult(result) {
  return String(result).replace(".", ",");
}
