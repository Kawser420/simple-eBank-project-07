// show the cash out
document
  .getElementById("btn-show-cash-out")
  .addEventListener("click", function () {
    document.getElementById("cash-out-form").classList.remove("hidden");
    document.getElementById("add-money-form").classList.add("hidden");
  });
//   show add money
document
  .getElementById("btn-show-add-money")
  .addEventListener("click", function () {
    document.getElementById("cash-out-form").classList.add("hidden");
    document.getElementById("add-money-form").classList.remove("hidden");
  });
