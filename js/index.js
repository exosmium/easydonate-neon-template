import products from "./database.js";

const formDropdown = document.querySelector(".form__select-dropdown");
const productCard = document.querySelector(".product-card");
const productCardHeaderInfo = productCard.querySelector(".product-card__header-info");
const productCardDescription = productCard.querySelector(".product-card__description");
const productCardBuyButton = productCard.querySelector(".product-card__buy-button");
const productCardImage = productCard.querySelector(".product-card__header img");
const productButton = document.querySelector(".product-button");
const usernameInput = document.querySelector(".username-input");
const emailInput = document.querySelector(".email-input");

// Function to check if form inputs are filled
const checkFormInputs = () => {
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    
    if (username && email) {
        productButton.disabled = false;
        productButton.style.opacity = "1";
    } else {
        productButton.disabled = true;
        productButton.style.opacity = "0.5";
    }
};

const paymentPopup = document.getElementById("paymentPopup");
const closePopupButton = document.getElementById("closePopup");

productButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleDropdown();
});

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


// Add input event listeners
usernameInput.addEventListener("input", checkFormInputs);
emailInput.addEventListener("input", checkFormInputs);

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

        categoryProducts.forEach((product, index) => {
            const productEntry = document.createElement("div");
            productEntry.classList.add("product-section__entry");
            
            // Select first product by default
            if (index === 0) {
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
                toggleDropdown();

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
};

// Initialize product dropdown
loadProducts();

// Toggle dropdown visibility
const toggleDropdown = () => {
    if (!productButton.disabled) {
        dropdownState = !dropdownState;
        formDropdown.style.display = dropdownState ? "block" : "none";
    }
};

let dropdownState = false;
productButton.addEventListener("click", (e) => {
    e.preventDefault();
    toggleDropdown();
});