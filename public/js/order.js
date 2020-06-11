document.querySelector('#lite-shop-order').onsubmit = event => {
  event.preventDefault();
  // LOOK UP FOR SOME FORM VALIDATION LIB TO INCLUDE !
  const username = document.querySelector('#username').value.trim();
  const phone = document.querySelector('#phone').value.trim();
  const email = document.querySelector('#email').value.trim();
  const address = document.querySelector('#address').value.trim();

  if (!document.querySelector('#rule').checked) {

  };

  if (username == '' || phone == '' || email == '' || address == '') {

  };
  // const reqBody = { username, phone, address, email };
  // reqBody.key = JSON.parse(localStorage.getItem('cart'))
  fetch('/finish-order', {
    method: 'POST',
    body: JSON.stringify({
      'username': username,
      'phone': phone,
      'email': email,
      'address': address,
      'key': JSON.parse(localStorage.getItem('cart'))
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  }).then(response => {
      console.log('RESPONSE > ', response);
      return response.text();
    })
    .then(body => {
      if (body > 1) {

      } else {

      }
    });
};
