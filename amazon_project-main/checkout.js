import { cart, loadCartFetch, removeFromCart, updatelocal, updateQuantityFetch } from "./cart.js";  
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { deliveryoptions } from "./data/delivery.js";
import { updateOrderSummary } from "./ordersummery.js";

const today = dayjs();

function renderoptions(cartItem) {
  let html="";
  deliveryoptions.forEach((item) => {
    const deliveryDate = today.add(item.time, "day").format("dddd MMMM D");
    const shippingcost  = item.pricecents === 0 ? "FREE Shipping" : `$${(item.pricecents / 100).toFixed(2)} - Shipping`;
    const ischecked = item.deliveryid === cartItem.deliveryid ? "checked" : "";
    
    html += `
      <div class="delivery-option">
        <input type="radio" ${ischecked}
          class="delivery-option-input"
          data-product-id="${cartItem.product}" 
          data-delivery-id="${item.deliveryid}"
          name="delivery-option-${cartItem.product}">
        <div>
          <div class="delivery-option-date">
            ${deliveryDate}
          </div>
          <div class="delivery-option-price">
            ${shippingcost}
          </div>
        </div>
      </div>
    `
  });
  return html;
}

async function initCheckout() {
  await loadCartFetch(); 
  
  const response = await fetch('http://127.0.0.1:8000/api/products/');
  const products = await response.json();

  updateCart(products); 
  updateCartquantity();
  updateOrderSummary(products);
}

function updateCart(products) {
  let cartHTML = "";

  cart.forEach((item) => {
    if (!item.deliveryid) item.deliveryid = "1"; 

    const deliverytime = deliveryoptions.find((option) => option.deliveryid === item.deliveryid);
    
    let deliveryDate = today;
    if (deliverytime) {
        let i = deliverytime.time;
        while (i > 0) {
          deliveryDate = deliveryDate.add(1, "day");
          if (deliveryDate.day() === 0 || deliveryDate.day() === 6) {
            continue;
          }
          i--;
        }
    }

    const deliveryDateStr = deliveryDate.format("dddd MMMM D");

    const product = products.find((p) => String(p.id) === String(item.product)); 
    
    if (!product) return; 

    cartHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">
          Delivery date: ${deliveryDateStr}
        </div>
        <div class="cart-item-details-grid">
          <img class="product-image" src="${product.image}">
          <div class="cart-item-details">
            <div class="product-name">
              ${product.name}
            </div>
            <div class="product-price">
              $${product.price} 
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label">${item.quantity}</span>
              </span>
              <span class="update-quantity-link update-${product.id} link-primary JS-update" data-product-id="${product.id}">
                Update
              </span>
              <input class="quantity-input-${product.id} link-primary dissapear input-quantity" type ="number" value="${item.quantity}"> 
              <span class="quantity-input-${product.id} link-primary dissapear JS-save" data-product-id="${product.id}">save</span>
              <span class="delete-quantity-link  link-primary JS-delete-item" data-product-id="${product.id}">
                Delete
              </span>
            </div>
          </div>
          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${renderoptions(item)}
          </div>
        </div>
      </div>
    `;
  });

  document.querySelector(".order-summary").innerHTML = cartHTML;

  // ---------------- EVENT LISTENERS ----------------
  
  // წაშლა ბაზიდან
  document.querySelectorAll(".JS-delete-item").forEach((deleteButton) => {
    deleteButton.addEventListener("click", async (event) => { 
      let CartProductid = event.target.dataset.productId;
      await removeFromCart(CartProductid); // ველოდებით ბექენდს
      initCheckout(); 
    });
  });

  document.querySelectorAll(".JS-update").forEach((updateButton) => {
    updateButton.addEventListener("click", (event) => {
      let UpdateProductid = event.target.dataset.productId; 
      document.querySelectorAll(`.quantity-input-${UpdateProductid}`).forEach((input) => {
        input.classList.toggle("dissapear");
      });
      updateButton.classList.toggle("dissapear");
    });
  });
        
  // განახლება ბაზაში
  document.querySelectorAll(".JS-save").forEach((saveButton) => {
    saveButton.addEventListener("click", async (event) => {
      let saveProductid = event.target.dataset.productId; 
      const newQuantity = parseInt(document.querySelector(`.quantity-input-${saveProductid}`).value);
      
      if (newQuantity > 0) {
        await updateQuantityFetch(saveProductid, newQuantity); // ველოდებით ბექენდს
      } else if (newQuantity === 0) {
        await removeFromCart(saveProductid);
      }
      
      initCheckout(); 
    });
  });

  document.querySelectorAll(".delivery-option-input").forEach((input) => {
    input.addEventListener("change", (event) => {
      const selectedDeliveryId = event.target.dataset.deliveryId;
      const selectedProductId = event.target.dataset.productId;
      const selectedProduct = cart.find((item) => String(item.product) === String(selectedProductId));
      
      if (selectedProduct) {
        selectedProduct.deliveryid = selectedDeliveryId;
      }
      updatelocal(cart); 
      initCheckout();
    });
  });
} 

function updateCartquantity() {
  const CartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
  document.querySelector(".JS-itemsQuantity").innerHTML = `${CartQuantity} items`;
}

initCheckout();