document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("registrationForm");
  const fields = form.querySelectorAll(
    "input:not([type=radio]):not([type=checkbox]), textarea"
  );

  const fieldOrder = [
    "name",
    "email",
    "fathername",
    "UserName",
    "password",
    "confirmpassword",
    "dob",
    "gender", 
    "languages", 
    "phonenumber",
    "address",
    "ChooseFile",
  ];

  
  fieldOrder.forEach((fieldId, index) => {
    if (fieldId === "gender" || fieldId === "languages") {
      const firstInput =
        fieldId === "gender"
          ? form.querySelector('input[name="gender"]')
          : form.querySelector('input[name="languages"]');
      if (firstInput) {
        firstInput.parentElement.style.display = index === 0 ? "block" : "none";
      }
      return;
    }
    const field = document.getElementById(fieldId);
    if (field) {
      field.parentElement.style.display = index === 0 ? "block" : "none";
    }
  });

  const patterns = {
    name: /^[a-zA-Z\s]{2,50}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    fathername: /^[a-zA-Z\s]{2,50}$/,
    UserName: /^[a-zA-Z0-9_]{3,20}$/,
    password: /.{6,}/,
    phone: /^[0-9]{10}$/,
    address: /.{5,}/,
  };

  function validateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age >= 18;
  }

  function showNextField(currentId) {
    const currentIndex = fieldOrder.indexOf(currentId);
    if (currentIndex < 0) return;

    if (currentId === "gender") {
      const langField = form.querySelector('input[name="languages"]');
      if (langField) {
        langField.parentElement.style.display = "block";
        langField.focus();
      }
      return;
    }

    if (currentIndex < fieldOrder.length - 1) {
      const nextFieldId = fieldOrder[currentIndex + 1];

      if (nextFieldId === "gender") {
        const genderFirstInput = form.querySelector('input[name="gender"]');
        if (genderFirstInput) {
          genderFirstInput.parentElement.style.display = "block";
          genderFirstInput.focus();
        }
      } else if (nextFieldId === "languages") {
        const langFirstInput = form.querySelector('input[name="languages"]');
        if (langFirstInput) {
          langFirstInput.parentElement.style.display = "block";
          langFirstInput.focus();
        }
      } else {
        const nextField = document.getElementById(nextFieldId);
        if (nextField) {
          nextField.parentElement.style.display = "block";
          nextField.focus();
        }
      }
    }
  }

  function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;

    const prevError = field.parentElement.querySelector(".error");
    if (prevError) prevError.remove();

    field.classList.remove("error", "valid");

    if (!value) {
      return false;
    }

    let isValid = true;
    let errorMessage = "";

    switch (field.id) {
      case "name":
        if (!patterns.name.test(value)) {
          isValid = false;
          errorMessage = "Please enter a valid name (letters only)";
        }
        break;

      case "email":
        if (!patterns.email.test(value)) {
          isValid = false;
          errorMessage = "Please enter a valid email";
        }
        break;

      case "fathername":
        if (!patterns.fathername.test(value)) {
          isValid = false;
          errorMessage = "Please enter a valid father's name (letters only)";
        }
        break;

      case "UserName":
        if (!patterns.UserName.test(value)) {
          isValid = false;
          errorMessage =
            "Username must be 3-20 characters (letters, numbers, underscore)";
        }
        break;

      case "password":
        if (!patterns.password.test(value)) {
          isValid = false;
          errorMessage = "Password must be at least 6 characters";
        }
        break;

      case "confirmpassword":
        const password = document.getElementById("password").value;
        if (value !== password) {
          isValid = false;
          errorMessage = "Passwords do not match";
        }
        break;

      case "dob":
        if (!validateAge(value)) {
          isValid = false;
          errorMessage = "You must be at least 18 years old";
        }
        break;

      case "phonenumber":
        if (!patterns.phone.test(value)) {
          isValid = false;
          errorMessage = "Please enter a valid 10-digit phone number";
        }
        break;

      case "address":
        if (!patterns.address.test(value)) {
          isValid = false;
          errorMessage = "Please enter a valid address";
        }
        break;

      case "ChooseFile":
        if (!field.files || field.files.length === 0) {
          isValid = false;
          errorMessage = "Please upload a file";
        }
        break;
    }

    if (!isValid) {
      field.classList.add("error");
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.style.color = "red";
      errorDiv.style.fontSize = "12px";
      errorDiv.textContent = errorMessage;
      field.parentElement.appendChild(errorDiv);
    } else {
      field.classList.add("valid");
      showNextField(field.id);
    }

    return isValid;
  }

  function validateGender() {
    const genderInputs = form.querySelectorAll('input[name="gender"]');
    let selected = false;
    genderInputs.forEach((input) => {
      if (input.checked) selected = true;
    });

    const container = genderInputs[0].parentElement;
    const prevError = container.querySelector(".error");
    if (prevError) prevError.remove();

    if (!selected) {
      const errorDiv = document.createElement("div");
      errorDiv.className = "error";
      errorDiv.style.color = "red";
      errorDiv.style.fontSize = "12px";
      errorDiv.textContent = "Please select gender";
      container.appendChild(errorDiv);
      return false;
    }
    showNextField("gender");
    return true;
  }

  function validateLanguages() {
    const langInputs = form.querySelectorAll('input[name="languages"]');
    showNextField("languages");
  }

  fields.forEach((field) => {
    field.addEventListener("blur", function () {
      if (this.value.trim()) {
        validateField(this);
      }
    });

    field.addEventListener("input", function () {
      const errorDiv = this.parentElement.querySelector(".error");
      if (errorDiv && this.value.trim()) {
        validateField(this);
      }
    });
  });

  const genderInputs = form.querySelectorAll('input[name="gender"]');
  genderInputs.forEach((input) => {
    input.addEventListener("change", function () {
      validateGender();
    });
  });

  const langInputs = form.querySelectorAll('input[name="languages"]');
  langInputs.forEach((input) => {
    input.addEventListener("change", function () {
      validateLanguages();
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let isValid = true;

    fields.forEach((field) => {
      if (field.parentElement.style.display !== "none") {
        if (!validateField(field)) {
          isValid = false;
        }
      }
    });

    if (
      form.querySelector('input[name="gender"]').parentElement.style.display !==
      "none"
    ) {
      if (!validateGender()) isValid = false;
    }

    if (isValid) {
      alert("Registration successful!");
      form.reset();

      fieldOrder.forEach((fieldId, index) => {
        if (fieldId === "gender") {
          const genderFirstInput = form.querySelector('input[name="gender"]');
          if (genderFirstInput) {
            genderFirstInput.parentElement.style.display = index === 0 ? "block" : "none";
            const errorDiv = genderFirstInput.parentElement.querySelector(".error");
            if (errorDiv) errorDiv.remove();
          }
          return;
        }
        if (fieldId === "languages") {
          const langFirstInput = form.querySelector('input[name="languages"]');
          if (langFirstInput) {
            langFirstInput.parentElement.style.display = index === 0 ? "block" : "none";
            const errorDiv = langFirstInput.parentElement.querySelector(".error");
            if (errorDiv) errorDiv.remove();
          }
          return;
        }
        const field = document.getElementById(fieldId);
        if (field) {
          field.parentElement.style.display = index === 0 ? "block" : "none";
          field.classList.remove("error", "valid");
          const errorDiv = field.parentElement.querySelector(".error");
          if (errorDiv) errorDiv.remove();
        }
      });
    }
  });
});
