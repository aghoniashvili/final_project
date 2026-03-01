const form = document.getElementById('register-form');
const errorMessage = document.querySelector('.js-error-message');
const successMessage = document.querySelector('.js-success-message');

form.addEventListener('submit', async (event) => {
  event.preventDefault(); // არეგულირებს, რომ გვერდი არ დარეფრეშდეს

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // ვმალავთ წინა მესიჯებს
  errorMessage.style.display = 'none';
  successMessage.style.display = 'none';

  try {
    // ვაგზავნით მონაცემებს ჯანგოსთან
    const response = await fetch('http://127.0.0.1:8000/api/register/', {
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
      // თუ 201 Created მივიღეთ
      successMessage.style.display = 'block';
      form.reset(); // ვასუფთავებთ ველებს
      
    } else {
      // თუ რამე შეცდომაა (მაგ: სახელი დაკავებულია)
      const data = await response.json();
      
      // ჯანგო აბრუნებს ობიექტს ერორებით, ვაქცევთ ტექსტად
      let errorText = "Error: ";
      if (data.username) {
        errorText += data.username[0]; // "A user with that username already exists."
      } else {
        errorText += JSON.stringify(data);
      }
      
      errorMessage.textContent = errorText;
      errorMessage.style.display = 'block';
    }

  } catch (error) {
    console.error('Error:', error);
    errorMessage.textContent = "Network error. Is Django running?";
    errorMessage.style.display = 'block';
  }
});