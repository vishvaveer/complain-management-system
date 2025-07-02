// public/js/login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm'); // Ensure your <form> in login.html has id="loginForm"

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value;     // <input id="loginEmail">
            const password = document.getElementById('loginPassword').value; // <input id="loginPassword">

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, { // POST request to your backend login API
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const data = await response.json();
                    alert('Login successful!');
                    console.log('Login success:', data);
                    // IMPORTANT: Store the JWT token securely
                    localStorage.setItem('token', data.token); // Store token in browser's local storage
                    // You might also store user ID or name: localStorage.setItem('userId', data.user.id);

                    window.location.href = 'dashboard.html'; // Redirect to dashboard page
                } else {
                    const errorData = await response.json();
                    alert(`Login failed: ${errorData.message || 'Invalid credentials'}`);
                    console.error('Login error:', errorData);
                }
            } catch (error) {
                console.error('Network or fetch error during login:', error);
                alert('Could not connect to the server for login. Please try again.');
            }
        });
    }
});