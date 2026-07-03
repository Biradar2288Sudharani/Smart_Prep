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
// PASSWORD VALIDATION
// ==========================================

const password=document.getElementById("password");
const confirmPassword=document.getElementById("confirmPassword");

const upper=document.getElementById("rule-uppercase");
const lower=document.getElementById("rule-lowercase");
const number=document.getElementById("rule-number");
const special=document.getElementById("rule-special");
const lengthRule=document.getElementById("rule-length");

const strengthBar=document.getElementById("strength-bar");
const strengthText=document.getElementById("strength-text");

const confirmError=document.getElementById("confirm-error");

password.addEventListener("input",function(){

    let value=password.value;

    value=value.replace(/\s/g,"");

    password.value=value;

    let score=0;

    // First character uppercase
    if(/^[A-Z]/.test(value)){
        upper.innerHTML="✔ First letter must be uppercase";
        score++;
    }else{
        upper.innerHTML="❌ First letter must be uppercase";
    }

    // Lowercase
    if(/[a-z]/.test(value)){
        lower.innerHTML="✔ At least one lowercase letter";
        score++;
    }else{
        lower.innerHTML="❌ At least one lowercase letter";
    }

    // Number
    if(/[0-9]/.test(value)){
        number.innerHTML="✔ At least one number";
        score++;
    }else{
        number.innerHTML="❌ At least one number";
    }

    // Special Character
    if(/[!@#$%^&*(),.?":{}|<>]/.test(value)){
        special.innerHTML="✔ At least one special character";
        score++;
    }else{
        special.innerHTML="❌ At least one special character";
    }

    // Length
    if(value.length>=8){
        lengthRule.innerHTML="✔ Minimum 8 characters";
        score++;
    }else{
        lengthRule.innerHTML="❌ Minimum 8 characters";
    }

    // Strength Meter
    if(score<=2){

        strengthBar.style.width="35%";
        strengthBar.style.background="red";
        strengthText.innerHTML="Weak Password";

    }

    else if(score==3 || score==4){

        strengthBar.style.width="70%";
        strengthBar.style.background="orange";
        strengthText.innerHTML="Medium Password";

    }

    else{

        strengthBar.style.width="100%";
        strengthBar.style.background="green";
        strengthText.innerHTML="✔ Strong Password";

    }

});

// ==========================================
// CONFIRM PASSWORD
// ==========================================

confirmPassword.addEventListener("input",function(){

    if(confirmPassword.value===""){

        confirmError.innerHTML="";

    }

    else if(password.value===confirmPassword.value){

        confirmError.style.color="green";
        confirmError.innerHTML="✔ Password matched successfully.";

    }

    else{

        confirmError.style.color="red";
        confirmError.innerHTML="❌ Passwords do not match.";

    }

});