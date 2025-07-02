// This part waits for the "Warranty Check Room" paper to be ready
document.addEventListener('DOMContentLoaded', function() {

    // This part tells the robot to go fetch the "secret company list book"
    fetch('file:///D:/Project/complain-management-system/backend/data/company_warranty_data.json')
        .then(response => response.json()) // Once it gets the book, it opens it
        .then(data => { // Now the robot has all the information from the book

            // These are the different shelves in our room
            const categories = ['monitors', 'mice', 'printers', 'keyboards'];

            // The robot will go through each shelf, one by one
            categories.forEach(category => {
                // It finds the right spot on the paper for each shelf
                const container = document.getElementById(`${category}-list`);
                if (container) { // If it finds the spot

                    // It writes a big title for the shelf (like "Monitors")
                    const heading = document.createElement('h2');
                    heading.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                    container.appendChild(heading);

                    // Now, for each company in that shelf's list (like Dell, HP for Monitors)
                    data[category].forEach(company => {
                        // The robot makes a special clickable word for each company
                        const link = document.createElement('a');
                        link.href = company.link; // This tells the computer where to go when clicked
                        link.textContent = company.name; // This is the company's name you see
                        link.target = "_blank"; // This makes it open in a new window/tab (so you don't lose your place!)
                        link.classList.add('company-link'); // This is like giving it a special sticker for later decoration

                        // The robot puts the clickable company name on the paper
                        container.appendChild(link);
                        container.appendChild(document.createElement('br')); // And then moves to the next line
                    });
                }
            });
        })
        .catch(error => console.error('Oh no! The robot couldn\'t find or read the secret book:', error));
});