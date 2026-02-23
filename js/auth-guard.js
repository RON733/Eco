/* auth-guard.js - Protects Admin pages from non-admin users */

(function () {
    let user = null;
    try {
        const storedUser = localStorage.getItem('gshot-user');
        if (storedUser) {
            user = JSON.parse(storedUser);
        }
    } catch (e) {
        console.error("Error parsing user session:", e);
    }

    if (!user || user.role !== 'admin') {
        // Not logged in or not an admin
        console.warn("Access Denied: Admin privileges required.");

        // Hide body content immediately if it exists
        if (document.body) {
            document.body.style.display = 'none';
        }

        // Redirect to login page
        // Using window.location.replace to prevent back-button loop
        window.location.replace('../auth/login.html');
    } else {
        // If they are admin, make sure body is visible (in case it was hidden by CSS)
        document.addEventListener('DOMContentLoaded', () => {
            document.body.style.visibility = 'visible';
            document.body.style.opacity = '1';
        });
    }
})();
