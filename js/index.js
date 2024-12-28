import products from "./database.js";

const formDropdown = document.querySelector(".form__select-dropdown");
const productCard = document.querySelector(".product-card");
const productCardHeaderInfo = productCard.querySelector(".product-card__header-info");
const productCardDescription = productCard.querySelector(".product-card__description");
const productCardBuyButton = productCard.querySelector(".product-card__buy-button");
const productCardImage = productCard.querySelector(".product-card__header img");

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

        categoryProducts.forEach((product) => {
            const productEntry = document.createElement("div");
            productEntry.classList.add("product-section__entry");

            const productImg = document.createElement("img");
            productImg.src = `./public/${product.icon}`;
            productImg.width = 25;

            const productText = document.createElement("p");
            productText.classList.add("product-section__paragraph");
            productText.innerHTML = `${product.name.charAt(0).toUpperCase() + product.name.slice(1)} 
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

const formDropdownButton = document.querySelector(".form__select-button");
let dropdownState = false;

// Toggle dropdown visibility
const toggleDropdown = () => {
    dropdownState = !dropdownState;
    formDropdown.style.display = dropdownState ? "block" : "none";
};

formDropdownButton.addEventListener("click", toggleDropdown);
