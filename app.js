let products = [];
let cart = {};

async function init() {
  const res = await fetch('products.json');
  products = await res.json();
  renderProducts(products);
}

function renderProducts(items) {
  const container = document.getElementById('products');
  const tpl = document.getElementById('product-template');
  container.innerHTML = '';

  items.forEach(p => {
    const el = tpl.content.cloneNode(true);
    const img = el.querySelector('.product-image');
    const priceDisplay = el.querySelector('.product-price-display');
    const select = el.querySelector('.size-select');

    img.src = p.image;
    el.querySelector('.product-title').textContent = p.name;
    priceDisplay.textContent = '₹' + p.sizes[0].price;

    p.sizes.forEach(s => {
      const opt = document.createElement('option');
      opt.value = `${s.size}::${s.price}`;
      opt.textContent = `${s.size} — ₹${s.price}`;
      select.appendChild(opt);
    });

    select.addEventListener('change', (e) => {
      priceDisplay.textContent = '₹' + e.target.value.split('::')[1];
    });

    el.querySelector('.add-to-cart').addEventListener('click', () => {
      const [size, price] = select.value.split('::');
      addToCart(p.id, size, parseFloat(price));
    });

    container.appendChild(el);
  });
}

function addToCart(id, size, price) {
  const key = `${id}|${size}`;
  if (cart[key]) {
    cart[key].qty++;
  } else {
    cart[key] = { name: products.find(x => x.id === id).name, size, price, qty: 1 };
  }
  updateCartUI();
}

function updateCartUI() {
  const count = Object.values(cart).reduce((s, i) => s + i.qty, 0);
  document.getElementById('cart-count').textContent = count;
  
  const itemsContainer = document.getElementById('cart-items');
  itemsContainer.innerHTML = '';
  let total = 0;

  for (const k in cart) {
    const it = cart[k];
    const div = document.createElement('div');
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.padding = '8px 0';
    div.innerHTML = `<span>${it.name} (${it.size}) x${it.qty}</span><span>₹${it.price * it.qty}</span>`;
    itemsContainer.appendChild(div);
    total += it.price * it.qty;
  }
  document.getElementById('cart-total').textContent = total.toFixed(2);
}

// Search Logic
document.getElementById('search-bar').addEventListener('input', (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

// Place Order
document.getElementById('place-order').addEventListener('click', () => {
  if (Object.keys(cart).length === 0) return alert('Cart is empty');
  let msg = "New Order from Pepper Mist:%0a";
  for (const k in cart) msg += `- ${cart[k].name} (${cart[k].size}) x${cart[k].qty}%0a`;
  msg += `%0aTotal: ₹${document.getElementById('cart-total').textContent}`;
  window.open(`https://wa.me/919995068559?text=${msg}`, '_blank');
});

document.getElementById('cart-btn').addEventListener('click', () => {
  document.getElementById('checkout').classList.toggle('hidden');
});
