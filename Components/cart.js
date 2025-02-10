const step1 = document.querySelector('.step1');
const step2 = document.querySelector('.step2');
const continueBtn = document.querySelector('.continue-btn');
const verifyBtn = document.querySelector('.verify-btn');
const phoneInput = document.querySelector(".login-inputs input");
const otpInputs = document.querySelectorAll(".otp-boxes input");
const verifyNumber = document.querySelectorAll('.verify-number');
const cancleBtn = document.querySelectorAll('.login-cancle-btn');
const loginPopup = document.getElementById('loginPopup')
const loginBtn = document.getElementById('login');
const afterLogin = document.querySelector('.after-login');
const loginCart = document.querySelector('.cart-login-tab');
const locationPopup = document.getElementById('add-location');
const selectAddressBtn = document.querySelector('.select-address');
const userAddress = document.querySelector('.userAddress');



document.addEventListener('DOMContentLoaded', () => {
    loginPopup.style.display = 'none'
    afterLogin.style.display = 'none'
    locationPopup.style.display= 'none'
    slotBtn.style.display = 'none';
    selectPayBtn.style.display = 'none'
    loginBtn.addEventListener('click', () => {
        loginPopup.style.display = 'flex'
    });
});


// ============== During login ==================

loginBtn.addEventListener('click', () => {
    step2.style.display = 'none'

    const isPhoneValid = () => {
        return phoneInput.value.trim().length === 10 && !isNaN(phoneInput.value);
    };

    phoneInput.addEventListener("input", () => {
        if (phoneInput.value.length > 10) {
            phoneInput.value = phoneInput.value.slice(0, 10);
        }
        updateContinueButtonState();
    });

    const updateContinueButtonState = () => {
        continueBtn.disabled = !(isPhoneValid());
    };

    continueBtn.addEventListener('click', () => {
        step1.style.display = 'none';
        step2.style.display = 'block'; 
        verifyNumber.forEach(num => {
            num.textContent = `+91 ${phoneInput.value}`
        })       
    })

    otpInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            const value = e.target.value;

            if (value.length > 1) {
                e.target.value = value.slice(0, 1);
            }

            if (value && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
            updateButtonState();
        });

        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace") {
                if (!e.target.value && index > 0) {
                otpInputs[index - 1].focus();
                }
            } else if (e.key >= "0" && e.key <= "9") {
                e.preventDefault();
                e.target.value = e.key;
                if (index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
                }
            }
            updateButtonState();
        });
    });
});

const updateButtonState = () => {
    const allFilled = Array.from(otpInputs).every(input => input.value.trim() !== "");
    verifyBtn.disabled = !allFilled;
};

cancleBtn.forEach(btn => {
    btn.addEventListener('click', () => {
        loginPopup.style.display = 'none'
        locationPopup.style.display = 'none'
    })
});

verifyBtn.addEventListener('click', () => {
    afterLogin.style.display = 'flex';
    loginCart.style.display = 'none';
    loginPopup.style.display = 'none';
});


// ============== After login ==================

const recentLocation = document.querySelectorAll('.recent-location');
const addressBtn = document.querySelector('.select-address');
const locationBox = document.querySelector('.location-option');
const slotBtn = document.querySelector('.select-slot');
const slotBox = document.querySelector('.slot-option');  
const selectPayBtn = document.querySelector('.select-payment');
const paymentBox = document.querySelector('.payment-option');


selectAddressBtn.addEventListener('click', () => {
    locationPopup.style.display = 'flex';
    slotBox.style.display = 'none';
    paymentBox.style.display = 'none'
});

recentLocation.forEach((location) => {
    location.addEventListener('click', () => {
        userAddress.textContent = location.lastElementChild.textContent;
        selectAddressBtn.style.display = 'none';
        locationBox.style.display = 'none';
        slotBox.style.display = 'flex';
        slotBtn.style.display = 'block';
    });
});

slotBtn.addEventListener('click', () => {
    locationPopup.style.display = 'flex';
    slotBox.style.display = 'flex';
});


// ============== Daily date and day update ===============

