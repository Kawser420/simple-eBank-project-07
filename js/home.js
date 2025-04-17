// add money start
document
  .getElementById("btn-add-money")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const inputAmount = document.getElementById("input-amount").value;
    const inputPin = document.getElementById("input-pin").value;
    // console.log(inputAmount, inputPin);
    // check pin
    if (inputPin === "1234") {
      const inputAmount = document.getElementById("input-amount").value;
      const mainBalance = document.getElementById("main-balance").innerText;
      // console.log(inputAmount, mainBalance);
      //   parseFloat
      const inputAmountField = parseFloat(inputAmount);
      const mainBalanceUpdated = parseFloat(mainBalance);
      const newBalance = inputAmountField + mainBalanceUpdated;
      // console.log(newBalance);
      //   final step
      document.getElementById("main-balance").innerText = newBalance;
    } else {
      alert("Failed Pin Number. please try again!");
    }
  });
// add money end

// cash out start
document
  .getElementById("btn-cash-out")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const cashInputMoney = document.getElementById("cash-input-money").value;
    const cashInputMoneyNumber = parseFloat(cashInputMoney);
    const cashInputPin = document.getElementById("cash-input-pin").value;
    if (cashInputPin === "1234") {
      const mainBalance = document.getElementById("main-balance").innerText;
      const mainBalanceNumber = parseFloat(mainBalance);
      const remainingBalance = mainBalanceNumber - cashInputMoneyNumber;
      // cash out remaining balance
      document.getElementById("main-balance").innerText = remainingBalance;
    } else {
      alert("Failed cash out. please try again!");
    }
  });
// cash out end
