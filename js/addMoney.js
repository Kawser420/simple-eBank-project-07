// add money
document
  .getElementById("btn-add-money")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const addMoney = getInputFieldValueById("input-add-money");
    const pinNumber = getInputFieldValueById("input-pin-number");

    // validation add money
    if (isNaN(addMoney)) {
      alert("failed! try again...........");
      return;
    }
    if (pinNumber === 1234) {
      const balance = getTextFieldValueById("account-balance");
      const newBalance = balance + addMoney;
      document.getElementById("account-balance").innerText = newBalance;

      // add to transaction history
      const p = document.createElement("p");
      p.innerText = `Added: ${addMoney} TK. New Balance: ${newBalance}`;

      // should be a common function
      document.getElementById("transaction-section").appendChild(p);
    } else {
      alert("Failed pin number!!! please try again and again!!!!!!!!!!");
    }
  });
