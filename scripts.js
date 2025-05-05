// scripts.js with dynamic validation and cookie functionality

// Initialize the page when DOM is fully loaded
window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("currentDate").textContent = new Date().toLocaleDateString();
  populateStates();
  loadUserData();
});

// Function to update salary display
function updateSalaryDisplay(val) {
  document.getElementById("salaryDisplay").textContent = `$${parseInt(val).toLocaleString()}`;
}

// Populate the states dropdown
function populateStates() {
  const states = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC", "PR"];
  const stateSelect = document.getElementById("state");
  states.forEach(state => {
    const option = document.createElement("option");
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}

// Error handling functions
const showError = (id, message) => {
  const errorElement = document.getElementById(id + "Error");
  if (errorElement) {
    errorElement.textContent = message;
  }
};

const clearError = (id) => {
  const errorElement = document.getElementById(id + "Error");
  if (errorElement) {
    errorElement.textContent = "";
  }
};

// Individual dynamic validators
function validateFirstName() {
  const val = document.getElementById("fname").value.trim();
  const pattern = /^[A-Za-z'-]{1,30}$/;
  if (!pattern.test(val)) {
    showError("fname", "First name must be 1-30 letters, apostrophes or dashes.");
  } else clearError("fname");
}

function validateLastName() {
  const val = document.getElementById("lname").value.trim();
  const pattern = /^[A-Za-z'-]{1,30}$/;
  if (!pattern.test(val)) {
    showError("lname", "Last name must be 1-30 letters, apostrophes or dashes.");
  } else clearError("lname");
}

function validateEmail() {
  const val = document.getElementById("email").value.trim();
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(val)) {
    showError("email", "Invalid email format.");
  } else clearError("email");
}

function validatePhone() {
  const val = document.getElementById("phone").value.trim();
  const pattern = /^\d{3}-\d{3}-\d{4}$/;
  if (!pattern.test(val)) {
    showError("phone", "Phone must be in 123-456-7890 format.");
  } else clearError("phone");
}

function validateUserID() {
  const val = document.getElementById("userid").value.trim();
  const pattern = /^[A-Za-z][A-Za-z0-9_-]{4,19}$/;
  if (!pattern.test(val)) {
    showError("userid", "User ID must be 5-20 characters, start with letter, only letters/numbers/_/- allowed.");
  } else clearError("userid");
}

function validatePassword() {
  const pwd = document.getElementById("password").value;
  const userID = document.getElementById("userid").value.trim();
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!pattern.test(pwd)) {
    showError("password", "Password must be 8+ chars with upper, lower, digit.");
  } else if (pwd === userID) {
    showError("password", "Password must not match User ID.");
  } else {
    clearError("password");
  }
}

function validateConfirmPassword() {
  const pwd = document.getElementById("password").value;
  const confirm = document.getElementById("confirm").value;
  if (pwd !== confirm) {
    showError("confirm", "Passwords do not match.");
  } else {
    clearError("confirm");
  }
}

function validateAllFields() {
  validateFirstName();
  validateLastName();
  validateEmail();
  validatePhone();
  validateUserID();
  validatePassword();
  validateConfirmPassword();

  const allErrors = document.querySelectorAll(".error-message");
  let formValid = true;
  allErrors.forEach(err => {
    if (err.textContent.trim() !== "") formValid = false;
  });

  document.getElementById("finalSubmit").style.display = formValid ? "inline-block" : "none";
  alert(formValid ? "All fields validated. You can now submit." : "Please fix errors before submitting.");
}

// Cookie functions
function setCookie(name, value, days) {
  const d = new Date();
  d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
  console.log("Cookie set: " + name + "=" + value);
}

function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return "";
}

function eraseCookie(name) {
  document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;";
  console.log("Cookie erased: " + name);
}

// Function to update the header iframe with user name
function updateHeaderName(name) {
  // Wait for the iframe to load completely
  setTimeout(function() {
    const headerFrame = document.querySelector("iframe.header-frame");
    if (headerFrame && headerFrame.contentWindow) {
      // Send message to iframe with the user's name
      headerFrame.contentWindow.postMessage({ 
        firstName: name 
      }, "*");
      console.log("Message sent to header iframe: " + name);
    }
  }, 500); // Give the iframe time to load
}

// Load saved user data
function loadUserData() {
  const savedName = getCookie("firstName");
  console.log("Loaded cookie value: " + savedName);
  
  if (savedName) {
    // Fill in the first name field
    document.getElementById("fname").value = savedName;
    
    // Show the "Not You" option
    document.getElementById("notYouContainer").style.display = "block";
    
    // Update the header with the saved name
    updateHeaderName(savedName);
  } else {
    document.getElementById("notYouContainer").style.display = "none";
  }
}

// Register form submission handler
document.getElementById("registrationForm").addEventListener("submit", function(e) {
  e.preventDefault();
  
  const firstName = document.getElementById("fname").value.trim();
  const rememberMe = document.getElementById("remember").checked;
  
  if (firstName && rememberMe) {
    // Save the first name in a cookie for 2 days (48 hours)
    setCookie("firstName", firstName, 2);
    console.log("Name saved: " + firstName);
  } else {
    // If "Remember Me" is unchecked, clear any existing cookies
    eraseCookie("firstName");
    console.log("Cookies cleared due to unchecked Remember Me");
  }
  
  // Continue with form submission (redirect to thank you page)
  window.location.href = "thankyou.html";
});

// Handle the "Not You" checkbox
document.addEventListener("DOMContentLoaded", function() {
  const notYouCheckbox = document.getElementById("notYou");
  if (notYouCheckbox) {
    notYouCheckbox.addEventListener("change", function() {
      if (this.checked) {
        // Clear cookies and form
        eraseCookie("firstName");
        document.getElementById("fname").value = "";
        
        // Update header to show "Welcome New User"
        updateHeaderName("");
        
        // Hide the "Not You" option
        document.getElementById("notYouContainer").style.display = "none";
        
        // Uncheck the checkbox
        this.checked = false;
        
        // Optional: reload the page to refresh everything
        location.reload();
      }
    });
  }
});

// Listen for messages from the header iframe
window.addEventListener("message", function(event) {
  if (event.data && event.data.type === "headerReady") {
    // The header iframe is ready, send the saved name if any
    const savedName = getCookie("firstName");
    if (savedName) {
      updateHeaderName(savedName);
    }
  }
});
