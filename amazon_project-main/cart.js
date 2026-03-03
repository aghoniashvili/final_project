export let cart = [];

export async function loadCartFetch() {
  const token = localStorage.getItem('token');
  if (!token) { cart = []; return; }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/cart/', {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const data = await response.json();
      cart = data.items;
    }
  } catch (error) { console.error("Error loading cart:", error); }
}

export async function addToCart(productId, quantity = 1) {
  const token = localStorage.getItem('token');
  if (!token) { alert("Please Sign In!"); return; }

  try {
    const response = await fetch('http://127.0.0.1:8000/api/cart/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product_id: productId, quantity: quantity })
    });
    if (response.ok) {
      const data = await response.json();
      cart = data.items;
    }
  } catch (error) { console.error("Error adding to cart:", error); }
}


export async function removeFromCart(productId) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/cart/', {
      method: 'DELETE',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product_id: productId })
    });

    if (response.ok) {
      const data = await response.json();
      cart = data.items; // ბაზამ წაშალა და გვიბრუნებს განახლებულ სიას
    }
  } catch (error) { console.error("Error deleting item:", error); }
}

export async function updateQuantityFetch(productId, newQuantity) {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/cart/', {
      method: 'PUT',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product_id: productId, quantity: newQuantity })
    });

    if (response.ok) {
      const data = await response.json();
      cart = data.items; // ბაზამ განაახლა რაოდენობა
    }
  } catch (error) { console.error("Error updating quantity:", error); }
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((item) => { cartQuantity += item.quantity; });
  return cartQuantity;
}

export function updatelocal(newCart) { cart = newCart; }


export async function placeOrderFetch() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const response = await fetch('http://127.0.0.1:8000/api/orders/', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const orderData = await response.json();
      console.log("Order created successfully:", orderData);
      return orderData; // ვაბრუნებთ შეკვეთის მონაცემებს წარმატების შემთხვევაში
    } else {
      const errorData = await response.json();
      alert(`Order failed: ${errorData.error}`);
    }
  } catch (error) {
    console.error("Error placing order:", error);
  }
}