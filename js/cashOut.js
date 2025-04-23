// cash out field
document
  .getElementById("btn-cash-out")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const inputCash = getInputFieldValueById("cash-input-money");
    const inputPin = getInputFieldValueById("cash-input-pin");
    // validation cash out
    if (isNaN(inputCash)) {
      alert("failed!!!!!!");
      return;
    }

    // wrong way to pin number
    if (inputPin === 1234) {
      const balance = getTextFieldValueById("account-balance");
      if (inputCash > balance) {
        alert("failed!!!!!!!!!");
        return;
      }
      const remainingBalance = balance - inputCash;
      document.getElementById("account-balance").innerText = remainingBalance;

      // cash out add to transaction history
      const div = document.createElement("div");
      div.innerHTML = `
      <h3 class="text-2xl">Cash Out</h3>
      <p>Withdraw: ${inputCash} TK. New Balance ${remainingBalance} TK.</p>
      `;
      // transaction append child
      document.getElementById("transaction-section").appendChild(div);
    } else {
      alert("Failed cash out!!! please try again");
    }
  });
