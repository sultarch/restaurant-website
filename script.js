// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle reservation form submission
function handleReservation(event) {
    event.preventDefault();
    
    const form = event.target;
    const messageDiv = document.getElementById('reservation-message');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        guests: document.getElementById('guests').value,
        occasion: document.getElementById('occasion').value,
        requests: document.getElementById('requests').value
    };
    
    // Validate date is in the future
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showMessage('Please select a future date for your reservation.', 'error');
        return;
    }
    
    // Simulate form submission (in real app, this would send to a server)
    console.log('Reservation Details:', formData);
    
    // Show success message
    showMessage(`Thank you, ${formData.name}! Your reservation for ${formData.guests} guests on ${formData.date} at ${formData.time} has been received. We'll confirm via email at ${formData.email}`, 'success');
    
    // Reset form
    form.reset();
    
    // Scroll to message
    messageDiv.scrollIntoView({ behavior: 'smooth' });
}

// Show message function
function showMessage(message, type) {
    const messageDiv = document.getElementById('reservation-message');
    messageDiv.textContent = message;
    messageDiv.className = `reservation-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        messageDiv.className = 'reservation-message';
    }, 5000);
}

// Add scroll animation for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('.feature, .menu-category, .gallery-item, .contact-item').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
});

// Mobile menu toggle (if needed)
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 10px rgba(0,0,0,0.2)';
    } else {
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});