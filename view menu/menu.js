/* menu.js - Complete Logic for Categories, Search, Sort, Persistent Cart with Quantities */

const defaultMenuData = {
    milkteas: [
        { id: 'm1', name: "Classic Pearl Milk Tea", price: "₱120", desc: "Our signature blend with chewy black pearls and perfectly balanced creaminess.", rating: 4.9, img: "../pic/menu/milktea_classic.png", bestSeller: true, popularity: 95, available: true },
        { id: 'm2', name: "Wintermelon Bliss", price: "₱130", desc: "Refreshing wintermelon flavor topped with our special rock salt cheese foam.", rating: 4.8, img: "../pic/menu/milktea_classic.png", popularity: 82, available: true },
        { id: 'm3', name: "Taro Dream", price: "₱135", desc: "Creamy purple taro with a hint of vanilla and delightful taro chunks.", rating: 4.7, img: "../pic/menu/milktea_classic.png", popularity: 75, available: true },
        { id: 'm4', name: "Matcha Zen", price: "₱145", desc: "Premium grade Japanese matcha whisked to perfection with silky milk.", rating: 4.9, img: "../pic/menu/milktea_classic.png", bestSeller: true, popularity: 88, available: true }
    ],
    coffee: [
        { id: 'c1', name: "Velvet Latte", price: "₱140", desc: "Smooth espresso combined with steamed milk and a light layer of foam.", rating: 4.8, img: "../pic/menu/coffee_latte.png", bestSeller: true, popularity: 92, available: true },
        { id: 'c2', name: "Midnight Espresso", price: "₱110", desc: "Bold and intense double shot espresso for the ultimate caffeine kick.", rating: 4.7, img: "../pic/menu/coffee_latte.png", popularity: 70, available: true },
        { id: 'c3', name: "Caramel Macchiato", price: "₱160", desc: "Fresh espresso with vanilla-flavored syrup, marked with caramel drizzle.", rating: 4.9, img: "../pic/menu/coffee_latte.png", bestSeller: true, popularity: 94, available: true },
        { id: 'c4', name: "Iced Americano", price: "₱120", desc: "Espresso shots topped with cold water and ice for a crisp finish.", rating: 4.6, img: "../pic/menu/coffee_latte.png", popularity: 65, available: true }
    ],
    pizza: [
        { id: 'p1', name: "Pepperoni Passion", price: "₱450", desc: "Loaded with premium pepperoni and extra mozzarella on our hand-tossed crust.", rating: 4.9, img: "../pic/menu/pizza_pepperoni.png", bestSeller: true, popularity: 98, available: true },
        { id: 'p2', name: "Hawaiian Sunset", price: "₱420", desc: "Sweet pineapple chunks and savory ham topped with melted cheese.", rating: 4.7, img: "../pic/menu/pizza_pepperoni.png", popularity: 85, available: true },
        { id: 'p3', name: "Veggie Garden", price: "₱390", desc: "Fresh bell peppers, onions, mushrooms, and olives for a healthy delight.", rating: 4.6, img: "../pic/menu/pizza_pepperoni.png", popularity: 60, available: true },
        { id: 'p4', name: "Truffle Mushroom", price: "₱550", desc: "Earthbound mushrooms with aromatic truffle oil and creamy white sauce.", rating: 4.9, img: "../pic/menu/pizza_pepperoni.png", bestSeller: true, popularity: 89, available: true }
    ],
    burgers: [
        { id: 'b1', name: "Double Smash Burger", price: "₱285", desc: "Two premium beef patties, aged cheddar, secret sauce, and crispy lettuce.", rating: 4.9, img: "../pic/menu/burger_classic.png", bestSeller: true, popularity: 99, available: true },
        { id: 'b2', name: "Truffle King", price: "₱340", desc: "Wild mushrooms, black truffle aioli, swiss cheese and caramelized onions.", rating: 4.7, img: "../pic/menu/burger_truffle.png", popularity: 87, available: true },
        { id: 'b3', name: "Buffalo Firebird", price: "₱245", desc: "Crispy chicken breast tossed in buffalo sauce, blue cheese dressing and pickles.", rating: 4.8, img: "../pic/menu/burger_buffalo.png", bestSeller: true, popularity: 93, available: true },
        { id: 'b4', name: "The Green Mile", price: "₱295", desc: "Beyond Meat patty, avocado mash, vegan mayo, and garden fresh vegetables.", rating: 4.6, img: "../pic/menu/burger_green.png", popularity: 72, available: true },
        { id: 'b5', name: "Original Classic", price: "₱195", desc: "Simple perfection. Single beef patty, American cheese, pickles, mustard and ketchup.", rating: 4.7, img: "../pic/menu/burger_classic.png", popularity: 80, available: true },
        { id: 'b6', name: "Texas Smokehouse", price: "₱320", desc: "Smoked bacon, crispy onion rings, BBQ sauce, and pepper jack cheese.", rating: 4.8, img: "../pic/menu/burger_smokehouse.png", popularity: 84, available: true }
    ],
    ricemeals: [
        { id: 'r1', name: "Sizzling Sisig", price: "₱185", desc: "Our best-selling pork sisig served with egg and steaming garlic rice.", rating: 4.9, img: "../pic/menu/rice_sisig.png", bestSeller: true, popularity: 97, available: true },
        { id: 'r2', name: "Beef Pares", price: "₱195", desc: "Tender beef brisket stewed in sweet soy sauce with clear beef soup.", rating: 4.8, img: "../pic/menu/rice_sisig.png", popularity: 78, available: true },
        { id: 'r3', name: "Crispy Pork Chop", price: "₱175", desc: "Golden fried pork chop served with gravy and seasonal vegetables.", rating: 4.7, img: "../pic/menu/rice_sisig.png", popularity: 74, available: true },
        { id: 'r4', name: "Chicken Adobo", price: "₱165", desc: "Classic Filipino chicken adobo braised in soy sauce, vinegar, and garlic.", rating: 4.6, img: "../pic/menu/rice_sisig.png", popularity: 82, available: true }
    ]
};

