const apiUrl = 'https://cdn.shopify.com/s/files/1/0564/3685/0790/files/multiProduct.json';
let products = [];
let bag = [];
let itemToDelete = null;

document.addEventListener('DOMContentLoaded', () => {
  fetchProducts();
  updateCartCount();
});

function fetchProducts() {
  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      products = data.categories.flatMap(category => category.category_products);
      displayProducts(products);
    })
    .catch(error => console.error('Error fetching data:', error));
}

function displayProducts(products) {
  const container = document.getElementById('productsContainer');
  const noResults = document.getElementById('noResults');
  container.innerHTML = '';

  if (products.length === 0) {
    noResults.style.display = 'block';
  } else {
    noResults.style.display = 'none';
    products.forEach(product => {
      const productElement = document.createElement('div');
      productElement.className = 'product';
      productElement.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p class="vendor-text">Vendor: ${product.vendor}</p>
        <p class="product-price">Price: ${product.price} <span class="product-compare-at-price">(Compare at: ${product.compare_at_price})</span></p>
        <p class="discount-text">${product.badge_text || ''}</p>
        <button class="add-to-bag-btn" onclick="addToBag('${product.title}', '${product.price}', '${product.image}')"><i class="fas fa-shopping-bag"></i> Add to Bag</button>
      `;
      container.appendChild(productElement);
    });
  }
}

function addToBag(title, price, image) {
  const existingItem = bag.find(item => item.title === title);
  if (existingItem) {
    existingItem.quantity++;
  } else {
    bag.push({ title, price, image, quantity: 1 });
  }
  showAlert('Product added to bag');
  updateBag();
  updateCartCount();
}

function showAlert(message) {
  const alertBox = document.createElement('div');
  alertBox.className = 'alert-box';
  alertBox.textContent = message;
  document.body.appendChild(alertBox);
  setTimeout(() => {
    alertBox.remove();
  }, 2000);
}

function updateBag() {
  const bagContents = document.getElementById('bagContents');
  const emptyBagMessage = document.getElementById('emptyBagMessage');
  const bagSummary = document.getElementById('bagSummary');
  bagContents.innerHTML = '';

  if (bag.length === 0) {
    emptyBagMessage.style.display = 'block';
    bagSummary.innerHTML = '';
  } else {
    emptyBagMessage.style.display = 'none';
    bag.forEach(item => {
      const bagItemElement = document.createElement('div');
      bagItemElement.className = 'bag-item';
      bagItemElement.innerHTML = `
        <img src="${item.image}" alt="${item.title}">
        <div class="bag-item-details">
          <h3>${item.title}</h3>
          <p>Price: ${item.price}</p>
        </div>
        <div class="bag-item-controls">
          <button onclick="decreaseQuantity('${item.title}')">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity('${item.title}')">+</button>
        </div>
      `;
      bagContents.appendChild(bagItemElement);
    });
    bagSummary.innerHTML = `Total items: ${getTotalQuantity()} | Total price: ${getTotalPrice()}`;
  }
}

function increaseQuantity(title) {
  const item = bag.find(item => item.title === title);
  if (item) {
    item.quantity++;
    updateBag();
    updateCartCount();
  }
}

function decreaseQuantity(title) {
  const item = bag.find(item => item.title === title);
  if (item) {
    if (item.quantity > 1) {
      item.quantity--;
      updateBag();
      updateCartCount();
    } else {
      itemToDelete = item;
      showConfirmationDialog();
    }
  }
}

function showConfirmationDialog() {
  const dialog = document.getElementById('confirmationDialog');
  dialog.classList.remove('hidden');
}

function confirmDelete() {
  if (itemToDelete) {
    bag = bag.filter(item => item !== itemToDelete);
    itemToDelete = null;
    updateBag();
    updateCartCount();
  }
  hideConfirmationDialog();
}

function cancelDelete() {
  itemToDelete = null;
  hideConfirmationDialog();
}

function hideConfirmationDialog() {
  const dialog = document.getElementById('confirmationDialog');
  dialog.classList.add('hidden');
}

function getTotalQuantity() {
  return bag.reduce((total, item) => total + item.quantity, 0);
}

function getTotalPrice() {
  return bag.reduce((total, item) => total + item.quantity * parseFloat(item.price.replace('$', '')), 0).toFixed(2);
}

function updateCartCount() {
  const cartCountElement = document.getElementById('cartCount');
  if (cartCountElement) {
    cartCountElement.textContent = getTotalQuantity();
  }
}

function toggleShoppingBag() {
  localStorage.setItem('shoppingBag', JSON.stringify(bag));
  window.location.href = 'shoppingBag.html';
}

function checkout() {
  localStorage.setItem('checkoutBag', JSON.stringify(bag));
  window.location.href = 'checkout.html';
}

function filterProducts(category) {
  const filteredProducts = products.filter(product => product.category.includes(category));
  displayProducts(filteredProducts);
}

// Ensure the cart count is updated on page load
document.addEventListener('DOMContentLoaded', updateCartCount);
