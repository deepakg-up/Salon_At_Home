document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("search-input");
  const clearIcon = document.getElementById("clear-icon");

  searchInput.addEventListener("input", () => {
    clearIcon.style.display = searchInput.value ? "block" : "none";
  });

  clearIcon.addEventListener("click", () => {
    searchInput.value = "";
    clearIcon.style.display = "none";
    searchInput.focus();
    filter();
  });
});


// =========== Add to cart in LocalStorage ===========


const addToCartBtn = document.querySelectorAll(".pkg-btn");
let cartContent = document.querySelector(".cart-details");

document.addEventListener("DOMContentLoaded", () => {
  const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];
  savedCart.forEach((item) => renderCartItem(item));
  updatePrice();

  addToCartBtn.forEach((btn) => {
    const item = btn.closest(".pkg-container");
    const itemTitle = item.querySelector(".pkg-title").textContent;
    const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    const isAdded = savedCart.some((cartItem) => cartItem.title === itemTitle);

    if (isAdded) {
      btn.textContent = 'Added';
      btn.style.background = '#f2f2f2';
      btn.style.color = 'rgba(0, 0, 0, 0.3)';
      btn.style.borderColor = 'rgba(227, 227, 227)';
    }
  });
});

addToCartBtn.forEach((btn) => {
  btn.addEventListener("click", (event) => {
    btn.textContent = 'Added';
    btn.style.background = '#f2f2f2';
    btn.style.color = 'rgba(0, 0, 0, 0.3)';
    btn.style.borderColor = 'rgba(227, 227, 227)';

    const item = event.target.closest(".pkg-container");
    addToCart(item);
    saveCartToLocalStorage();
  });
});

const addToCart = (item) => {
  let productTitle = item.querySelector(".pkg-title").textContent;
  let productPrice = item.querySelector(".pkg-main-price").textContent;
  let productDesciption = item.querySelector('.pkg-description').textContent;

  const cartItems = cartContent.querySelectorAll(".cart-detail-heading");

  for (let item of cartItems) {
    if (item.textContent === productTitle) {
      alert("This item is already in your cart");
      return;
    }
  }

  for (let cartItem of cartItems) {
    if (cartItem.textContent === productTitle) {
      const quantityElement = cartItem.closest(".cart-detail")
      updatePrice();
      saveCartToLocalStorage();
      return;
    }
  }

  const cartItem = {
    title: productTitle,
    price: productPrice,
    quantity: 1,
    description: productDesciption,
  };

  renderCartItem(cartItem);
  saveCartToLocalStorage();
  updatePrice();
};

const renderCartItem = (cartItem) => {
  const cartBox = document.createElement("div");
  cartBox.className = "cart-detail";
  cartBox.innerHTML = `
    <h6 class="cart-detail-heading">${cartItem.title}</h6>
    <div class="cart-detail-quantity">
      <span id="decrement">-</span>
      <span class="number">${cartItem.quantity}</span>
      <span id="increment">+</span>
    </div>
    <p class="cart-detail-price text-center">${cartItem.price}</p>
    <p class="cart-detail-description">${cartItem.description}</p>
  `;

  cartContent.appendChild(cartBox);

  cartBox.querySelector(".cart-detail-quantity").addEventListener("click", (event) => {
    const target = event.target;
    const quantityElement = cartBox.querySelector(".number");
    const priceElement = cartBox.querySelector(".cart-detail-price");
    const unitPrice = parseFloat(cartItem.price.replace("₹", ""));

    if (target.id === "decrement") {
      if (quantityElement.textContent > 1) {
        quantityElement.textContent = parseInt(quantityElement.textContent) - 1;
        priceElement.textContent = `₹${(unitPrice * parseInt(quantityElement.textContent))}`;
        updatePrice();
      } else {
        cartBox.remove();
        updatePrice();
        location.reload();
      }

    }

    if (target.id === "increment") {
      console.log("increment clicked");      
      if (quantityElement.textContent < 5) {
        quantityElement.textContent = parseInt(quantityElement.textContent) + 1;
        priceElement.textContent = `₹${(unitPrice * parseInt(quantityElement.textContent))}`;
        updatePrice();
      } else {
        alert("You can't add more than 5 items");
      };

    }
    saveCartToLocalStorage();
  });
};


