import products from "./database.js";

// DOM Elements
const formDropdown = document.querySelector(".form__select-dropdown");
const productCard = document.querySelector(".product-card");
const productCardHeaderInfo = productCard.querySelector(".product-card__header-info");
const productCardDescription = productCard.querySelector(".product-card__description");
const productCardBuyButton = productCard.querySelector(".product-card__buy-button");
const productCardImage = productCard.querySelector(".product-card__header img");
const productButton = document.querySelector(".product-button");
const serverButton = document.querySelector(".server-button");
const usernameInput = document.querySelector(".username-input");
const emailInput = document.querySelector(".email-input");
const paymentPopup = document.getElementById("paymentPopup");
const closePopupButton = document.getElementById("closePopup");

// State Management
let productDropdownState = false;
let serverDropdownState = false;

// Function to check if username input is filled
const checkFormInputs = () => {
    const username = usernameInput.value.trim();
    const productSelectWrapper = document.querySelector('.product-select');
    
    if (username) {
        // Show product selector
        productButton.disabled = false;
        productSelectWrapper.style.display = 'block';
        productSelectWrapper.style.opacity = '1';
        productSelectWrapper.style.transform = 'translateY(0)';
        
        // Show product card
        productCard.style.display = 'flex';
        productCard.style.opacity = '1';
        productCard.style.transform = 'translateY(0)';
    } else {
        // Hide product selector
        productButton.disabled = true;
        productSelectWrapper.style.display = 'none';
        productSelectWrapper.style.opacity = '0';
        productSelectWrapper.style.transform = 'translateY(-10px)';
        
        // Hide product card
        productCard.style.display = 'none';
        productCard.style.opacity = '0';
        productCard.style.transform = 'translateY(-10px)';
    }
};

// Function to update the product card
const updateProductCard = (product) => {
    // Clear fields before updating
    productCardHeaderInfo.innerHTML = "";
    productCardDescription.innerHTML = "";
    productCardBuyButton.innerHTML = "";

    // Update product card details
    productCardImage.src = `./public/${product.icon}`;
    productCardHeaderInfo.innerHTML = `
        <div class="category-text">
            <p><i class="fas fa-tag"></i> ${product.category}</p>
        </div>
        <h2>${product.name}</h2>
        <p>${product.price}.00 ₽</p>
    `;

    // Handle description if it's an array
    if (Array.isArray(product.description) && product.description.length > 0) {
        productCardDescription.innerHTML = product.description
            .map((line) => `<p>${line}</p>`)
            .join("");
    } else {
        productCardDescription.innerHTML = ``;
    }

    // Update buy button
    productCardBuyButton.innerHTML = `<i class="fas fa-shopping-cart"></i> Купить за ${product.price}.00 ₽`;
    
    // Update product button text
    productButton.innerHTML = `
        <img src="./public/${product.icon}" width="35">
        <h4>${product.name} • <span class="accent-colored">${product.price}.00 ₽</span></h4>
    `;
};

// Function to load products into the dropdown
const loadProducts = () => {
    formDropdown.innerHTML = ""; // Clear dropdown before loading products

    const categorizedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
            acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
    }, {});

    // Find the Кенди product
    let defaultProduct = null;
    for (const categoryProducts of Object.values(categorizedProducts)) {
        defaultProduct = categoryProducts.find(product => product.name === "Кенди");
        if (defaultProduct) break;
    }

    Object.entries(categorizedProducts).forEach(([category, categoryProducts]) => {
        const productSection = document.createElement("div");
        productSection.classList.add("product-section");

        const sectionHeader = document.createElement("div");
        sectionHeader.classList.add("product-section__header");

        const icon = document.createElement("i");
        icon.classList.add("fas", "fa-tag");

        const categoryTitle = document.createElement("p");
        categoryTitle.textContent = category;

        sectionHeader.appendChild(icon);
        sectionHeader.appendChild(categoryTitle);

        const productList = document.createElement("div");
        productList.classList.add("product-section__list");

        categoryProducts.forEach((product) => {
            const productEntry = document.createElement("div");
            productEntry.classList.add("product-section__entry");
            
            // Select Кенди by default
            if (product.name === "Кенди") {
                productEntry.classList.add("selected");
                updateProductCard(product);
            }

            const productImg = document.createElement("img");
            productImg.src = `./public/${product.icon}`;
            productImg.width = 25;

            const productText = document.createElement("p");
            productText.classList.add("product-section__paragraph");
            productText.innerHTML = `${product.name} 
                <span class="product-section__entry-price shadowed-text">${product.price}.00₽</span>`;

            productEntry.addEventListener("click", () => {
                updateProductCard(product);
                toggleProductDropdown();

                // Highlight the selected product
                document.querySelectorAll(".product-section__entry").forEach((entry) => {
                    entry.classList.remove("selected");
                });
                productEntry.classList.add("selected");
            });

            productEntry.appendChild(productImg);
            productEntry.appendChild(productText);
            productList.appendChild(productEntry);
        });

        productSection.appendChild(sectionHeader);
        productSection.appendChild(productList);
        formDropdown.appendChild(productSection);
    });

    // If we found the Кенди product, make sure it's selected
    if (defaultProduct) {
        updateProductCard(defaultProduct);
    }
};

