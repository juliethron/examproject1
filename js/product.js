const container = document.getElementById("product");
const API_URL = "https://v2.api.noroff.dev/online-shop";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

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
  if (!container || !product) {
    container.innerHTML = "<p>PRODUCT FILE CORRUPTED</p>";
    return;
  }

  const index = Math.floor(Math.random() * customTitles.length);

  const adjustedPrice = generateRetailPrice();

  container.innerHTML = `
    <div class="product-image"
        style="background-image:url('${customImages[index]}')">
    </div>

    <div class="product-meta">
        <span class="product-label">
        FILE ID: ${product.id.slice(0, 8).toUpperCase()}
        </span>

        <h1>${customTitles[index]}</h1>

        <p class="product-description">
        ${product.description}
        </p>

        <div class="product-price">
        £${adjustedPrice.toFixed(2)}
        </div>

        <div class="product-actions">
        <button class="load">ADD TO CART</button>
        </div>
    </div>
  `;
}

(async () => {
  if (!productId) {
    container.innerHTML = "<p>NO FILE SELECTED</p>";
    return;
  }

  const product = await fetchProduct(productId);
  renderProduct(product);
})();
