const form = document.getElementById('login-form');
const errorMessage = document.querySelector('.js-error-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  errorMessage.style.display = 'none';

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username,
        password: password
      })
    });

    if (response.ok) {
      const data = await response.json();
      
      // 1. ვინახავთ Token-ს და Username-ს ბრაუზერის მეხსიერებაში
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', username);
      
      // 2. გადავდივართ მთავარ გვერდზე წარმატებული შესვლის შემდეგ
      window.location.href = 'amazon.html';

    } else {
      // არასწორი პაროლი ან იუზერი
      errorMessage.textContent = "Invalid username or password.";
      errorMessage.style.display = 'block';
    }

  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = "Network error. Is Django running?";
    errorMessage.style.display = 'block';
  }
});