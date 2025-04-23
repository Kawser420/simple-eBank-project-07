// show cash out
// document
//   .getElementById("btn-show-cash-out")
//   .addEventListener("click", function () {
//     document.getElementById("cash-out-form").classList.remove("hidden");
//     document.getElementById("add-money-form").classList.add("hidden");
//   });
// //   show add money
// document
//   .getElementById("btn-show-add-money")
//   .addEventListener("click", function () {
//     document.getElementById("cash-out-form").classList.add("hidden");
//     document.getElementById("add-money-form").classList.remove("hidden");
//   });

// show add money section
document
  .getElementById("show-add-money-form")
  .addEventListener("click", function () {
    showSectionById("add-money-form");
  });

// show cash out form
document
  .getElementById("show-cash-out-form")
  .addEventListener("click", function () {
    showSectionById("cash-out-form");
  });

// show transaction form
document
  .getElementById("show-transaction-history")
  .addEventListener("click", function () {
    showSectionById("transaction-section");
  });
