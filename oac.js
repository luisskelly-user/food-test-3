var swiper = new Swiper(".mySwiper", {
  loop: true,
  navigation: {
    nextEl: "#next",
    prevEl: "#prev",
  },
});
const cardIcon = document.querySelector('.card-icon');
const cartTap = document.querySelector('.cart-tap');
const closeBtn = document.querySelector('.close-btn');
const cardList = document.querySelector('.card-list');
const cartList = document.querySelector('.cart-list');
const cartTotal = document.querySelector('.card-total');
const cardvalue = document.querySelector('.card-value')
const hamburger = document.querySelector('.hamburger')
const mobileMenu = document.querySelector('.Mobile-Menu')
const bars = document.querySelector('.fa-bars')

cardIcon.addEventListener('click', () => cartTap.classList.add('cart-tap-active'));
closeBtn.addEventListener('click', () => cartTap.classList.remove('cart-tap-active'));
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('Mobile-Menu-active');
  bars.classList.toggle('fa-xmark');
});


let productlist = [];
let cartProdect = [];

// ✅ Fixed: Corrected selector and calculation
const uptotal = () => {
  let totalprice = 0;
  let totalquantity = 0;

  document.querySelectorAll('.item').forEach(item => {
    const quality = parseInt(item.querySelector('.quality-value').textContent)
    const price = parseFloat(item.querySelector('.item-total').textContent.replace('$', '')); // Fixed: should be item-total
    totalprice += price;
    totalquantity += quality
  });
  
  cartTotal.textContent = `$${totalprice.toFixed(2)}`;
  cardvalue.textContent = totalquantity
}

// ✅ show all product cards
const showCard = () => {
  productlist.forEach(product => {
    const ordercard = document.createElement('div');
    ordercard.classList.add('order-card');
    ordercard.innerHTML = `
      <div class="card-image">
        <img src="${product.image}">
      </div>
      <h4>${product.name}</h4>
      <h4 class="price">${product.price}</h4>
      <a href="#" class="btn card-btn">Add to cart</a>
    `;
    cardList.appendChild(ordercard);

    // ✅ fix selector (need . before class name)
    const cardBtn = ordercard.querySelector('.card-btn');
    cardBtn.addEventListener('click', (e) => { 
      e.preventDefault();
      addToCart(product); 
    });
  });
};

// ✅ add selected product to cart
const addToCart = (product) => {
  const exitingProdect = cartProdect.find(item => item.id === product.id);
  if(exitingProdect){
    alert('Item is already in your card!');
    return;
  }
  
  cartProdect.push(product);
  let quality = 1;
  let price = parseFloat(product.price.replace('$', ''));

  const cartitem = document.createElement('div');
  cartitem.classList.add('item');
  cartitem.innerHTML = `
    <div class="item-image">
      <img src="${product.image}" alt="">
    </div>
    <div class="detail">
      <h4>${product.name}</h4>
      <h4 class="item-total">$${(price * quality).toFixed(2)}</h4>
    </div>
    <div class="flex">
      <a href="#" class="quality-btn minus">
        <i class="fa-solid fa-minus"></i>
      </a>
      <h4 class="quality-value">${quality}</h4>
      <a href="#" class="quality-btn plus">
        <i class="fa-solid fa-plus"></i>
      </a>
    </div>
  `;
  
  cartList.appendChild(cartitem);
  
  const plusBTn = cartitem.querySelector('.plus');
  const qualityValue = cartitem.querySelector('.quality-value');
  const itemTotal = cartitem.querySelector('.item-total');
  const minusBtn = cartitem.querySelector('.minus');
  
  plusBTn.addEventListener('click', (e) => {
    e.preventDefault();
    quality++;
    qualityValue.textContent = quality;
    itemTotal.textContent = `$${(price * quality).toFixed(2)}`;
    uptotal();
  });
  
  minusBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if(quality > 1){
      quality--;
      qualityValue.textContent = quality;
      itemTotal.textContent = `$${(price * quality).toFixed(2)}`;
      uptotal();
    } else {
      // Improved removal with animation
      cartitem.classList.add('item-slide-out');
      setTimeout(() => {
        cartitem.remove();
        cartProdect = cartProdect.filter(item => item.id !== product.id);
        uptotal();
      }, 300);
    }
  });
  
  uptotal(); // Update total when adding new item
};

// ✅ load data from JSON
const initApp = () => {
  fetch('prodects.json') // Note: typo in filename? Should probably be 'products.json'
    .then(response => response.json())
    .then(data => {
      productlist = data;
      showCard(); // show products on page
    })
    .catch(error => {
      console.error('Error loading products:', error);
    });
};

initApp();