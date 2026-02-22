console.log("PRODUCT JS LOADED");

const API_URL = "https://v2.api.noroff.dev/online-shop";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const imageEl = document.getElementById("productImage");
const titleEl = document.getElementById("productTitle");
const descEl = document.getElementById("productDescription");
const priceEl = document.getElementById("productPrice");
const buttonEl = document.getElementById("addToCartBtn");

let cart = JSON.parse(localStorage.getItem("cart")) || [];



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

  if (buttonEl) {
    buttonEl.textContent = "LOADED ✓";
  }
}



async function fetchProduct(id) {

  console.log("Fetching product:", id);

  try {
    const res = await fetch(`${API_URL}/${id}`);
    const json = await res.json();

    console.log("API Response:", json);

    return json.data;

  } catch (error) {
    console.error("Failed to load product", error);
    return null;
  }
}



function renderProduct(product) {

  console.log("Rendering product:", product);

  if (!product) {
    if (titleEl) titleEl.textContent = "PRODUCT FILE CORRUPTED";
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
    descEl.textContent = product.description;
  }

  if (priceEl) {
    priceEl.innerHTML = `
      <span class="old">£${originalPrice.toFixed(2)}</span>
      <span class="new">£${adjustedPrice.toFixed(2)}</span>
    `;
  }

  if (buttonEl) {
    buttonEl.onclick = () => addToCart(enrichedProduct);
  }
}



(async () => {

  console.log("Init started");

  if (!productId) {
    if (titleEl) titleEl.textContent = "NO FILE SELECTED";
    return;
  }

  const product = await fetchProduct(productId);
  renderProduct(product);

})();
