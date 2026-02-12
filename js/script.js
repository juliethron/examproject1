const grid = document.getElementById("grid");
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const countEl = document.getElementById("count");

const API_URL = "https://v2.api.noroff.dev/online-shop";

const PRICE_MULTIPLIER = 0.08;

let products = [];
let cart = [];

const customImages = [
  "bilds/thething.jpg",
  "bilds/hereditary.jpg",
  "bilds/longlegs.jpg",
  "bilds/suspiria.jpg",
  "bilds/weapons.jpg",
  "bilds/halloween.jpg"
];

const customTitles = [
  "THE THING",
  "HEREDITARY",
  "LONGLEGS",
  "SUSPIRIA",
  "WEAPONS",
  "HALLOWEEN"
];


async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    products = json.data.slice(0, 6).map((product, index) => ({
      ...product,
      customImage: customImages[index],
      customTitle: customTitles[index],


      adjustedPrice: Math.max(
        9.99,
        product.discountedPrice * PRICE_MULTIPLIER
      )
    }));

    renderProducts(products);

  } catch (error) {
    console.error("Failed to fetch products:", error);

    if (grid) {
      grid.innerHTML = "<p>UNABLE TO ACCESS INVENTORY</p>";
    }
  }
}


function renderProducts(items) {
  if (!grid) return;

  grid.innerHTML = items.map(product => `
    <div class="card" onclick="openProduct('${product.id}')">
      <div
        class="poster"
        style="background-image:url('${product.customImage}')">
      </div>

      <div class="card-content">
        <h3>${product.customTitle}</h3>

        <div class="price-cart">
          <div class="price">
            £${product.adjustedPrice.toFixed(2)}
          </div>

          <button
            class="add"
            onclick="event.stopPropagation(); addToCart('${product.id}')">
            ADD TO CART
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

  if (countEl) {
    countEl.textContent = cart.length;
  }

  renderCart();
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.customTitle}</span>
      <span>£${item.adjustedPrice.toFixed(2)}</span>
    </div>
  `).join("");
}


if (cartBtn && cartPanel) {
  cartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });
}


fetchProducts();
