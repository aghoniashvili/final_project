

export let cart = JSON.parse(localStorage.getItem("cart"));
if (!cart) { cart = [{
    productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
    quantity: 4,
    deliveryid: "1"
}
,
{ productId: "3ebe75dc-64d2-4137-8860-1f5a963e534b",
    quantity: 2,
    deliveryid: "2"
}
,
{ productId: "8c9c52b5-5a19-4bcb-a5d1-158a74287c53",
    quantity: 1,
    deliveryid: "1"
}];}

export function updatelocal(cart){localStorage.setItem("cart", JSON.stringify(cart));}

export function removeFromCart(cartProduct) {
    const newCart = [];
    cart.forEach((Cartitem)=> {if (Cartitem.productId !== cartProduct) {
        newCart.push(Cartitem);
    }});
    cart= newCart;
    updatelocal(cart);
}

export  function addToCart(cartProduct, addQuantity) 
{

    
    let isInCart;
    cart.forEach((item) => {if (item.productId === cartProduct) {
        isInCart = item;}})
         if (isInCart) {
            isInCart.quantity+= addQuantity;
                }
        else{  
            cart.push({productId: cartProduct , quantity: addQuantity , deliveryid: "1"});
             }    const cartProductId = cart.find((item) => item.productId === cartProduct);
             updatelocal(cart);
            CalculateCartNumber();}
 
export function CalculateCartNumber(){                    
let orderNumber = 0;

cart.forEach((item) => {
    
    orderNumber= item.quantity + orderNumber;})

    document.querySelector(".JS-cartNumber").innerHTML=orderNumber;
    updatelocal(cart);}
