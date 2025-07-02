// public/js/signup.js
document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm'); // Ensure your <form> in signup.html has id="signupForm"

    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            const name = document.getElementById('signupName').value;     // <input id="signupName">
            const email = document.getElementById('signupEmail').value;   // <input id="signupEmail">
            const password = document.getElementById('signupPassword').value; // <input id="signupPassword">

            try {
                const response = await fetch(`${API_BASE_URL}/auth/signup`, { // POST request to your backend signup API
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Tell backend we're sending JSON
                    },
                    body: JSON.stringify({ name, email, password }), // Send form data as JSON
                });

                if (response.ok) { // Check if HTTP status is 2xx (success)
                    const data = await response.json(); // Parse JSON response from backend
                    alert('Sign Up successful! Please log in.');
                    console.log('Signup success:', data);
                    window.location.href = 'login.html'; // Redirect to login page
                } else {
                    const errorData = await response.json(); // Parse error response
                    alert(`Sign Up failed: ${errorData.message || 'Unknown error'}`);
                    console.error('Signup error:', errorData);
                }
            } catch (error) {
                console.error('Network or fetch error during signup:', error);
                alert('Could not connect to the server for sign up. Please try again.');
            }
        });
    }
});