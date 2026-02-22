const API_URL = "https://v2.api.noroff.dev/online-shop";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

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

const customDescriptions = [
  "A grieving family becomes the target of a sinister, otherworldly presence tied to their ancestry.",
  "Love, loneliness, and unimaginable cruelty.",
  "Darkness below. Fear without escape.",
  "A chilling journey through censorship, memory, and psychological unease.",
  "Isolation. Madness. The horror within.",
  "Survival becomes a brutal game of endurance and terror.",
  "Reality fractures as a malevolent presence reveals itself.",
  "An unsettling investigation into a mysterious figure linked to a series of disturbing events.",
  "An experimental terror experience that pushes psychological boundaries.",
  "A research team in Antarctica encounters a shape-shifting organism capable of perfectly imitating its victims.",
  "A surreal descent into obsession, paranoia, and supernatural horror.",
  "One night. One masked figure. Pure relentless dread."
];

function getStablePrice(id) {
  return 14.99 + (
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 20
  );
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
      finalPrice: getStablePrice(product.id),
      quantity: 1
    });
  }

  persistCart();
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

function renderProduct(product) {

  if (!product) {
    titleEl.textContent = "PRODUCT FILE CORRUPTED";
    return;
  }

  const index = Math.abs(
    product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
  ) % customTitles.length;

  const enrichedProduct = {
    ...product,
    customTitle: customTitles[index],
    customImage: customImages[index]
  };

  imageEl.style.backgroundImage = `url('${enrichedProduct.customImage}')`;
  titleEl.textContent = enrichedProduct.customTitle;
  descEl.textContent = customDescriptions[index];

  
  const newPrice = getStablePrice(product.id);
  const oldPrice = newPrice + 10;

priceEl.innerHTML = `
  <span class="old">£${oldPrice.toFixed(2)}</span>
  <span class="new">£${newPrice.toFixed(2)}</span>
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
