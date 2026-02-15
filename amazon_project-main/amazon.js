import { cart, addToCart, CalculateCartNumber } from "./cart.js";

// მთავარი კონტეინერი
const productContainer = document.querySelector(".products-grid");

// ეს ფუნქცია ტვირთავს მონაცემებს ჯანგოდან
async function renderProducts() {
  try {
    // 1. ვუკავშირდებით ჯანგოს
    const response = await fetch('http://127.0.0.1:8000/api/products/');
    const products = await response.json();

    let productsHTML = '';

    products.forEach((item) => {
      // 2. ფასის და რეიტინგის გასწორება
      // რადგან ბექენდს ჯერ რეიტინგი არ აქვს, დროებით ხელით გავუწეროთ 4.5
      const rating = { stars: 4.5, count: 87 }; 
      
      productsHTML += `
        <div class="product-container">
          <div class="product-image-container">
            <img class="product-image" src="${item.image}">
          </div>

          <div class="product-name limit-text-to-2-lines">
            ${item.name}
          </div>

          <div class="product-rating-container">
            <img class="product-rating-stars"
              src="images/ratings/rating-45.png">
            <div class="product-rating-count link-primary">
              ${rating.count}
            </div>
          </div>

          <div class="product-price">
            $${item.price}
          </div>

          <div class="product-quantity-container">
            <select class="product-quantity-select">
              <option selected value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
            </select>
          </div>

          <div class="product-spacer"></div>

          <div class="added-to-cart added-to-cart-${item.id}">
            <img src="images/icons/checkmark.png">
            Added
          </div>

          <button class="add-to-cart-button button-primary JS-add-to-cart" data-product-id="${item.id}">
            Add to Cart
          </button>
        </div>
      `;
    });

    // 3. HTML-ის ჩასმა გვერდზე
    productContainer.innerHTML = productsHTML;

    // 4. ღილაკების გაცოცხლება (ეს აუცილებლად აქ უნდა იყოს!)
    document.querySelectorAll(".JS-add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const select = button.parentElement.querySelector(".product-quantity-select");
        const addQuantity = Number(select.value);
        const cartProduct = button.dataset.productId;

        showAddedToCart(button);
        addToCart(cartProduct, addQuantity);
        CalculateCartNumber(); // ესეც აქ დავამატე, რომ განახლდეს
      });
    });

  } catch (error) {
    console.error("Error loading products:", error);
    productContainer.innerHTML = "<p>ვერ დავუკავშირდი სერვერს. ჩართულია Django?</p>";
  }
}

// 5. ფუნქციის გაშვება
renderProducts();
CalculateCartNumber(); // თავიდანვე რომ აჩვენოს კალათის რაოდენობა

// Helper ფუნქცია (იგივე რაც გქონდათ)
let Timeout;
function showAddedToCart(button) {
  const message = document.querySelector(`.added-to-cart-${button.dataset.productId}`);
  // დაცვა: თუ ელემენტი ვერ იპოვა, არ გატყდეს კოდი
  if (!message) return; 
  
  message.classList.add("added-to-cart-visible");
  
  if (Timeout) {
    clearTimeout(Timeout);
  }
  
  Timeout = setTimeout(() => {
    message.classList.remove("added-to-cart-visible");
  }, 2000);
}