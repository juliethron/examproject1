const API_URL = "https://v2.api.noroff.dev/online-shop";

const productId = new URLSearchParams(window.location.search).get("id");

const imageEl = document.getElementById("productImage");
const titleEl = document.getElementById("productTitle");
const descEl = document.getElementById("productDescription");
const priceEl = document.getElementById("productPrice");
const buttonEl = document.getElementById("addToCartBtn");

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

async function fetchProduct(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`);
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("API ERROR:", error);
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
  alert("ITEM LOADED INTO CART");
}

function renderProduct(product) {
  if (!product) {
    titleEl.textContent = "PRODUCT LOAD FAILURE";
    return;
  }

  const index = productId.charCodeAt(0) % customTitles.length;
  const basePrice = generateRetailPrice();

  const customDescriptions = [
    "A research team uncovers a shape-shifting terror in Antarctica.",
    "Grief twists into psychological horror.",
    "A satanic legacy emerges from tragedy.",
    "A surreal descent into nightmare logic.",
    "An experimental weapons test goes catastrophically wrong.",
    "Evil returns to Haddonfield.",
    "Isolation breeds madness.",
    "Something monstrous lurks within.",
    "Reality fractures under surveillance.",
    "Games of survival begin.",
    "Darkness waits below.",
    "Pain becomes ritual."
  ];

  const enrichedProduct = {
    ...product,
    customTitle: customTitles[index],
    customImage: customImages[index],
    adjustedPrice: basePrice,
    originalPrice: basePrice + 8
  };

  imageEl.style.backgroundImage = `url('${enrichedProduct.customImage}')`;
  titleEl.textContent = enrichedProduct.customTitle;
  descEl.textContent = customDescriptions[index];

  priceEl.innerHTML = `
    <div class="price">
      <span class="old">£${enrichedProduct.originalPrice.toFixed(2)}</span>
      <span class="new">£${enrichedProduct.adjustedPrice.toFixed(2)}</span>
    </div>
  `;

  buttonEl.addEventListener("click", () => addToCart(enrichedProduct));
}

(async () => {
  if (!productId) {
    titleEl.textContent = "NO FILE SELECTED";
    return;
  }

  const product = await fetchProduct(productId);
  renderProduct(product);
})();
