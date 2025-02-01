function togglePassword() {
    var passwordField = document.getElementById("accountPassword");
    if (passwordField.type === "password") {
        passwordField.type = "text";
    } else {
        passwordField.type = "password";
    }
}