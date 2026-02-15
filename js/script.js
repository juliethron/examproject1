const grid = document.getElementById("grid");
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const countEl = document.getElementById("count");
const carouselTrack = document.getElementById("carouselTrack");

const API_URL = "https://v2.api.noroff.dev/online-shop";

let products = [];

let cart = JSON.parse(localStorage.getItem("cart")) || [];


function isLoggedIn() {
  return localStorage.getItem("loggedIn") === "true";
}

function login() {
  localStorage.setItem("loggedIn", "true");
  updateUIForAuth();
}

function logout() {
  localStorage.setItem("loggedIn", "false");
  updateUIForAuth();
}


const customImages = [
  "bilds/thething.jpg",
  "bilds/hereditary.jpg",
  "bilds/longlegs.jpg",
  "bilds/suspiria.jpg",
  "bilds/weapons.jpg",
  "bilds/halloween.jpg",
  "bilds/theshining.jpg",
  "bilds/malignant.jpg",
  "bilds/censor.jpg",
  "bilds/saw.jpg",
  "bilds/thedescent.jpg",
  "bilds/audition.jpg"
];

const customTitles = [
  "THE THING",
  "HEREDITARY",
  "LONGLEGS",
  "SUSPIRIA",
  "WEAPONS",
  "HALLOWEEN",
  "THE SHINING",
  "MALIGNANT",
  "CENSOR",
  "SAW",
  "THE DESCENT",
  "AUDITION"
];


function generateRetailPrice() {
  return (Math.random() * (24.99 - 9.99) + 9.99);
}


async function fetchProducts() {
  try {
    const response = await fetch(API_URL);
    const json = await response.json();

    products = json.data.slice(0, 12).map((product, index) => {

      const basePrice = generateRetailPrice();

      return {
        ...product,

        customImage: customImages[index % customImages.length],
        customTitle: customTitles[index % customTitles.length],

        adjustedPrice: basePrice,
        originalPrice: basePrice + 8
      };
    });

    renderCarousel(products);
    renderProducts(products);

  } catch (error) {
    console.error("Failed to fetch products:", error);

    if (grid) {
      grid.innerHTML = "<p>UNABLE TO ACCESS INVENTORY</p>";
    }
  }
}


function renderCarousel(items) {
  if (!carouselTrack) return;

  const featured = items.slice(0, 3);

  carouselTrack.innerHTML = featured.map((product, index) => `
    <div class="carousel-slide ${index === 0 ? "active" : ""}"
      style="background-image:url('${product.customImage}')"
      onclick="openProduct('${product.id}')">

      <div class="carousel-overlay">
        <h2>${product.customTitle}</h2>
      </div>
    </div>
  `).join("");

  startCarousel();
}

function startCarousel() {
  const slides = document.querySelectorAll(".carousel-slide");

  if (!slides.length) return;

  let current = 0;

  setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }, 3500);
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
            <span class="old">
              £${product.originalPrice.toFixed(2)}
            </span>

            <span class="new">
              £${product.adjustedPrice.toFixed(2)}
            </span>
          </div>

          <button
            class="add"
            onclick="handleAddToCart(event, '${product.id}')">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  `).join("");

  updateUIForAuth();
}


function updateUIForAuth() {
  const buttons = document.querySelectorAll(".add");

  buttons.forEach(button => {
    if (!isLoggedIn()) {
      button.textContent = "LOGIN TO PURCHASE";
      button.style.opacity = "0.6";
    } else {
      button.textContent = "ADD TO CART";
      button.style.opacity = "1";
    }
  });
}

function handleAddToCart(e, id) {
  e.stopPropagation();

  if (!isLoggedIn()) {
    alert("ACCESS DENIED — LOGIN REQUIRED");
    return;
  }

  addToCart(id);
}


function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}


function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      customTitle: product.customTitle,
      finalPrice: product.adjustedPrice,
      quantity: 1
    });
  }

  persistCart();     
  updateCartCount();
  renderCart();
}

function changeQuantity(id, delta) {
  const item = cart.find(p => p.id === id);
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== id);
  }

  persistCart();     
  updateCartCount();
  renderCart();
}


function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}


function updateCartCount() {
  if (!countEl) return;

  const totalItems = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  countEl.textContent = totalItems;
}


function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div>
        <strong>${item.customTitle}</strong>

        <div class="qty-controls">
          <button onclick="changeQuantity('${item.id}', -1)">–</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity('${item.id}', 1)">+</button>
        </div>
      </div>

      <span>
        £${(item.finalPrice * item.quantity).toFixed(2)}
      </span>
    </div>
  `).join("");

  updateCartTotal();   
}


function updateCartTotal() {
  const totalEl = document.getElementById("cartTotal");
  if (!totalEl) return;

  const total = cart.reduce(
    (sum, item) => sum + item.finalPrice * item.quantity,
    0
  );

  totalEl.textContent = `TOTAL — £${total.toFixed(2)}`;
}


function goToCheckout() {
  if (!cart.length) {
    alert("CART EMPTY");
    return;
  }

  window.location.href = "checkout.html";
}


if (cartBtn && cartPanel) {
  cartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });
}


fetchProducts();
updateCartCount();
renderCart();
updateUIForAuth();
