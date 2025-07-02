// public/js/dashboard.js
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logoutButton'); // Ensure you have a <button id="logoutButton"> on dashboard.html
    const welcomeMessage = document.getElementById('welcomeMessage'); // E.g., <h2 id="welcomeMessage"></h2>
    const complaintsList = document.getElementById('complaintsList'); // E.g., <div id="complaintsList"></div>

    // --- Authentication Check ---
    if (!token) {
        alert('You are not logged in. Please log in to access the dashboard.');
        window.location.href = 'login.html'; // Redirect to login page
        return; // Stop execution if not logged in
    }

    // --- Fetch User-Specific Data (Example: Complaints) ---
    async function fetchComplaints() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/complaints`, { // Authenticated API call
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}` // Attach the JWT token
                },
            });

            if (response.ok) {
                const complaints = await response.json();
                console.log('Fetched complaints:', complaints);
                if (complaintsList) {
                    complaintsList.innerHTML = ''; // Clear previous content
                    if (complaints.length > 0) {
                        complaints.forEach(complaint => {
                            const complaintDiv = document.createElement('div');
                            complaintDiv.className = 'complaint-item';
                            complaintDiv.innerHTML = `
                                <h3>${complaint.title || 'No Title'}</h3>
                                <p>${complaint.description || complaint.message}</p>
                                <small>Submitted: ${new Date(complaint.created_at).toLocaleString()}</small>
                                <hr>
                            `;
                            complaintsList.appendChild(complaintDiv);
                        });
                    } else {
                        complaintsList.innerHTML = '<p>No complaints submitted yet.</p>';
                    }
                }
            } else {
                // If token is invalid or expired, backend might return 401
                if (response.status === 401) {
                    alert('Session expired or invalid token. Please log in again.');
                    localStorage.removeItem('token'); // Clear invalid token
                    window.location.href = 'login.html';
                } else {
                    const errorData = await response.json();
                    alert(`Failed to fetch complaints: ${errorData.message || 'Unknown error'}`);
                    console.error('Fetch complaints error:', errorData);
                }
            }
        } catch (error) {
            console.error('Network or fetch error during complaints fetch:', error);
            alert('Could not connect to the server to fetch complaints.');
        }
    }

    // Call fetchComplaints when dashboard loads
    fetchComplaints();

    // --- Logout Functionality ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('token'); // Remove token
            // You might remove other user-specific data from localStorage/sessionStorage
            alert('You have been logged out.');
            window.location.href = 'index.html'; // Redirect to a public page
        });
    }

    // Optional: Display user's name if you stored it during login
    // const userName = localStorage.getItem('userName');
    // if (welcomeMessage && userName) {
    //     welcomeMessage.textContent = `Welcome, ${userName}!`;
    // }
});