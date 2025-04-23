// utilities
// add money field
function getInputFieldValueById(id) {
  console.log("input value");
  const inputValue = document.getElementById(id).value;
  const inputNumber = parseFloat(inputValue);
  return inputNumber;
}
// cash out field
function getTextFieldValueById(id) {
  const textValue = document.getElementById(id).innerText;
  const textNumber = parseFloat(textValue);
  return textNumber;
}

// transaction
function showSectionById(id) {
  document.getElementById("add-money-form").classList.add("hidden");
  document.getElementById("cash-out-form").classList.add("hidden");
  document.getElementById("transaction-section").classList.add("hidden");

  // show just add money form
  document.getElementById(id).classList.remove("hidden");
}
