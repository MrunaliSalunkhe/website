function saveCartToLocalStorage() {
    localStorage.setItem('checkoutBag', JSON.stringify(cart));
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your shopping cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItemElement = document.createElement('div');
        cartItemElement.className = 'cart-item';
        cartItemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="cart-item-details">
                <h3>${item.title}</h3>
                <p>Price: $<span class="item-price">${item.price}</span></p>
                <div class="size-select">
                    <label for="size-${item.title}">Size:</label>
                    <select id="size-${item.title}">
                        <option value="S">S</option>
                        <option value="M">M</option>
                        <option value="L">L</option>
                        <option value="XL">XL</option>
                    </select>
                </div>
            </div>
            <div class="cart-item-controls">
                <button onclick="decreaseQuantity('${item.title}')">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity('${item.title}')">+</button>
            </div>
            <button class="delete-btn" onclick="promptDeleteItem('${item.title}')">&times;</button>
        `;
        cartItemsContainer.appendChild(cartItemElement);
    });

    saveCartToLocalStorage(); // Ensure local storage is updated
}

function increaseQuantity(title) {
    const item = cart.find(item => item.title === title);
    if (item) {
        item.quantity++;
        displayCartItems();
        updateTotalAmount();
        updateCartCount();
    }
}

function decreaseQuantity(title) {
    const item = cart.find(item => item.title === title);
    if (item) {
        if (item.quantity > 1) {
            item.quantity--;
        } else {
            promptDeleteItem(title);
        }
        displayCartItems();
        updateTotalAmount();
        updateCartCount();
    }
}

function promptDeleteItem(title) {
    itemToDelete = title;
    document.getElementById('confirmationDialog').classList.remove('hidden');
}

function confirmDelete() {
    cart = cart.filter(item => item.title !== itemToDelete);
    itemToDelete = null;
    document.getElementById('confirmationDialog').classList.add('hidden');
    displayCartItems();
    updateTotalAmount();
    updateCartCount();
}

function cancelDelete() {
    itemToDelete = null;
    document.getElementById('confirmationDialog').classList.add('hidden');
}

function updateTotalAmount() {
    const totalAmount = cart.reduce((total, item) => total + item.quantity * parseFloat(item.price), 0).toFixed(2);
    document.getElementById('totalAmount').textContent = totalAmount;
}

function proceedToCheckout() {
    alert('Proceed to checkout functionality not implemented.');
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = cartCount;
}

// Ensure to call this function on page load to sync the cart data
document.addEventListener('DOMContentLoaded', () => {
    const storedCart = JSON.parse(localStorage.getItem('checkoutBag'));
    if (storedCart) {
        cart = storedCart;
    }
    displayCartItems();
    updateTotalAmount();
    updateCartCount();
});
