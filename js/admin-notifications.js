/**
 * admin-notifications.js
 * Handles real-time notifications for Orders and Bookings via Supabase
 */

document.addEventListener('DOMContentLoaded', () => {
    const ordersList = document.querySelector('.notif-item:nth-child(1) .dropdown-list');
    const bookingsList = document.querySelector('.notif-item:nth-child(2) .dropdown-list');
    const ordersBadge = document.querySelector('.notif-item:nth-child(1) .dot');
    const bookingsBadge = document.querySelector('.notif-item:nth-child(2) .dot');

    if (!window.supabase) {
        console.error("Supabase not initialized. Make sure supabase-config.js is loaded.");
        return;
    }

    // 1. Initial Load of Notifications
    fetchInitialNotifications();

    // 2. Real-time Subscription
    const ordersChannel = window.supabase
        .channel('realtime-orders')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
            console.log('New Order received!', payload.new);
            addOrderNotification(payload.new);
            playNotificationSound();
        })
        .subscribe();

    const bookingsChannel = window.supabase
        .channel('realtime-bookings')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'bookings' }, payload => {
            console.log('New Booking received!', payload.new);
            addBookingNotification(payload.new);
            playNotificationSound();
        })
        .subscribe();

    async function fetchInitialNotifications() {
        try {
            // Fetch last 5 orders
            const { data: latestOrders, error: ordersError } = await window.supabase
                .from('orders')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (ordersError) throw ordersError;

            if (latestOrders && latestOrders.length > 0) {
                ordersList.innerHTML = '';
                latestOrders.forEach(order => addOrderNotification(order, false));
            }

            // Fetch last 5 bookings
            const { data: latestBookings, error: bookingsError } = await window.supabase
                .from('bookings')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (bookingsError) throw bookingsError;

            if (latestBookings && latestBookings.length > 0) {
                bookingsList.innerHTML = '';
                latestBookings.forEach(booking => addBookingNotification(booking, false));
            }
        } catch (err) {
            console.error("Notification load error:", err);
            if (ordersList) ordersList.innerHTML = '<div class="notif-entry" style="font-size:0.8rem; color:red; padding:10px;">Failed to load orders</div>';
            if (bookingsList) bookingsList.innerHTML = '<div class="notif-entry" style="font-size:0.8rem; color:red; padding:10px;">Failed to load bookings</div>';
        }
    }

    function addOrderNotification(order, isNew = true) {
        const entry = document.createElement('div');
        entry.className = 'notif-entry';
        entry.innerHTML = `
            <div class="entry-icon">🍔</div>
            <div class="entry-text">
                <p>New Order from ${order.customer_name || 'Guest'}</p>
                <span>${formatTime(order.created_at)}</span>
            </div>
        `;
        ordersList.prepend(entry);
        if (isNew) {
            ordersBadge.style.display = 'block';
            showToast(`New Order: ${order.customer_name}`);
        }
    }

    function addBookingNotification(booking, isNew = true) {
        const entry = document.createElement('div');
        entry.className = 'notif-entry';
        entry.innerHTML = `
            <div class="entry-icon">✨</div>
            <div class="entry-text">
                <p>${booking.service_type || 'Event'} Booking Request</p>
                <span>${formatTime(booking.created_at)}</span>
            </div>
        `;
        bookingsList.prepend(entry);
        if (isNew) {
            bookingsBadge.style.display = 'block';
            showToast(`New Booking Request!`);
        }
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    function playNotificationSound() {
        const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
        audio.play().catch(e => console.log("Audio play blocked"));
    }

    function showToast(message) {
        // Simple toast notification if you want to add one to the UI
        console.log("TOAST:", message);
    }
});
