// Simple scroll effect for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.style.padding = '1rem 4rem';
        header.style.background = 'rgba(10, 10, 10, 0.9)';
    } else {
        header.style.padding = '1.5rem 4rem';
        header.style.background = 'linear-gradient(to bottom, rgba(0,0,0,0.8), transparent)';
    }
});
