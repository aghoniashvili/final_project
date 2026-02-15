import {cart} from './cart.js';
import {deliveryoptions} from './data/delivery.js'; 
import {product as products} from './data/products.js';



export function updateOrderSummary(){
    let cost =0;
    let deliverycost =0;
    

 let orderSummaryHTML = "";
  cart.forEach((item) => {
    const product = products.find((product) => product.id === item.productId);
    const price = product.priceCents/100
     const eachcost = price* item.quantity;
    const delivery = deliveryoptions.find((option) => option.deliveryid === item.deliveryid);
    const eachdeliverycost = delivery.pricecents===0 ? 0 : Number((delivery.pricecents / 100).toFixed(2));
    
    cost += eachcost;
    deliverycost += eachdeliverycost;
    ;})
    const beforetax = cost + deliverycost;
    const tax = beforetax * 0.1;
    const total = beforetax + tax; 
    orderSummaryHTML +=

     `<div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (3):</div>
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

          <button class="place-order-button button-primary">
            Place your order
          </button>
          `
     

    document.querySelector(".payment-summary").innerHTML = orderSummaryHTML;
}