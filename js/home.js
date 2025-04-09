// add money
document
  .getElementById("btn-add-money")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const inputAmount = document.getElementById("input-amount").value;
    const inputPin = document.getElementById("input-pin").value;
    console.log(inputAmount, inputPin);
    // check pin
    if (inputPin === "1234") {
      const inputAmount = document.getElementById("input-amount").value;
      const mainBalance = document.getElementById("main-balance").innerText;
      console.log(inputAmount, mainBalance);
      //   parseFloat
      const inputAmountField = parseFloat(inputAmount);
      const mainBalanceUpdated = parseFloat(mainBalance);
      const newBalance = inputAmountField + mainBalanceUpdated;
      console.log(newBalance);
      //   final step
      document.getElementById("main-balance").innerText = newBalance;
    } else {
      alert("Failed Pin Number. please try again!");
    }
  });
