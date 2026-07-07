// ======================================
// SMART PREP
// Profile Photo Preview
// ======================================

const profileInput = document.getElementById("profile_photo");
const previewImage = document.getElementById("preview-image");
const uploadMessage = document.getElementById("upload-message");

profileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (file) {

        const reader = new FileReader();

        reader.onload = function (event) {

            previewImage.src = event.target.result;

            uploadMessage.innerHTML = "✅ Photo selected successfully.";

            // Automatically hide the message after 5 seconds
            setTimeout(function () {

                uploadMessage.innerHTML = "";

            }, 5000);

        };

        reader.readAsDataURL(file);

    }

});

// ==========================================
// FIRST NAME VALIDATION
// Only Letters and Single Space Allowed
// ==========================================

const firstNameInput = document.getElementById("first_name");
const firstNameError = document.getElementById("first-name-error");

firstNameInput.addEventListener("input", function () {

    // Keep only letters and spaces
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");

    // Remove multiple spaces
    this.value = this.value.replace(/\s{2,}/g, " ");

    // Remove leading spaces
    this.value = this.value.replace(/^\s+/, "");

    // Validation message
    if (this.value.trim() === "") {

        firstNameError.textContent = "First name is required.";

    } else {

        firstNameError.textContent = "";

    }

});
// ==========================================
// LAST NAME VALIDATION
// Only Letters and Single Space Allowed
// ==========================================

const lastNameInput = document.getElementById("last_name");
const lastNameError = document.getElementById("last-name-error");

lastNameInput.addEventListener("input", function () {

    // Allow only letters and spaces
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");

    // Remove multiple spaces
    this.value = this.value.replace(/\s{2,}/g, " ");

    // Remove leading spaces
    this.value = this.value.replace(/^\s+/, "");

    // Validation message
    if (this.value.trim() === "") {

        lastNameError.textContent = "Last name is required.";

    } else {

        lastNameError.textContent = "";

    }

});

// ==========================================
// MOBILE NUMBER VALIDATION
// Digits Only
// ==========================================

const mobileInput = document.getElementById("mobile_number");
const mobileError = document.getElementById("mobile-error");

mobileInput.addEventListener("input", function () {

    // Remove everything except digits
    this.value = this.value.replace(/\D/g, "");

    // Maximum 10 digits
    if (this.value.length > 10) {

        this.value = this.value.slice(0, 10);

    }

    if (this.value.length === 0) {

        mobileError.textContent = "Mobile number is required.";

    }
    else if (this.value.length < 10) {

        mobileError.textContent = "Mobile number must contain 10 digits.";

    }
    else {

        mobileError.textContent = "";

    }

});

// ==========================================
// PASSWORD VALIDATION & STRENGTH METER
// ==========================================
const password = document.getElementById("password");
const strengthBar = document.getElementById("strength-bar");
const strengthText = document.getElementById("strength-text");

console.log(password);
console.log(strengthBar);
console.log(strengthText);


password.addEventListener("input", function () {
    console.log("Password Validation Running...");
    let value = this.value;

    // Remove all spaces automatically
    value = value.replace(/\s/g, "");

    this.value = value;

    let score = 0;

    // First character uppercase
    if (/^[A-Z]/.test(value)) {

        score++;

    }

    // At least one lowercase
    if (/[a-z]/.test(value)) {

        score++;

    }

    // At least one number
    if (/\d/.test(value)) {

        score++;

    }

    // At least one special character
    if (/[!@#$%^&*(),.?":{}|<>]/.test(value)) {

        score++;

    }

    // Minimum 8 characters
    if (value.length >= 8) {

        score++;

    }


    // Remove previous classes

    strengthBar.classList.remove("weak", "medium", "strong");
    strengthText.classList.remove("weak", "medium", "strong");


    // Empty Password

    if (value.length === 0) {

        strengthBar.style.width = "0%";

        strengthText.textContent = "";

        return;

    }


    // Weak Password

    strengthBar.className = "";
strengthText.className = "";

if (score <= 2) {

    strengthBar.style.width = "35%";
    strengthBar.style.background = "#EF4444";

    strengthText.textContent = "Weak Password";
    strengthText.style.color = "#EF4444";

}
else if (score <= 4) {

    strengthBar.style.width = "70%";
    strengthBar.style.background = "#F59E0B";

    strengthText.textContent = "Medium Password";
    strengthText.style.color = "#F59E0B";

}
else {

    strengthBar.style.width = "100%";
    strengthBar.style.background = "#22C55E";

    strengthText.textContent = "Strong Password";
    strengthText.style.color = "#22C55E";

}

});

// ==========================================
// CONFIRM PASSWORD
// ==========================================
const confirmPassword = document.getElementById("confirmPassword");
const confirmError = document.getElementById("confirm-error");

console.log(confirmPassword);
console.log(confirmError);

confirmPassword.addEventListener("input", function () {

    if (confirmPassword.value === "") {

        confirmError.innerHTML = "";

    }

    else if (password.value === confirmPassword.value) {

        confirmError.style.color = "green";
        confirmError.innerHTML = "✔ Password matched successfully.";

    }

    else {

        confirmError.style.color = "red";
        confirmError.innerHTML = "❌ Passwords do not match.";

    }

});

// ==========================================
// SHOW / HIDE PASSWORD
// ==========================================

const togglePassword = document.getElementById("togglePassword");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");

    } else {

        password.type = "password";

        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");

    }

});


// ==========================================
// SHOW / HIDE CONFIRM PASSWORD
// ==========================================

const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

toggleConfirmPassword.addEventListener("click", function () {

    if (confirmPassword.type === "password") {

        confirmPassword.type = "text";

        this.classList.remove("fa-eye");
        this.classList.add("fa-eye-slash");

    } else {

        confirmPassword.type = "password";

        this.classList.remove("fa-eye-slash");
        this.classList.add("fa-eye");

    }

});

// ==========================================
// SECURITY ANSWER VALIDATION
// ==========================================

const securityAnswer = document.getElementById("security_answer");
const securityAnswerError = document.getElementById("security-answer-error");

securityAnswer.addEventListener("input", function () {

    // Allow only letters and spaces
    this.value = this.value.replace(/[^a-zA-Z ]/g, "");

    // Remove multiple spaces
    this.value = this.value.replace(/\s{2,}/g, " ");

    // Remove leading spaces
    this.value = this.value.replace(/^\s+/, "");

    if (this.value.trim() === "") {

        securityAnswerError.textContent = "Security answer is required.";

    }

    else {

        securityAnswerError.textContent = "";

    }

});


// ==========================================
// EMAIL VALIDATION
// ==========================================

const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");

emailInput.addEventListener("input", function () {

    // Remove leading and trailing spaces
    this.value = this.value.trim();

    const email = this.value.toLowerCase();

    // Basic Email Format
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Allowed Top-Level Domains
    const allowedTLDs = [
        "com",
        "in",
        "org",
        "net",
        "edu",
        "gov",
        "co.in",
        "ac.in",
        "io",
        "ai",
        "me"
    ];

    if (email === "") {

        emailError.textContent = "Email address is required.";

        return;

    }

    // Check basic email format
    if (!emailPattern.test(email)) {

        emailError.textContent = "Enter a valid email address.";

        return;

    }

    // Check allowed TLD
    let validTLD = false;

    for (let tld of allowedTLDs) {

        if (email.endsWith("." + tld)) {

            validTLD = true;
            break;

        }

    }

    if (!validTLD) {

        emailError.textContent = "Email domain extension is not supported.";

        return;

    }

    // Valid Email
    emailError.textContent = "";

});