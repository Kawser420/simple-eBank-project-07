// Login Form
document
  .getElementById("btn-login")
  .addEventListener("click", function (event) {
    event.preventDefault();
    // phone number
    const phoneNumber = document.getElementById("phone-number").value;
    const pinNumber = document.getElementById("pin-number").value;
    if (phoneNumber === "017" && pinNumber === "1234") {
      console.log("successful");
      window.location.href = "/home.html";
    } else {
      alert("Wrong phone number and Wrong pin number");
    }
    console.log(phoneNumber, pinNumber);
  });
