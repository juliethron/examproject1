const container = document.getElementById("product");
const API_URL = "https://v2.api.noroff.dev/online-shop";

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

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
    container.innerHTML = "<p>PRODUCT FILE CORRUPTED</p>";
    return;
    }

    container.innerHTML = `
    <div class="product-image"
        style="background-image:url('${product.image.url}')">
    </div>

    <div class="product-meta">
        <span class="product-label">
        FILE ID: ${product.id.slice(0, 8).toUpperCase()}
        </span>

        <h1>${product.title}</h1>

        <p class="product-description">
        ${product.description}
        </p>

        <div class="product-price">
        ${product.discountedPrice.toFixed(2)} CREDITS
        </div>

        <div class="product-actions">
        <button class="load">LOAD TO CARGO</button>
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
