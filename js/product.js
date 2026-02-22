const imageEl = document.getElementById("productImage");
const titleEl = document.getElementById("productTitle");
const descEl = document.getElementById("productDescription");
const priceEl = document.getElementById("productPrice");
const buttonEl = document.getElementById("addToCartBtn");

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

function getStableIndex(id) {
  return Math.abs(
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % customTitles.length;
}

function getStablePrice(id) {
  return 9.99 + (
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 15
  );
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
      customTitle: product.customTitle,
      finalPrice: product.adjustedPrice,
      quantity: 1
    });
  }

  persistCart();
  buttonEl.textContent = "LOADED ✓";
}

function renderProduct(product) {

  if (!product || !titleEl) {
    titleEl.textContent = "PRODUCT FILE CORRUPTED";
    return;
  }

  const index = getStableIndex(product.id);

  const adjustedPrice = getStablePrice(product.id);
  const originalPrice = adjustedPrice + 8;

  const enrichedProduct = {
    ...product,
    customTitle: customTitles[index],
    customImage: customImages[index],
    adjustedPrice,
    originalPrice
  };

  if (imageEl) {
    imageEl.style.backgroundImage = `url('${enrichedProduct.customImage}')`;
  }

  if (titleEl) {
    titleEl.textContent = enrichedProduct.customTitle;
  }

  if (descEl) {
    descEl.textContent = "Classified archive footage. Viewer discretion advised.";
  }

  if (priceEl) {
    priceEl.innerHTML = `
      <span class="old">£${originalPrice.toFixed(2)}</span>
      <span class="new">£${adjustedPrice.toFixed(2)}</span>
    `;
  }

  if (buttonEl) {
    buttonEl.addEventListener("click", () => addToCart(enrichedProduct));
  }
}

(async () => {

  if (!productId || !titleEl) {
    if (titleEl) titleEl.textContent = "NO FILE SELECTED";
    return;
  }

  const product = await fetchProduct(productId);
  renderProduct(product);

})();
