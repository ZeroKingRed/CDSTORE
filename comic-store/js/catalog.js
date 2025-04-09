// Datos de productos (puedes mover esto a script.js si prefieres)
const products = [
    {
        id: 1,
        name: "Batman: The Dark Knight Returns",
        price: 24.99,
        originalPrice: 29.99,
        image: "images/product1.jpg",
        category: "Cómics",
        publisher: "DC Comics",
        rating: 4.5,
        dateAdded: "2023-01-15"
    },
    {
        id: 2,
        name: "Spider-Man Figura de Acción",
        price: 39.99,
        image: "images/product2.jpg",
        category: "Figuras",
        publisher: "Marvel",
        rating: 4.2,
        dateAdded: "2023-02-20"
    },
    {
        id: 3,
        name: "Watchmen Edición Deluxe",
        price: 49.99,
        image: "images/product3.jpg",
        category: "Cómics",
        publisher: "DC Comics",
        rating: 4.8,
        dateAdded: "2023-01-10"
    },
    {
        id: 4,
        name: "Iron Man Mark LXXXV Figura",
        price: 59.99,
        image: "images/product4.jpg",
        category: "Figuras",
        publisher: "Marvel",
        rating: 4.7,
        dateAdded: "2023-03-05"
    },
    {
        id: 5,
        name: "The Walking Dead Vol. 1",
        price: 19.99,
        image: "images/product5.jpg",
        category: "Cómics",
        publisher: "Image Comics",
        rating: 4.3,
        dateAdded: "2023-02-15"
    },
    {
        id: 6,
        name: "Wonder Woman Figura",
        price: 39.99,
        originalPrice: 45.99,
        image: "images/product6.jpg",
        category: "Figuras",
        publisher: "DC Comics",
        rating: 4.1,
        dateAdded: "2023-03-10"
    },
    {
        id: 7,
        name: "Saga Vol. 1",
        price: 24.99,
        image: "images/product7.jpg",
        category: "Cómics",
        publisher: "Image Comics",
        rating: 4.9,
        dateAdded: "2023-01-25"
    },
    {
        id: 8,
        name: "Black Panther Figura",
        price: 49.99,
        image: "images/product8.jpg",
        category: "Figuras",
        publisher: "Marvel",
        rating: 4.4,
        dateAdded: "2023-02-28"
    },
    {
        id: 9,
        name: "Funko Pop! Batman",
        price: 14.99,
        image: "images/product9.jpg",
        category: "Coleccionables",
        publisher: "DC Comics",
        rating: 4.0,
        dateAdded: "2023-03-15"
    },
    {
        id: 10,
        name: "Camiseta Spider-Man",
        price: 22.99,
        image: "images/product10.jpg",
        category: "Merchandising",
        publisher: "Marvel",
        rating: 3.9,
        dateAdded: "2023-03-01"
    },
    {
        id: 11,
        name: "Poster The Avengers",
        price: 12.99,
        image: "images/product11.jpg",
        category: "Merchandising",
        publisher: "Marvel",
        rating: 4.2,
        dateAdded: "2023-02-10"
    },
    {
        id: 12,
        name: "Estatuilla Hellboy",
        price: 79.99,
        image: "images/product12.jpg",
        category: "Coleccionables",
        publisher: "Dark Horse",
        rating: 4.6,
        dateAdded: "2023-01-30"
    }
];

// Variables para paginación
let currentPage = 1;
const productsPerPage = 8;
let filteredProducts = [...products];

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const pageInfo = document.getElementById('pageInfo');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const priceRange = document.getElementById('priceRange');
const maxPriceValue = document.getElementById('maxPriceValue');
const applyFiltersBtn = document.getElementById('applyFilters');
const resetFiltersBtn = document.getElementById('resetFilters');
const sortSelect = document.getElementById('sortSelect');

// Inicializar el catálogo
function initCatalog() {
    renderProducts();
    setupEventListeners();
}

