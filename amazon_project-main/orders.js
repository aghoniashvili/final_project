import { loadCartFetch, calculateCartQuantity } from './cart.js';
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

async function renderOrdersPage() {
  const token = localStorage.getItem('token');
  
  // 1. ავტორიზაციის შემოწმება
  if (!token) {
    window.location.href = 'login.html';
    return;
  }

  // 2. კალათის რაოდენობის განახლება ჰედერისათვის
  await loadCartFetch();
  const cartQuantityElement = document.querySelector('.JS-cart-quantity');
  if (cartQuantityElement) {
    cartQuantityElement.innerHTML = calculateCartQuantity();
  }

  try {
    // 3. მოგვაქვს შეკვეთების სია (ზუსტი მისამართი: /api/orders/list/)
    const response = await fetch('http://127.0.0.1:8000/api/orders/list/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error("Failed to load orders");
    }

    const orders = await response.json();
    let ordersHTML = '';

    const ordersGrid = document.querySelector('.JS-orders-grid');

    if (orders.length === 0) {
      ordersGrid.innerHTML = `
        <div style="margin-top: 20px;">
          თქვენ ჯერ არ გაქვთ შეკვეთები განთავსებული. 
          <a href="amazon.html" style="color: #c45500;">დაიწყეთ შოპინგი!</a>
        </div>`;
      return;
    }

    // 4. შეკვეთების კონტეინერების აწყობა
    orders.forEach((order) => {
      const orderDate = dayjs(order.created_at).format('MMMM D');

      ordersHTML += `
        <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDate}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${order.total_price}</div>
              </div>
            </div>
            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${renderOrderItems(order.items)}
          </div>
        </div>
      `;
    });

    ordersGrid.innerHTML = ordersHTML;

  } catch (error) {
    console.error("Error loading orders:", error);
    document.querySelector('.JS-orders-grid').innerHTML = 
      "შეკვეთების ჩატვირთვა ვერ მოხერხდა. დარწმუნდით, რომ სერვერი ჩართულია.";
  }
}

// ფუნქცია შეკვეთაში არსებული თითოეული ნივთის დასახატად
function renderOrderItems(items) {
  let itemsHTML = '';
  items.forEach((item) => {
    // მიტანის თარიღი (სავარაუდოდ 3 დღეში)
    const arrivalDate = dayjs().add(3, 'day').format('MMMM D');
    
    // ვიყენებთ ბექენდიდან წამოღებულ სურათს, თუ არ არის - სტანდარტულ აიქონს
    const imageSrc = item.product_image 
      ? `http://127.0.0.1:8000${item.product_image}` 
      : "images/icons/checkout-lock-icon.png";

    itemsHTML += `
      <div class="product-image-container">
        <img src="${imageSrc}"> 
      </div>

      <div class="product-details">
        <div class="product-name">
          ${item.product_name}
        </div>
        <div class="product-delivery-date">
          Arriving on: ${arrivalDate}
        </div>
        <div class="product-quantity">
          Quantity: ${item.quantity}
        </div>
        <button class="buy-again-button button-primary">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>

      <div class="product-actions">
        <a href="tracking.html">
          <button class="track-package-button button-secondary">
            Track package
          </button>
        </a>
      </div>
    `;
  });
  return itemsHTML;
}

renderOrdersPage();