// Toggle product dropdown visibility
const toggleProductDropdown = (e) => {
    if (e) e.preventDefault();
    if (!productButton.disabled) {
        productDropdownState = !productDropdownState;
        formDropdown.style.display = productDropdownState ? "block" : "none";
        
        // Close server dropdown if open
        if (serverDropdownState) {
            serverDropdownState = false;
            if (document.querySelector(".server-select .form__select-dropdown")) {
                document.querySelector(".server-select .form__select-dropdown").style.display = "none";
            }
        }
    }
};

// Toggle server dropdown visibility
const toggleServerDropdown = (e) => {
    if (e) e.preventDefault();
    serverDropdownState = !serverDropdownState;
    if (document.querySelector(".server-select .form__select-dropdown")) {
        document.querySelector(".server-select .form__select-dropdown").style.display = 
            serverDropdownState ? "block" : "none";
    }
    
    // Close product dropdown if open
    if (productDropdownState) {
        productDropdownState = false;
        formDropdown.style.display = "none";
    }
};

// Function to update player count
const updatePlayerCount = async () => {
    try {
        const response = await fetch('https://eu.mc-api.net/v3/server/ping/mc.raisincloud.ru');
        const data = await response.json();
        
        if (data && data.online && data.players) {
            const onlineSpan = document.querySelector('.servers-panel__server-online .accent-colored');
            if (onlineSpan) {
                onlineSpan.textContent = `${data.players.online} из ${data.players.max}`;
            }
        }
    } catch (error) {
        console.error('Failed to fetch server status:', error);
    }
};

// Function to start server status updates
const startServerStatusUpdates = () => {
    updatePlayerCount();
    setInterval(updatePlayerCount, 30000);
};

// Event Listeners
productButton.addEventListener("click", toggleProductDropdown);
serverButton.addEventListener("click", toggleServerDropdown);

// Handle buy button click
productCardBuyButton.addEventListener("click", (e) => {
    e.preventDefault();
    paymentPopup.style.display = "flex";
});

// Close popup when close button is clicked
closePopupButton.addEventListener("click", () => {
    paymentPopup.style.display = "none";
});

// Close popup when clicking outside
paymentPopup.addEventListener("click", (e) => {
    if (e.target === paymentPopup) {
        paymentPopup.style.display = "none";
    }
});

// Close dropdowns when clicking outside
document.addEventListener("click", (e) => {
    if (!e.target.closest(".form__select-wrapper")) {
        formDropdown.style.display = "none";
        if (document.querySelector(".server-select .form__select-dropdown")) {
            document.querySelector(".server-select .form__select-dropdown").style.display = "none";
        }
        productDropdownState = false;
        serverDropdownState = false;
    }
});

// Form input event listeners
usernameInput.addEventListener("input", checkFormInputs);
emailInput.addEventListener("input", checkFormInputs);

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    startServerStatusUpdates();
    
    // Initial form state
    checkFormInputs();
    
    // Clear input fields on page load
    usernameInput.value = '';
    emailInput.value = '';
    
    // Initially hide product card
    productCard.style.display = 'none';
    productCard.style.opacity = '0';
    productCard.style.transform = 'translateY(-10px)';
});