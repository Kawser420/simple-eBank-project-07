// add money
document
  .getElementById("btn-add-money")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const addMoney = document.getElementById("input-add-money").value;
    const addPinNumber = document.getElementById("input-pin-number").value;
    console.log(addMoney, addPinNumber);
  });