const saveCartToLocalStorage = () => {
  const cartItems = [];
  document.querySelectorAll(".cart-detail").forEach((cartBox) => {
    const title = cartBox.querySelector(".cart-detail-heading").textContent;
    const price = cartBox.querySelector(".cart-detail-price").textContent;
    const quantity = cartBox.querySelector(".number").textContent;
    const description = cartBox.querySelector(".cart-detail-description").textContent;

    cartItems.push({ title, price, quantity: parseInt(quantity), description });
    console.log(cartItems);
    
  });

  localStorage.setItem("cartData", JSON.stringify(cartItems));
};


let updatePrice = () => {
  let total = 0;
  let totalPriceElement = document.querySelectorAll(".cart-total-rupees");
  let cartBoxs = document.querySelectorAll(".cart-detail");
  let noItems = document.getElementById("no-items");
  let showItems = document.getElementById("show");
  let mobileCart = document.querySelector('.mobile-view-cart')

  cartBoxs.forEach((item) => {
    let priceElement = item.querySelector(".cart-detail-price");
    let price = priceElement.textContent.replace("₹", "");
    total += parseInt(price)
  });

  totalPriceElement.forEach(ele => {
    ele.textContent = total;
  })

  // ---- hide/show -----
  if (cartBoxs.length > 0) {
    noItems.classList.add("no-items");
    showItems.classList.add("show");
    mobileCart.style.display = 'block'
  } else {
    noItems.classList.remove("no-items");
    showItems.classList.remove("show");
    mobileCart.style.display = 'none'
  }

  addToCartBtn.forEach((btn) => {
    const item = btn.closest(".pkg-container");
    const itemTitle = item.querySelector(".pkg-title").textContent;
    const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    const isAdded = savedCart.some((cartItem) => cartItem.title === itemTitle);

    if (!isAdded) {
      btn.textContent = 'Add';
      btn.style.background = '';
      btn.style.color = '';
      btn.style.borderColor = '';
    }
  });
};


// ========== cart End ==========



// ========== Search Functionality ==========



let filter = () => {
  let searchValue = document.getElementById("search-input").value.toUpperCase();
  let pkgContainer = document.querySelectorAll(".pkg-container");
  let firstMatch = null;

  for (let i = 0; i < pkgContainer.length; i++) {
    let title = pkgContainer[i].querySelector(".pkg-title");
    let txtValue = title.textContent || title.innerText;
    if (txtValue.toUpperCase().indexOf(searchValue) > -1) {
      pkgContainer[i].style.display = "";
      if (!firstMatch) {
        firstMatch = pkgContainer[i];
      }
    } else {
      pkgContainer[i].style.display = "none";
    }
  }

  if (firstMatch) {
    firstMatch.scrollIntoView({ behavior: 'smooth' });
  }
}


// ========== Service Popup ==========

let servicePopup = document.querySelector('.popup-service-section');
let popupMenuBtn = document.querySelector('.menuBtn');
let popupCancleBtn = document.querySelector('.cancleBtn');
let serviceItems = document.querySelectorAll('.service-item')


popupMenuBtn.addEventListener('click', () => {
  servicePopup.style.display = 'flex'
  popupMenuBtn.style.display = 'none'
})

popupCancleBtn.addEventListener('click', () => {
  servicePopup.style.display = 'none'
  popupMenuBtn.style.display = 'block'
})

serviceItems.forEach(item => {
  item.addEventListener('click', () => {
    servicePopup.style.display = 'none'
    popupMenuBtn.style.display = 'block'
  })
})