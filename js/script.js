const grid = document.getElementById("grid");
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const countEl = document.getElementById("count");

const API_URL = "https://v2.api.noroff.dev/online-shop";

let products = [];
let cart = [];


async function fetchProducts() {
    try {
    const response = await fetch(API_URL);
    const json = await response.json();

    products = json.data.slice(0, 6);

    renderProducts(products);
    } catch (error) {
    console.error("Failed to fetch products:", error);
    grid.innerHTML = "<p>UNABLE TO ACCESS INVENTORY</p>";
    }
}


function renderProducts(items) {
    grid.innerHTML = items.map(product => `
    <div class="card" onclick="openProduct('${product.id}')">
        <div
        class="poster"
        style="background-image:url('${product.image.url}')">
        </div>

        <div class="card-content">
        <h3>${product.title}</h3>
        <span>${product.tags.join(" / ")}</span>

        <div class="price-cart">
            <div class="price">
            ${product.discountedPrice.toFixed(2)} CR
            </div>
            <button
            class="add"
            onclick="event.stopPropagation(); addToCart('${product.id}')">
            LOAD
            </button>
        </div>
        </div>
    </div>
    `).join("");
}


function openProduct(id) {
    window.location.href = `product.html?id=${id}`;
}


function addToCart(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    cart.push(product);
    countEl.textContent = cart.length;
    renderCart();
}

function renderCart() {
    cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
        <span>${item.title}</span>
        <span>${item.discountedPrice.toFixed(2)} CR</span>
    </div>
    `).join("");
}


cartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
});


const browseBtn = document.getElementById("browseBtn");

browseBtn.addEventListener("click", () => {
  grid.scrollIntoView({ behavior: "smooth" });
});



fetchProducts();
