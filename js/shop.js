const gridEl = document.getElementById("grid");

const movies = [
  { id: "thing", title: "THE THING", image: "bilds/thething.jpg", price: 29.99, discountedPrice: 19.99 },
  { id: "hereditary", title: "HEREDITARY", image: "bilds/hereditary.jpg", price: 39.99, discountedPrice: 24.99 },
  { id: "longlegs", title: "LONGLEGS", image: "bilds/longlegs.jpg", price: 34.99, discountedPrice: 22.99 },
  { id: "suspiria", title: "SUSPIRIA", image: "bilds/suspiria.jpg", price: 44.99, discountedPrice: 28.99 },
  { id: "weapons", title: "WEAPONS", image: "bilds/weapons.jpg", price: 31.99, discountedPrice: 21.99 },
  { id: "halloween", title: "HALLOWEEN", image: "bilds/halloween.jpg", price: 26.99, discountedPrice: 18.99 },
  { id: "shining", title: "THE SHINING", image: "bilds/theshining.jpg", price: 49.99, discountedPrice: 32.99 },
  { id: "malignant", title: "MALIGNANT", image: "bilds/malignant.jpg", price: 36.99, discountedPrice: 23.99 },
  { id: "censor", title: "CENSOR", image: "bilds/censor.jpg", price: 27.99, discountedPrice: 17.99 },
  { id: "saw", title: "SAW", image: "bilds/saw.jpg", price: 24.99, discountedPrice: 14.99 },
  { id: "descent", title: "THE DESCENT", image: "bilds/thedescent.jpg", price: 33.99, discountedPrice: 20.99 },
  { id: "audition", title: "AUDITION", image: "bilds/audition.jpg", price: 41.99, discountedPrice: 26.99 }
];

function renderMovies() {

  if (!gridEl) return;

  gridEl.innerHTML = "";

  movies.forEach(movie => {

    gridEl.innerHTML += `
      <div class="card">
        <a href="product.html?id=${movie.id}">
          <div class="poster" style="background-image:url('${movie.image}')"></div>

          <div class="card-content">
            <h3>${movie.title}</h3>

            <div class="price-cart">
              <div class="price">
                <span class="old">£${movie.price.toFixed(2)}</span>
                <span class="new">£${movie.discountedPrice.toFixed(2)}</span>
              </div>

              <button class="add">LOAD</button>
            </div>
          </div>
        </a>
      </div>
    `;
  });
}

renderMovies();