const menuData = JSON.parse(localStorage.getItem('gshot-menu')) || defaultMenuData;

const categoryInfo = {
    milkteas: { title: "Milk Tea Collection", desc: "Authentic Taiwanese milk teas brewed fresh daily." },
    coffee: { title: "G'Shot Coffee", desc: "Premium beans roasted to perfection for your daily grind." },
    pizza: { title: "Artisan Pizzas", desc: "Hand-stretched dough with the freshest ingredients." },
    burgers: { title: "Juicy Burgers", desc: "Discover our selection of premium hand-crafted burgers." },
    ricemeals: { title: "Hearty Rice Meals", desc: "Authentic flavors that feel just like home." }
};

// State
let currentCategory = 'burgers';
let currentSearch = '';
let currentSort = 'Most Popular';
let cart = JSON.parse(localStorage.getItem('gshot-cart')) || [];
let currentPage = 1;
const itemsPerPage = 6;

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const categoryList = document.getElementById('category-list');
    const menuGrid = document.getElementById('menu-grid');
    const categoryTitle = document.getElementById('category-title');
    const categoryDesc = document.getElementById('category-desc');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const cartBadge = document.getElementById('cart-badge');
    const paginationContainer = document.querySelector('.pagination');

    // Cart Drawer Elements
    const cartToggle = document.querySelector('.cart-icon');
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalAmount = document.getElementById('cart-total-amount');

    // Helper: Parse Price (₱285 -> 285)
    function parsePrice(priceStr) {
        if (typeof priceStr === 'number') return priceStr;
        return parseInt(priceStr.replace('₱', '').replace(',', ''));
    }

    // Function: Show Toast
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background: #fdd835;
            color: #000;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-weight: 800;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-in forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Function: Update Cart Storage & UI
    function updateCart() {
        localStorage.setItem('gshot-cart', JSON.stringify(cart));

        // Update Badge (total items)
        const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
        cartBadge.textContent = totalItems;
        if (totalItems > 0) {
            cartBadge.classList.add('pop');
            setTimeout(() => cartBadge.classList.remove('pop'), 300);
        }

        // Render Cart Drawer Content
        renderCartDrawer();
    }

    // Function: Render Cart Drawer
    function renderCartDrawer() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your basket is empty</div>';
            cartTotalAmount.textContent = '₱0';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((item, index) => {
            const itemPrice = parsePrice(item.price);
            const subtotal = itemPrice * item.quantity;
            total += subtotal;

            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="item-img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-header">
                        <h4>${item.name}</h4>
                        <button class="remove-item" data-index="${index}">✕</button>
                    </div>
                    <div class="item-meta">
                        <span class="item-price">${item.price}</span>
                        <div class="qty-controls">
                            <button class="qty-btn minus" data-index="${index}">-</button>
                            <span class="qty-val">${item.quantity}</span>
                            <button class="qty-btn plus" data-index="${index}">+</button>
                        </div>
                    </div>
                    <div class="item-subtotal">Subtotal: ₱${subtotal.toLocaleString()}</div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });

        cartTotalAmount.textContent = `₱${total.toLocaleString()}`;

        // Event Listeners for Cart Actions
        cartItemsContainer.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart.splice(index, 1);
                updateCart();
                showToast("Item removed from cart");
            });
        });

        cartItemsContainer.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                cart[index].quantity++;
                updateCart();
            });
        });

        cartItemsContainer.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.dataset.index);
                if (cart[index].quantity > 1) {
                    cart[index].quantity--;
                } else {
                    cart.splice(index, 1);
                    showToast("Item removed from cart");
                }
                updateCart();
            });
        });
    }

    // Function: Render Menu
    function renderMenu() {
        categoryTitle.textContent = categoryInfo[currentCategory].title;
        categoryDesc.textContent = categoryInfo[currentCategory].desc;

        let items = [...menuData[currentCategory]];

        if (currentSearch) {
            items = items.filter(item =>
                item.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
                item.desc.toLowerCase().includes(currentSearch.toLowerCase())
            );
        }

        if (currentSort === 'Price: Low to High') {
            items.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
        } else if (currentSort === 'Price: High to Low') {
            items.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
        } else {
            items.sort((a, b) => b.popularity - a.popularity);
        }

        // Pagination Logic
        const totalItems = items.length;
        const totalPages = Math.ceil(totalItems / itemsPerPage);

        // Reset to page 1 if current page is out of bounds (e.g. after search)
        if (currentPage > totalPages && totalPages > 0) {
            currentPage = 1;
        }

        const startIndex = (currentPage - 1) * itemsPerPage;
        const pagedItems = items.slice(startIndex, startIndex + itemsPerPage);

        menuGrid.innerHTML = '';

        if (pagedItems.length === 0) {
            menuGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 5rem 0; color: rgba(255,255,255,0.3);">
                    <span style="font-size: 4rem; display: block; margin-bottom: 1rem;">🔍</span>
                    <h3>No items found for "${currentSearch}"</h3>
                    <p>Try searching for something else!</p>
                </div>
            `;
            paginationContainer.style.display = 'none';
            return;
        }

        paginationContainer.style.display = 'flex';

        pagedItems.forEach((item, index) => {
            const isAvailable = item.available !== false;
            const card = document.createElement('div');
            card.className = `menu-card ${!isAvailable ? 'not-available' : ''}`;
            card.style.animationDelay = `${index * 0.1}s`;
            card.innerHTML = `
                <div class="card-img">
                    ${item.bestSeller && isAvailable ? '<span class="best-seller-tag">Best Seller</span>' : ''}
                    ${!isAvailable ? '<div class="sold-out-overlay">SOLD OUT</div>' : ''}
                    <div class="rating-tag">⭐ ${item.rating}</div>
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="card-info">
                    <div class="info-top">
                        <h3>${item.name}</h3>
                        <span class="price">${item.price}</span>
                    </div>
                    <p class="desc">${item.desc}</p>
                    <button class="btn-add" data-id="${item.id}" data-category="${currentCategory}" ${!isAvailable ? 'disabled' : ''}>
                        <span class="icon">${isAvailable ? '🛒' : '🚫'}</span> ${isAvailable ? 'ADD TO CART' : 'UNAVAILABLE'}
                    </button>
                </div>
            `;
            menuGrid.appendChild(card);
        });

        renderPagination(totalPages);

        // Add to Cart Listeners
        menuGrid.querySelectorAll('.btn-add').forEach(btn => {
            btn.addEventListener('click', () => {
                const itemId = btn.dataset.id;
                const cat = btn.dataset.category;
                const product = menuData[cat].find(p => p.id === itemId);

                // Check if in cart
                const cartItem = cart.find(item => item.id === itemId);
                if (cartItem) {
                    cartItem.quantity++;
                } else {
                    cart.push({ ...product, quantity: 1 });
                }

                updateCart();
                showToast(`Added ${product.name} to cart!`);
            });
        });
    }

    function renderPagination(totalPages) {
        paginationContainer.innerHTML = '';

        if (totalPages <= 1) {
            paginationContainer.style.display = 'none';
            return;
        }

        const prevBtn = document.createElement('button');
        prevBtn.className = 'prev';
        prevBtn.innerHTML = '‹';
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(prevBtn);

        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement('button');
            pageBtn.textContent = i;
            if (i === currentPage) pageBtn.className = 'active';
            pageBtn.addEventListener('click', () => {
                currentPage = i;
                renderMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
            paginationContainer.appendChild(pageBtn);
        }

        const nextBtn = document.createElement('button');
        nextBtn.className = 'next';
        nextBtn.innerHTML = '›';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                renderMenu();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
        paginationContainer.appendChild(nextBtn);
    }

    // Category Switching
    categoryList.querySelectorAll('li').forEach(li => {
        li.addEventListener('click', () => {
            categoryList.querySelector('.active').classList.remove('active');
            li.classList.add('active');
            currentCategory = li.dataset.category;
            currentPage = 1; // Reset to page 1 on category change
            renderMenu();
        });
    });

    // Search
    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        currentPage = 1; // Reset to page 1 on search
        renderMenu();
    });

    // Sort
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderMenu();
    });

    // Initial Load
    renderMenu();
    updateCart();

    // Drawer Controls
    cartToggle.addEventListener('click', () => {
        cartDrawer.classList.add('active');
        cartOverlay.classList.add('active');
    });

    const closeHandler = () => {
        cartDrawer.classList.remove('active');
        cartOverlay.classList.remove('active');
    };

    closeCartBtn.addEventListener('click', closeHandler);
    cartOverlay.addEventListener('click', closeHandler);
});
