document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const fields = form.querySelectorAll('input, textarea');
    
    const fieldOrder = ['name', 'email', 'fathername', 'UserName', 'password', 'confirmpassword', 'dob', 'gender', 'phonenumber', 'address', 'ChooseFile'];
    
    fieldOrder.forEach((fieldId, index) => {
        if (index > 0) {
            const field = document.getElementById(fieldId);
            if (field) {
                field.parentElement.style.display = 'none';
            }
        }
    });

    const patterns = {
        name: /^[a-zA-Z\s]{2,50}$/,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        username: /^[a-zA-Z0-9_]{3,20}$/,
        password: /.{6,}/,
        phone: /^[0-9]{10}$/,
        address: /.{5,}/
    };

    function validateAge(dob) {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return age >= 18;
    }

    function showNextField(currentId) {
        const currentIndex = fieldOrder.indexOf(currentId);
        if (currentIndex < fieldOrder.length - 1) {
            const nextField = document.getElementById(fieldOrder[currentIndex + 1]);
            if (nextField) {
                nextField.parentElement.style.display = 'block';
                nextField.focus();
            }
        }
    }

    function validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name || field.id;
        
        const errorDiv = field.parentElement.querySelector('.error');
        if (errorDiv) {
            errorDiv.remove();
        }
        
        field.classList.remove('error', 'valid');
        
        if (!value) {
            return false;
        }
        
        let isValid = true;
        let errorMessage = '';
        
        switch(field.id) {
            case 'name':
                if (!patterns.name.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid name (letters only)';
                }
                break;
            case 'email':
                if (!patterns.email.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email';
                }
                break;
            case 'UserName':
                if (!patterns.username.test(value)) {
                    isValid = false;
                    errorMessage = 'Username must be 3-20 characters (letters, numbers, underscore)';
                }
                break;
            case 'password':
                if (!patterns.password.test(value)) {
                    isValid = false;
                    errorMessage = 'Password must be at least 6 characters';
                }
                break;
            case 'confirmpassword':
                const password = document.getElementById('password').value;
                if (value !== password) {
                    isValid = false;
                    errorMessage = 'Passwords do not match';
                }
                break;
            case 'dob':
                if (!validateAge(value)) {
                    isValid = false;
                    errorMessage = 'You must be at least 18 years old';
                }
                break;
            case 'phonenumber':
                if (!patterns.phone.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid 10-digit phone number';
                }
                break;
            case 'address':
                if (!patterns.address.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid address';
                }
                break;
        }
        
        if (!isValid) {
            field.classList.add('error');
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '12px';
            errorDiv.textContent = errorMessage;
            field.parentElement.appendChild(errorDiv);
        } else {
            field.classList.add('valid');
            showNextField(field.id);
        }
        
        return isValid;
    }

    fields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value.trim()) {
                validateField(this);
            }
        });
        
        field.addEventListener('input', function() {
            const errorDiv = this.parentElement.querySelector('.error');
            if (errorDiv && this.value.trim()) {
                validateField(this);
            }
        });
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        fields.forEach(field => {
            if (field.parentElement.style.display !== 'none') {
                if (!validateField(field)) {
                    isValid = false;
                }
            }
        });
        
        const genderInputs = document.querySelectorAll('input[name="gender"]');
        let genderSelected = false;
        genderInputs.forEach(input => {
            if (input.checked) genderSelected = true;
        });
        
        if (!genderSelected && document.querySelector('input[name="gender"]').parentElement.style.display !== 'none') {
            const genderDiv = document.querySelector('input[name="gender"]').parentElement;
            const errorDiv = genderDiv.querySelector('.error') || document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.style.color = 'red';
            errorDiv.style.fontSize = '12px';
            errorDiv.textContent = 'Please select gender';
            if (!genderDiv.querySelector('.error')) {
                genderDiv.appendChild(errorDiv);
            }
            isValid = false;
        }
        
        if (isValid) {
            alert('Registration successful!');
            form.reset();
            fieldOrder.forEach((fieldId, index) => {
                if (index > 0) {
                    const field = document.getElementById(fieldId);
                    if (field) {
                        field.parentElement.style.display = 'none';
                    }
                }
            });
        }
    });

    document.getElementById('name').parentElement.style.display = 'block';
});
