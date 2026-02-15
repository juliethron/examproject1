const grid = document.getElementById("grid");
const cartBtn = document.getElementById("cartBtn");
const cartPanel = document.getElementById("cartPanel");
const cartItems = document.getElementById("cartItems");
const countEl = document.getElementById("count");
const carouselTrack = document.getElementById("carouselTrack");

const API_URL = "https://v2.api.noroff.dev/online-shop";

const FORMAT_PRICING = {
  dvd: 0,
  bluray: 3,
  fourk: 6
};

let products = [];
let cart = [];

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

    products = json.data.slice(0, 12).map((product, index) => ({
      ...product,

      customImage: customImages[index % customImages.length],
      customTitle: customTitles[index % customTitles.length],

      adjustedPrice: generateRetailPrice(),
      format: "dvd"   
    }));

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


function selectFormat(e, id, format) {
  e.stopPropagation();

  const product = products.find(p => p.id === id);
  if (!product) return;

  product.format = format;

  renderProducts(products);  
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

        <div class="formats">
          <button onclick="selectFormat(event, '${product.id}', 'dvd')">DVD</button>
          <button onclick="selectFormat(event, '${product.id}', 'bluray')">Blu-ray</button>
          <button onclick="selectFormat(event, '${product.id}', 'fourk')">4K</button>
        </div>

        <div class="price-cart">
          <div class="price">
            £${(product.adjustedPrice + FORMAT_PRICING[product.format]).toFixed(2)}
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
}


function handleAddToCart(e, id) {
  e.stopPropagation();
  addToCart(id);
}


function openProduct(id) {
  window.location.href = `product.html?id=${id}`;
}


function addToCart(id) {
  const product = products.find(p => p.id === id);
  if (!product) return;

  const finalPrice = product.adjustedPrice + FORMAT_PRICING[product.format];

  cart.push({
    ...product,
    finalPrice
  });

  if (countEl) {
    countEl.textContent = cart.length;
  }

  renderCart();
}

function renderCart() {
  if (!cartItems) return;

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <span>${item.customTitle} (${item.format.toUpperCase()})</span>
      <span>£${item.finalPrice.toFixed(2)}</span>
    </div>
  `).join("");
}


if (cartBtn && cartPanel) {
  cartBtn.addEventListener("click", () => {
    cartPanel.classList.toggle("open");
  });
}


fetchProducts();
