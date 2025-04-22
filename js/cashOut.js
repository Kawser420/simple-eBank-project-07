// cash out field
document
  .getElementById("btn-cash-out")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const inputCash = getInputFieldValueById("cash-input-money");
    const inputPin = getInputFieldValueById("cash-input-pin");
    // wrong way to pin number
    if (inputPin === 1234) {
      const balance = getTextFieldValueById("account-balance");
      const remainingBalance = balance - inputCash;
      document.getElementById("account-balance").innerText = remainingBalance;
    } else {
      alert("Failed cash out!!! please try again");
    }
  });
