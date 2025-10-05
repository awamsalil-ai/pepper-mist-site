// Simple front-end demo cart — no server
let products = []
let cart = {}

async function loadProducts(){
  const res = await fetch('products.json')
  products = await res.json()
  renderProducts()
}

function renderProducts(){
  const container = document.getElementById('products')
  const tpl = document.getElementById('product-template')
  container.innerHTML = ''
  products.forEach(p => {
    const el = tpl.content.cloneNode(true)
    el.querySelector('.product-image').src = p.image || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(p.name)
    el.querySelector('.product-image').alt = p.name
    el.querySelector('.product-title').textContent = p.name
    el.querySelector('.product-price').textContent = '₹' + p.price
    const select = el.querySelector('.size-select')
    p.sizes.forEach(s => {
      const opt = document.createElement('option')
      opt.value = s.size + '::' + s.price
      opt.textContent = s.size + ' - ₹' + s.price
      select.appendChild(opt)
    })
    el.querySelector('.add-to-cart').addEventListener('click', () => {
      const val = select.value.split('::')
      addToCart(p.id, val[0], parseFloat(val[1]))
    })
    container.appendChild(el)
  })
}

function addToCart(id, size, price){
  const key = id + '|' + size
  if(cart[key]) cart[key].qty++
  else cart[key] = {id, size, price, qty:1, name: products.find(x=>x.id===id).name}
  updateCartUI()
}

function updateCartUI(){
  const count = Object.values(cart).reduce((s,i)=>s+i.qty,0)
  document.getElementById('cart-count').textContent = count
  const items = document.getElementById('cart-items')
  items.innerHTML = ''
  let total = 0
  for(const k in cart){
    const it = cart[k]
    const div = document.createElement('div')
    div.textContent = `${it.name} (${it.size}) x${it.qty} — ₹${it.price*it.qty}`
    items.appendChild(div)
    total += it.price*it.qty
  }
  document.getElementById('cart-total').textContent = total.toFixed(2)
}

// UI events
document.getElementById('cart-btn').addEventListener('click', () => {
  document.getElementById('checkout').classList.toggle('hidden')
})

document.getElementById('place-order').addEventListener('click', () => {
  if(Object.keys(cart).length===0){ alert('Cart is empty'); return }
  // Demo: show order summary and clear cart
  alert('Order placed (demo). Total: ₹' + document.getElementById('cart-total').textContent)
  cart = {}
  updateCartUI()
  document.getElementById('checkout').classList.add('hidden')
})

loadProducts()