// Renderizar productos
function renderProducts() {
    // Calcular índices para la paginación
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Limpiar el grid
    productsGrid.innerHTML = '';
    
    // Mostrar mensaje si no hay productos
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No se encontraron productos que coincidan con los filtros.</p>';
        return;
    }
    
    // Renderizar cada producto
    paginatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Badge para ofertas
        if (product.originalPrice) {
            productCard.innerHTML += `<div class="badge">Oferta</div>`;
        }
        
        // Imagen del producto
        productCard.innerHTML += `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
        `;
        
        // Precio
        if (product.originalPrice) {
            productCard.innerHTML += `
                <div class="price">
                    <span class="original-price">$${product.originalPrice.toFixed(2)}</span>
                    <span class="discounted-price">$${product.price.toFixed(2)}</span>
                </div>
            `;
        } else {
            productCard.innerHTML += `
                <div class="price">$${product.price.toFixed(2)}</div>
            `;
        }
        
        // Botón de agregar al carrito
        productCard.innerHTML += `
            <button class="btn btn-secondary add-to-cart" data-product-id="${product.id}">Agregar al carrito</button>
        `;
        
        productsGrid.appendChild(productCard);
    });
    
    // Actualizar información de paginación
    updatePaginationInfo();
}

// Actualizar información de paginación
function updatePaginationInfo() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    pageInfo.textContent = `${currentPage} de ${totalPages}`;
    
    // Deshabilitar botones según corresponda
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages || totalPages === 0;
}

// Filtrar productos
function filterProducts() {
    // Obtener categorías seleccionadas
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked')).map(cb => cb.value);
    
    // Obtener editoriales seleccionadas
    const selectedPublishers = Array.from(document.querySelectorAll('.publisher-filter:checked')).map(cb => cb.value);
    
    // Obtener precio máximo
    const maxPrice = parseInt(priceRange.value);
    
    // Obtener término de búsqueda
    const searchTerm = searchInput.value.toLowerCase();
    
    // Filtrar productos
    filteredProducts = products.filter(product => {
        // Filtrar por categoría
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }
        
        // Filtrar por editorial
        if (selectedPublishers.length > 0 && !selectedPublishers.includes(product.publisher)) {
            return false;
        }
        
        // Filtrar por precio
        if (product.price > maxPrice) {
            return false;
        }
        
        // Filtrar por término de búsqueda
        if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) {
            return false;
        }
        
        return true;
    });
    
    // Ordenar productos
    sortProducts();
    
    // Resetear a la primera página
    currentPage = 1;
    
    // Renderizar productos filtrados
    renderProducts();
}

// Ordenar productos
function sortProducts() {
    const sortValue = sortSelect.value;
    
    switch (sortValue) {
        case 'price-asc':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // 'popular' - orden por defecto (podrías implementar lógica basada en ventas)
            break;
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Paginación
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts();
        }
    });
    
    // Búsqueda
    searchBtn.addEventListener('click', filterProducts);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            filterProducts();
        }
    });
    
    // Filtros
    applyFiltersBtn.addEventListener('click', filterProducts);
    
    resetFiltersBtn.addEventListener('click', () => {
        // Resetear todos los checkboxes
        document.querySelectorAll('.category-filter, .publisher-filter').forEach(cb => {
            cb.checked = true;
        });
        
        // Resetear rango de precio
        priceRange.value = 200;
        maxPriceValue.textContent = '$200';
        
        // Resetear búsqueda
        searchInput.value = '';
        
        // Resetear orden
        sortSelect.value = 'popular';
        
        // Aplicar filtros
        filterProducts();
    });
    
    // Rango de precio
    priceRange.addEventListener('input', () => {
        maxPriceValue.textContent = `$${priceRange.value}`;
    });
    
    // Ordenar
    sortSelect.addEventListener('change', () => {
        sortProducts();
        renderProducts();
    });
}

// Inicializar el catálogo cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initCatalog);