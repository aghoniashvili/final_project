import { product as products } from "./data/products.js";
import { cart , removeFromCart , updatelocal} from "./cart.js";  
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {deliveryoptions} from "./data/delivery.js";
import { updateOrderSummary } from "./ordersummery.js";

const today = dayjs();

console.log(today.format("dddd MMMM D"));
function renderoptions(cart)
{
  let html="";
deliveryoptions.forEach((item) => {
 
  const today = dayjs();
  const deliveryDate = today.add(item.time, "day").format("dddd MMMM D");
  const shippingcost  = item.pricecents===0 ? "FREE Shipping" : `$${(item.pricecents / 100).toFixed(2)} - Shipping`;
  const ischecked = item.deliveryid === cart.deliveryid ? "checked" : "";
  html += 
`
 
 
  
  <div class="delivery-option">
    <input type="radio" ${ischecked}
      class="delivery-option-input"
      data-product-id="${cart.productId}"
      data-delivery-id="${item.deliveryid}"
      name="delivery-option-${cart.productId}">
    <div>
      <div class="delivery-option-date">
        ${deliveryDate}
      </div>
      <div class="delivery-option-price">
        ${shippingcost}
      </div>
    </div>
  </div>
  
`})
return html;

}


function updateCart() 
  {
   

      let cartHTML = "";
    cart.forEach((item) => {
    const deliverytime = deliveryoptions.find((option) => option.deliveryid === item.deliveryid);
            
            let deliveryDate = today;
            let i = deliverytime.time;
            while (i >0 ) {
              deliveryDate = deliveryDate.add(1, "day");
              if (deliveryDate.day() === 0 || deliveryDate.day() === 6) {
              continue;}
                
                i--;
            }
            

            
            

            const deliveryDateStr = deliveryDate.format("dddd MMMM D");

      const product = products.find((product) => product.id === item.productId);
      cartHTML += `
            <div class="cart-item-container">
                  <div class="delivery-date">
                Delivery date: ${deliveryDateStr}
            </div>

            <div class="cart-item-details-grid">
                <img class="product-image"
                  src="${product.image}">

            <div class="cart-item-details">
                  <div class="product-name">
                    ${product.name}
            </div>
            <div class="product-price">
                    $${(product.priceCents / 100).toFixed(2)}
            </div>
            <div class="product-quantity">
                    <span>
                      Quantity: <span class="quantity-label">${item.quantity}</span>
                    </span>
                    <span class="update-quantity-link update-${item.productId} link-primary JS-update" data-product-id="${item.productId}">
                      Update
                    </span>
                    <input class="quantity-input-${item.productId} link-primary dissapear input-quantity" type ="number" > <span class="quantity-input-${item.productId} link-primary dissapear JS-save" data-product-id="${item.productId}">save</span>
                    <span class="delete-quantity-link  link-primary JS-delete-item" data-product-id="${item.productId}">
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
              </div>
            </div>`
      
      
  })

  document.querySelector(".order-summary").innerHTML = cartHTML;

  document.querySelectorAll(".JS-delete-item").forEach((deleteButton)=>{deleteButton.addEventListener("click", (event) => { let CartProductid = event.target.dataset.productId;
      removeFromCart(CartProductid);
      updateCart();
      updateCartquantity();
      
      })})

      document.querySelectorAll(".JS-update").forEach((updateButton) => {updateButton.addEventListener("click", (event) =>
        {let UpdateProductid = event.target.dataset.productId; 
    
      
      
        document.querySelectorAll(`.quantity-input-${UpdateProductid}`).forEach((input) => 
        {input.classList.toggle("dissapear") ;})
        updateButton.classList.toggle("dissapear")})})
        
      
        document.querySelectorAll(".JS-save").forEach((saveButton) => {saveButton.addEventListener("click", (event) =>
          {let saveProductid = event.target.dataset.productId; 
            const saveId= cart.find((item) => item.productId === saveProductid);
            const newQuantity = parseInt(document.querySelector(`.quantity-input-${saveProductid}`).value);
            if (newQuantity >= 0) {
              saveId.quantity = newQuantity;}
    
            
          
            document.querySelectorAll(`.quantity-input-${saveProductid}`).forEach((input) => 
            {input.classList.toggle("dissapear") ;})
            
            document.querySelectorAll(`.update-${saveProductid}`).forEach((input) => 
            {input.classList.toggle("dissapear") ;})
          updateCart();
          updateCartquantity();
          })})
          document.querySelectorAll(".delivery-option-input").forEach((input) => {input.addEventListener("change", (event) => {
            const selectedDeliveryId = event.target.dataset.deliveryId;
            const selectedProductId = event.target.dataset.productId;
            const selectedProduct = cart.find((item) => item.productId === selectedProductId);
            selectedProduct.deliveryid = selectedDeliveryId;
            updatelocal(cart);
            updateCart();
            updateCartquantity();
            
          });})
          updateOrderSummary();
          }   

updateCart();
function updateCartquantity(){
 const CartQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
 document.querySelector(".JS-itemsQuantity").innerHTML = CartQuantity;
}
updateCartquantity();
updateOrderSummary();


   

