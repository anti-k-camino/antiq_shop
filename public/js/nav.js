document.querySelector('.close-nav').onclick = closeNav;
document.querySelector('.show-nav').onclick = showNav;

getCategoriyList();

function getCategoriyList () {
  fetch('/get-category-list', { method: 'POST' })
    .then(response => response.text())
    .then(body => {
      showCategoryList(JSON.parse(body));
    });
};

function showCategoryList (data) {
  let out = '<ul class="category-list"><li><a href="/">Main</a></li>';
  for(let[key, cat] of Object.entries(data)) {
    out += `<li><a href='/category?id=${cat.id}'>${cat.category}</a></li>`
  }
  out += '</ul>';
  document.querySelector('.category-list').innerHTML = out;
};

function closeNav () {
  document.querySelector('.site-nav').style.left = '-300px';
};

function showNav () {
  document.querySelector('.site-nav').style.left = '0';
};
