const API_URL = "https://v2.api.noroff.dev/online-shop";
const gridEl = document.getElementById("grid");

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

async function fetchProducts() {
  try {
    const res = await fetch(API_URL);
    const json = await res.json();
    return json.data;

  } catch (error) {
    console.error("Failed to load products", error);
    return [];
  }
}

function renderProducts(products) {

  if (!gridEl) return;

  gridEl.innerHTML = "";

  const usedIndexes = new Set();

  for (const product of products) {

    const index = getStableIndex(product.id);

    if (usedIndexes.has(index)) continue;

    usedIndexes.add(index);

    gridEl.innerHTML += `
      <div class="card">
        <a href="product.html?id=${product.id}">
          <div class="poster" style="background-image:url('${customImages[index]}')"></div>

          <div class="card-content">
            <h3>${customTitles[index]}</h3>

            <div class="price-cart">
              <div class="price">
                <span class="old">£${product.price.toFixed(2)}</span>
                <span class="new">£${product.discountedPrice.toFixed(2)}</span>
              </div>

              <button class="add">LOAD</button>
            </div>
          </div>
        </a>
      </div>
    `;

    if (usedIndexes.size >= customTitles.length) break;
  }
}

(async () => {
  const products = await fetchProducts();
  renderProducts(products);
})();
