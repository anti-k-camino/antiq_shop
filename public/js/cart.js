let cart = {};
document.querySelectorAll('.add-to-cart').forEach(elem => {
  elem.onclick = addToCart;
});

if (localStorage.getItem('cart')) {
  cart = JSON.parse(localStorage.getItem('cart'));
  getGoodsInfoXHR();
}

function addToCart () {
  const goodsId = this.dataset.goods_id;
  if (cart[goodsId])
    ++cart[goodsId]
  else
    cart[goodsId] = 1;
  getGoodsInfoXHR();
};

function getGoodsInfoXHR () {
  updateLocalStorageCart();
  fetch('/get-goods-info', {
    method: 'POST',
    body: JSON.stringify({key: Object.keys(cart)}),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.text())
  .then(body => {
    showCart(JSON.parse(body));
  });
};

function showCart (data) {
  let out = '<table class="table table-striped table-cart"><tbody>';
  let total = 0;
  for(let key in cart){
    total += cart[key] * data[key]['cost'];
    out += `<tr><td colspan="4"><a href="/goods?id=${key}">${data[key]['name']}</a></tr>`;
    out += `<tr><td><i class="fa fa-minus-square cart-minus" data-goods_id="${key}"></i></td>`;
    out += `<td>${cart[key]}</td>`;
    out += `<td><i class="fa fa-plus-square cart-plus" data-goods_id="${key}"></i></td>`;
    out += `<td>${formatPrice(data[key]['cost'] * cart[key])} UAH</td>`;
    out += '</tr>';
  };
  out += `<tr><td colspan="3">TOTAL : </td><td>${formatPrice(total)}</td></tr>`
  out += '</tbody></table>';
  document.querySelector('#cart-nav').innerHTML = out;
  document.querySelectorAll('.cart-minus').forEach(elem => {
    elem.onclick = cartMinus;
  });
  document.querySelectorAll('.cart-plus').forEach(elem => {
    elem.onclick = cartPlus;
  });
};

function cartPlus () {
  const goodsId = this.dataset.goods_id;
  ++cart[goodsId];
  getGoodsInfoXHR();
};

function cartMinus () {
  const goodsId = this.dataset.goods_id;
  if (cart[goodsId] > 1)
    --cart[goodsId];
  else
    delete(cart[goodsId]);
  getGoodsInfoXHR();
};

function updateLocalStorageCart () {
  localStorage.setItem('cart', JSON.stringify(cart));
};

function formatPrice (price) {
  return price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ');
};
