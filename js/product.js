const container = document.getElementById("product");
const API_URL = "https://v2.api.noroff.dev/online-shop";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
  return Math.random() * (24.99 - 9.99) + 9.99;
}

/* ⭐ NEW — Fake Movie Metadata */
function generateMovieMeta() {
  const genres = [
    "Psychological Horror",
    "Supernatural Horror",
    "Sci-Fi Horror",
    "Slasher",
    "Cult Classic"
  ];

  const ratings = ["PG-13", "15", "18", "R"];

  return {
    genre: genres[Math.floor(Math.random() * genres.length)],
    runtime: Math.floor(Math.random() * 60) + 80, 
    year: Math.floor(Math.random() * 30) + 1995,
    rating: ratings[Math.floor(Math.random() * ratings.length)],
    stock: Math.floor(Math.random() * 8) + 1
  };
}

async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const json = await res.json();
    return json.data;

  } catch (error) {
    console.error("Failed to load product", error);
    return null;
  }
}

function persistCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(product) {
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    cart.push({
      id: product.id,
      title: product.customTitle,
      price: product.adjustedPrice,
      quantity: 1
    });
  }

  persistCart();
  alert("ITEM LOADED INTO CART");
}

function renderProduct(product) {
  if (!container || !product) {
    container.innerHTML = "<p>PRODUCT FILE CORRUPTED</p>";
    return;
  }

  const index = Math.floor(Math.random() * customTitles.length);
  const basePrice = generateRetailPrice();
  const meta = generateMovieMeta();  // ⭐ NEW

  const enrichedProduct = {
    ...product,
    customTitle: customTitles[index],
    customImage: customImages[index],
    adjustedPrice: basePrice,
    originalPrice: basePrice + 8,
    meta
  };

  container.innerHTML = `
    <div class="product-image"
        style="background-image:url('${enrichedProduct.customImage}')">
    </div>

    <div class="product-meta">
        <span class="product-label">
        FILE ID: ${product.id.slice(0, 8).toUpperCase()}
        </span>

        <h1>${enrichedProduct.customTitle}</h1>

        <p class="product-description">
        ${product.description}
        </p>

        <div class="movie-meta">
          <div><span>GENRE</span> ${meta.genre}</div>
          <div><span>RUNTIME</span> ${meta.runtime} mins</div>
          <div><span>RELEASE</span> ${meta.year}</div>
          <div><span>RATING</span> ${meta.rating}</div>
        </div>

        <div class="stock-warning">
          ONLY ${meta.stock} UNITS REMAINING
        </div>

        <div class="product-price">
            <span class="old">
              £${enrichedProduct.originalPrice.toFixed(2)}
            </span>

            <span class="new">
              £${enrichedProduct.adjustedPrice.toFixed(2)}
            </span>
        </div>

        <div class="product-actions">
            <button class="load" id="addToCartBtn">
              ADD TO CART
            </button>
        </div>
    </div>
  `;

  const button = document.getElementById("addToCartBtn");
  button.addEventListener("click", () => addToCart(enrichedProduct));
}

(async () => {
  if (!productId) {
    container.innerHTML = "<p>NO FILE SELECTED</p>";
    return;
  }

  const product = await fetchProduct(productId);
  renderProduct(product);
})();
