/* inventory.js - Admin Logic for Managing Food Items with File Upload */

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
        { id: 'p3', name: "Veggie Garden", price: "₱390", desc: "Fresh bell peppers, onions, mushrooms, and olives for a healthy delight.", rating: 4.6, img: "pic/menu/pizza_pepperoni.png", popularity: 60, available: true },
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
        { id: 'r3', name: "Crispy Pork Chop", price: "₱175", desc: "Golden fried pork chop served with height and seasonal vegetables.", rating: 4.7, img: "../pic/menu/rice_sisig.png", popularity: 74, available: true },
        { id: 'r4', name: "Chicken Adobo", price: "₱165", desc: "Classic Filipino chicken adobo braised in soy sauce, vinegar, and garlic.", rating: 4.6, img: "../pic/menu/rice_sisig.png", popularity: 82, available: true }
    ]
};

const categoryInfo = {
    milkteas: { title: "Milk Teas", icon: "🥤" },
    coffee: { title: "Coffee", icon: "☕" },
    pizza: { title: "Pizza", icon: "🍕" },
    burgers: { title: "Burgers", icon: "🍔" },
    ricemeals: { title: "Rice Meals", icon: "🍚" }
};

let menuData = JSON.parse(localStorage.getItem('gshot-menu')) || defaultMenuData;

document.addEventListener('DOMContentLoaded', () => {
    const inventoryContainer = document.getElementById('inventory-container');
    const openModalBtn = document.getElementById('open-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const modal = document.getElementById('add-modal');
    const addItemForm = document.getElementById('add-item-form');

    // Image Upload Elements
    const fileInput = document.getElementById('food-img-file');
    const imagePreview = document.getElementById('image-preview');
    let currentImageBase64 = "";

    function saveMenu() {
        localStorage.setItem('gshot-menu', JSON.stringify(menuData));
        renderInventory();
    }

    function renderInventory() {
        inventoryContainer.innerHTML = '';

        Object.keys(menuData).forEach(category => {
            if (menuData[category].length === 0) return;

            // Create Section
            const section = document.createElement('div');
            section.className = 'category-section';

            const header = document.createElement('div');
            header.className = 'category-header';
            const catMeta = categoryInfo[category] || { title: category, icon: '🍽️' };
            header.innerHTML = `<h3><span class="icon">${catMeta.icon}</span> ${catMeta.title}</h3>`;
            section.appendChild(header);

            const grid = document.createElement('div');
            grid.className = 'inventory-grid';

            menuData[category].forEach((item, index) => {
                const card = document.createElement('div');
                card.className = 'inventory-card';
                const imgSrc = item.img.startsWith('data:') ? item.img :
                    (item.img.startsWith('pic') ? '../' + item.img : item.img);

                card.innerHTML = `
                    <div class="inv-img">
                        <img src="${imgSrc}" alt="${item.name}">
                    </div>
                    <div class="inv-details">
                        <span class="inv-category">${category}</span>
                        <h4>${item.name}</h4>
                        <p style="font-size: 0.8rem; opacity: 0.5;">${item.price}</p>
                        <div class="inv-actions">
                            <span style="font-size: 0.8rem;">Stock: <b>${item.available !== false ? 'On' : 'Off'}</b></span>
                            <label class="switch">
                                <input type="checkbox" ${item.available !== false ? 'checked' : ''} data-cat="${category}" data-id="${item.id}">
                                <span class="slider"></span>
                            </label>
                            <button class="remove-item-btn" data-cat="${category}" data-id="${item.id}" style="background:none; border:none; color:#e53935; cursor:pointer; font-size: 0.7rem; margin-left:10px;">DELETE</button>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });

            section.appendChild(grid);
            inventoryContainer.appendChild(section);
        });

        // Toggle Listeners
        inventoryContainer.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const cat = e.target.dataset.cat;
                const id = e.target.dataset.id;
                const item = menuData[cat].find(i => i.id === id);
                item.available = e.target.checked;
                saveMenu();
            });
        });

        // Delete Listeners
        inventoryContainer.querySelectorAll('.remove-item-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cat = e.target.dataset.cat;
                const id = e.target.dataset.id;
                if (confirm('Are you sure you want to delete this item?')) {
                    menuData[cat] = menuData[cat].filter(i => i.id !== id);
                    saveMenu();
                }
            });
        });
    }

    // Image Upload Handling
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                currentImageBase64 = event.target.result;
                imagePreview.innerHTML = `<img src="${currentImageBase64}" style="width:100%; height:100%; object-fit:cover;">`;
            };
            reader.readAsDataURL(file);
        }
    });

    // Modal Controls
    openModalBtn.addEventListener('click', () => {
        modal.classList.add('active');
        currentImageBase64 = "";
        imagePreview.innerHTML = "📸";
    });

    closeModalBtn.addEventListener('click', () => modal.classList.remove('active'));

    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('food-category').value;
        const newItem = {
            id: Date.now().toString(),
            name: document.getElementById('food-name').value,
            price: document.getElementById('food-price').value.includes('₱') ?
                document.getElementById('food-price').value :
                '₱' + document.getElementById('food-price').value,
            desc: document.getElementById('food-desc').value,
            img: currentImageBase64 || "../pic/menu/burger_classic.png", // Use fallback if no image selected
            rating: 5.0,
            popularity: 50,
            available: true
        };

        if (!menuData[category]) menuData[category] = [];
        menuData[category].push(newItem);
        saveMenu();
        modal.classList.remove('active');
        addItemForm.reset();
        imagePreview.innerHTML = "📸";
    });

    renderInventory();
});
