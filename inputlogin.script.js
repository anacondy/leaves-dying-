// Get all the DOM elements we need
const otpInputs = document.querySelectorAll('.otp-input');
const verifyBtn = document.querySelector('.verify-btn');
const otpContainer = document.querySelector('.otp-inputs');

/**
 * Checks the state of all inputs and updates the UI
 */
function checkAllInputs() {
    let allFilled = true;
    otpInputs.forEach(input => {
        if (input.value.length === 0) {
            allFilled = false;
        }
    });

    if (allFilled) {
        verifyBtn.classList.add('ready');
        verifyBtn.disabled = false;
        otpContainer.classList.add('success');
    } else {
        verifyBtn.classList.remove('ready');
        verifyBtn.disabled = true;
        otpContainer.classList.remove('success');
    }
}

/**
 * Simulates submitting the code
 */
function submitVerification() {
    // Get the combined code
    const code = [...otpInputs].map(input => input.value).join('');

    console.log('Verifying code:', code);

    // --- Demo Logic ---
    // For this demo, "1234" is correct, anything else is wrong.
    if (code === '1234') {
        // SUCCESS
        alert('Verification Successful! (Redirecting...)');
        // In theory, you would redirect:
        // window.location.href = 'your-next-page.html';
    } else {
        // ERROR
        triggerErrorAnimation();
    }
}

/**
 * Triggers the red "wipe" animation and clears inputs
 */
function triggerErrorAnimation() {
    // Add the .error class to all inputs to start the CSS animation
    otpInputs.forEach(input => {
        input.classList.add('error');
    });

    // Wait for the animation to finish, then clear inputs
    // The animation is 0.3s, we'll wait 1s to be safe and let it "soak"
    setTimeout(() => {
        otpInputs.forEach(input => {
            input.value = ''; // Clear the value
            input.classList.remove('error'); // Remove class to reset animation
        });
        
        checkAllInputs(); // Update the button/glow state (to disabled)
        otpInputs[0].focus(); // Re-focus the first box
    }, 1000);
}

// --- Event Listeners ---

otpInputs.forEach((input, index) => {
    
    // Keydown for Backspace, Arrows, and Enter
    input.addEventListener('keydown', (e) => {
        // Handle Backspace
        if (e.key === 'Backspace' || e.key === 'Delete') {
            e.preventDefault(); // Stop default behavior
            if (input.value === '' && index > 0) {
                // If current is empty, move focus back
                otpInputs[index - 1].focus();
                otpInputs[index - 1].value = ''; // Also clear the previous one
            } else {
                // If current has value, just clear it
                input.value = '';
            }
            checkAllInputs(); // Re-check state
        }
        
        // Handle Arrow keys
        if (e.key === 'ArrowLeft' && index > 0) {
            otpInputs[index - 1].focus();
        }
        if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        // Handle Enter key
        if (e.key === 'Enter') {
            e.preventDefault(); // Stop default form submit
            // Only submit if the button is ready
            if (verifyBtn.classList.contains('ready')) {
                submitVerification();
            }
        }
    });

    // Input event for auto-tabbing forward
    input.addEventListener('input', () => {
        // Move focus to the next input
        if (input.value.length === 1 && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }
        checkAllInputs(); // Check state on every input
    });
});

// Paste event
otpInputs[0].addEventListener('paste', (e) => {
    const pasteData = (e.clipboardData || window.clipboardData).getData('text');
    e.preventDefault();
    
    if (pasteData && pasteData.length === otpInputs.length) {
        otpInputs.forEach((input, index) => {
            input.value = pasteData[index] || '';
        });
        
        otpInputs[otpInputs.length - 1].focus(); // Focus last input
        checkAllInputs(); // Check state
    }
});

// Click event for the verify button
verifyBtn.addEventListener('click', () => {
    // The 'disabled' attribute check is technically enough,
    // but we double-check the class just in case.
    if (!verifyBtn.disabled) {
        submitVerification();
    }
});

// --- On Page Load ---

window.addEventListener('load', () => {
    // AUTOFOCUS the first input
    otpInputs[0].focus();
    // Run a check in case of browser auto-fill
    checkAllInputs(); 
});
