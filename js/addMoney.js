// add money
document
  .getElementById("btn-add-money")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const addMoney = document.getElementById("input-add-money").value;
    const addPinNumber = document.getElementById("input-pin-number").value;
    console.log(addMoney, addPinNumber);
  });
// wrang way to validation
if (addPinNumber === "1234") {
  const balance = document.getElementById("account-balance").innerText;
  const newBalance = parseFloat();
  console.log("balance", balance);
  console.log("pin was just click");
} else {
  alert("wrong pin number");
}
