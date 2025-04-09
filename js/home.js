// add money
document
  .getElementById("btn-add-money")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const inputAmount = document.getElementById("input-amount").value;
    const inputPin = document.getElementById("input-pin").value;
    console.log(inputAmount, inputPin);
  });
