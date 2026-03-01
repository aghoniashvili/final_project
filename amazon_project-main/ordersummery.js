import { cart, placeOrderFetch } from './cart.js'; // დავამატეთ placeOrderFetch იმპორტი
import { deliveryoptions } from './data/delivery.js'; 

export function updateOrderSummary(products) {
  let cost = 0;
  let deliverycost = 0;
  let totalItems = 0;
    
  let orderSummaryHTML = "";
  
  cart.forEach((item) => {
    const product = products.find((p) => String(p.id) === String(item.product));
    
    if (!product) return;

    const price = Number(product.price); 
    const eachcost = price * item.quantity;
    
    const deliveryId = item.deliveryid || "1";
    const delivery = deliveryoptions.find((option) => option.deliveryid === deliveryId);
    const eachdeliverycost = delivery && delivery.pricecents === 0 ? 0 : Number((delivery.pricecents / 100).toFixed(2));
    
    cost += eachcost;
    deliverycost += eachdeliverycost;
    totalItems += item.quantity;
  });
    
  const beforetax = cost + deliverycost;
  const tax = beforetax * 0.1;
  const total = beforetax + tax; 
    
  orderSummaryHTML += `
    <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${totalItems}):</div> 
      <div class="payment-summary-money">$${cost.toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${deliverycost.toFixed(2)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${beforetax.toFixed(2)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${tax.toFixed(2)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${total.toFixed(2)}</div>
    </div>

    <button class="place-order-button button-primary JS-place-order">
      Place your order
    </button>
  `;

  document.querySelector(".payment-summary").innerHTML = orderSummaryHTML;

  // --- "Place Order" ღილაკის ლოგიკა ---
  const placeOrderBtn = document.querySelector(".JS-place-order");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", async () => {
      // 1. ვაგზავნით მოთხოვნას ბექენდზე
      const order = await placeOrderFetch();
      
      if (order) {
        // 2. თუ წარმატებით დასრულდა, გადავდივართ შეკვეთების გვერდზე
        alert("გილოცავთ! შეკვეთა წარმატებით განთავსდა.");
        window.location.href = "orders.html";
      }
    });
  }
}