// Function to get day name
function getDayName(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

function updateDates() {
    const today = new Date();
    const dateElements = [
        { day: document.getElementById('day1'), date: document.getElementById('date1') },
        { day: document.getElementById('day2'), date: document.getElementById('date2') },
        { day: document.getElementById('day3'), date: document.getElementById('date3') }
    ];

    for (let i = 0; i < dateElements.length; i++) {
        const currentDate = new Date();
        currentDate.setDate(today.getDate() + i); 
        dateElements[i].day.textContent = getDayName(currentDate); 
        dateElements[i].date.textContent = currentDate.getDate(); 
    }
}

updateDates();


// ============== Time Slot Tab ===============

const dateTabs = document.querySelectorAll('.tab');
const timeContainer = document.querySelectorAll('.time-slot');
const timeSlots = document.querySelectorAll('.time');
const checkoutBtn = document.querySelector('.checkoutBtn button');
const timeSlot = document.querySelector('.timeSlot');

let selectedDate = null;
let selectedTime = null;

// ========== Format Date =========

function formatDate(dateElement) {
    const day = dateElement.querySelector('.day').textContent;
    const date = dateElement.querySelector('.date').textContent;
    const month = new Date().toLocaleString('default', { month: 'short' }); 
    return `${day}, ${month} ${date}`;
}

// ========== Format Time =========

function formatTime(timeElement) {
    return timeElement.querySelector('.time-value').textContent.trim();
}

dateTabs.forEach((tab, index) => {
    tab.addEventListener('click', () => {
        dateTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        timeContainer.forEach(slot => slot.classList.remove('active'));
        timeContainer[index].classList.add('active');

        selectedDate = formatDate(tab);
    });
});

timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
        timeSlots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        selectedTime = formatTime(slot);
        checkoutBtn.disabled = false;
    });
});

checkoutBtn.addEventListener('click', () => {
    const formattedString = `${selectedDate} - ${selectedTime}`;
    timeSlot.textContent = formattedString;
    selectPayBtn.style.display = 'block'
    slotBtn.style.display = 'none'
    slotBox.style.display = 'none'
    paymentBox.style.display = 'flex'
});

selectPayBtn.addEventListener('click', () => {
    locationPopup.style.display = 'flex';
    paymentBox.style.display = 'flex'
})








// ============== Local Storage start ==============


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
    document.querySelector(".cart-details").appendChild(cartBox);

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
          }
    
        }
    
        if (target.id === "increment") {     
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

  
document.addEventListener("DOMContentLoaded", () => {
    const savedCart = JSON.parse(localStorage.getItem("cartData")) || [];
    savedCart.forEach((item) => renderCartItem(item));
    updatePrice();
});

const saveCartToLocalStorage = () => {
    const cartItems = [];
    document.querySelectorAll(".cart-detail").forEach((cartBox) => {
      const title = cartBox.querySelector(".cart-detail-heading").textContent;
      const price = cartBox.querySelector(".cart-detail-price").textContent;
      const quantity = cartBox.querySelector(".number").textContent;
      const description = cartBox.querySelector(".cart-detail-description").textContent;
  
      cartItems.push({ title, price, quantity: parseInt(quantity), description });
    });
  
    localStorage.setItem("cartData", JSON.stringify(cartItems));
};
  
let updatePrice = () => {
    let total = 0;
    let totalPriceElement = document.querySelectorAll(".cart-total-rupees");
    let cartBoxs = document.querySelectorAll(".cart-detail");
  
    cartBoxs.forEach((item) => {
      let priceElement = item.querySelector(".cart-detail-price");
      let price = priceElement.textContent.replace("₹", "");
      total += parseInt(price)
    });

    totalPriceElement.forEach(ele => {
        ele.textContent = total;
    })
}

// ============== Local Storage End ==================



// =============== Location Search ===========

document.addEventListener('DOMContentLoaded', () => {
    const searchContainers = document.querySelectorAll('.search-container');

    searchContainers.forEach(container => {
        const inputbox = container.querySelector('.search-input');
        const clearBtn = container.querySelector('.clear-icon');

        inputbox.addEventListener('input', () => {
            clearBtn.style.display = inputbox.value ? 'block' : 'none';
        });

        clearBtn.addEventListener('click', () => {
            inputbox.value = '';
            clearBtn.style.display = 'none';
            inputbox.focus();
        });
    });
});
