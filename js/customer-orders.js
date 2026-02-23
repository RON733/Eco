/**
 * customer-orders.js
 * Handles checkout redirection and booking requests
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Checkout Redirection ---
    const checkoutBtn = document.querySelector('.btn-checkout');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            const user = JSON.parse(localStorage.getItem('gshot-user'));
            const cart = JSON.parse(localStorage.getItem('gshot-cart')) || [];

            if (cart.length === 0) {
                alert("Your cart is empty!");
                return;
            }

            // Check for login
            if (!user) {
                alert("Please login to proceed to checkout!");
                window.location.href = '../auth/login.html';
                return;
            }

            // Redirect to the new checkout page
            window.location.href = '../checkout/index.html';
        });
    }

    // --- Booking Submission Logic ---
    const bookingForm = document.querySelector('.booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            submitBtn.disabled = true;
            submitBtn.textContent = 'SENDING REQUEST...';

            const bookingData = {
                customer_name: document.getElementById('name').value,
                customer_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                event_date: document.getElementById('date').value,
                guests: parseInt(document.getElementById('guests').value),
                service_type: document.getElementById('service').value,
                status: 'pending'
            };

            try {
                const { error } = await window.supabase
                    .from('bookings')
                    .insert([bookingData]);

                if (error) throw error;

                alert("Booking request sent! Our team will contact you soon. ✨");
                bookingForm.reset();

            } catch (error) {
                console.error("Booking Error:", error);
                alert("Error sending request: " + error.message);
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Request Booking';
            }
        });
    }
});
