const displayResult = document.querySelector(".calculator-current__result");

const currentCalculus = document.querySelector(
  ".calculator-current__calculation"
);

export function updateUI(result, calculus) {
  displayResult.innerHTML = result;
  currentCalculus.innerHTML = calculus;
}

const btnsContainer = document.querySelector(".calculator-btns__container");
export function addEventListenerToBtnsContainer(func) {
  btnsContainer.addEventListener("click", (e) => {
    func(e);
  });
}
