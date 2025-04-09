// Clase para manejar el carrito
class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.updateCartCount();
    }

    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                ...product,
                quantity: quantity
            });
        }
        
        this.saveCart();
        this.updateCartCount();
        showNotification(`${product.name} agregado al carrito`);
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        renderCartItems();
    }

    updateQuantity(productId, newQuantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = newQuantity;
            this.saveCart();
            renderCartItems();
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.updateCartCount();
    }

    getTotalItems() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const totalItems = this.getTotalItems();
        
        countElements.forEach(element => {
            element.textContent = totalItems;
        });
    }
}

// Instancia global del carrito
const cart = new Cart();

// Productos de ejemplo
const products = [
    {
        id: 1,
        name: "Batman: The Dark Knight Returns",
        price: 24.99,
        originalPrice: 29.99,
        image: "images/product1.jpg",
        category: "Cómics"
    },
    {
        id: 2,
        name: "Spider-Man Figura de Acción",
        price: 39.99,
        image: "images/product2.jpg",
        category: "Figuras"
    },
    {
        id: 3,
        name: "Watchmen Edición Deluxe",
        price: 49.99,
        image: "images/product3.jpg",
        category: "Cómics"
    },
    {
        id: 4,
        name: "Iron Man Mark LXXXV Figura",
        price: 59.99,
        image: "images/product4.jpg",
        category: "Figuras"
    },
    {
        id: 5,
        name: "The Walking Dead Vol. 1",
        price: 19.99,
        image: "images/product5.jpg",
        category: "Cómics"
    },
    {
        id: 6,
        name: "Wonder Woman Figura",
        price: 39.99,
        originalPrice: 45.99,
        image: "images/product6.jpg",
        category: "Figuras"
    },
    {
        id: 7,
        name: "Saga Vol. 1",
        price: 24.99,
        image: "images/product7.jpg",
        category: "Cómics"
    },
    {
        id: 8,
        name: "Black Panther Figura",
        price: 49.99,
        image: "images/product8.jpg",
        category: "Figuras"
    }
];

// Funciones de utilidad
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Configurar botones "Agregar al carrito"
function setupAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                let quantity = 1;
                
                // Buscar selector de cantidad en la página de detalle
                const quantityInput = this.closest('.product-actions')?.querySelector('.quantity-input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value) || 1;
                }
                
                cart.addItem(product, quantity);
            }
        });
    });
}

// Configurar botones "Comprar ahora"
function setupBuyNowButtons() {
    document.querySelectorAll('.buy-now').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.dataset.productId);
            const product = products.find(p => p.id === productId);
            
            if (product) {
                let quantity = 1;
                const quantityInput = this.closest('.product-actions')?.querySelector('.quantity-input');
                if (quantityInput) {
                    quantity = parseInt(quantityInput.value) || 1;
                }
                
                cart.clearCart();
                cart.addItem(product, quantity);
                window.location.href = 'cart.html';
            }
        });
    });
}

// Renderizar items del carrito
function renderCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartSummaryContainer = document.querySelector('.cart-summary');
    
    if (cartItemsContainer) {
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        } else {
            cartItemsContainer.innerHTML = cart.items.map(item => `
                <div class="cart-item" data-product-id="${item.id}">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="item-info">
                        <h3>${item.name}</h3>
                        <div class="price">$${item.price.toFixed(2)}</div>
                        <div class="item-actions">
                            <div class="quantity-selector-cart">
                                <button class="qty-minus"><i class="fas fa-minus"></i></button>
                                <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                                <button class="qty-plus"><i class="fas fa-plus"></i></button>
                            </div>
                            <button class="btn btn-danger remove-item">Eliminar</button>
                        </div>
                    </div>
                </div>
            `).join('');
        }
    }
    
    if (cartSummaryContainer) {
        const subtotal = cart.getTotalPrice();
        const shipping = subtotal > 50 ? 0 : 5.99;
        const total = subtotal + shipping;
        
        cartSummaryContainer.innerHTML = `
            <h3>Resumen del Pedido</h3>
            <div class="summary-details">
                <div class="summary-row">
                    <span>Subtotal (${cart.getTotalItems()} items)</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </div>
                <div class="summary-row">
                    <span>Envío</span>
                    <span>${shipping === 0 ? 'Gratis' : '$' + shipping.toFixed(2)}</span>
                </div>
                <div class="summary-row total">
                    <span>Total</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
            </div>
            <button class="btn btn-primary checkout-btn">Proceder al Pago</button>
            <a href="catalog.html" class="btn btn-outline">Seguir Comprando</a>
        `;
    }
}

// Configurar eventos del carrito
function setupCartEvents() {
    // Botones de cantidad
    document.querySelectorAll('.qty-minus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.nextElementSibling;
            if (input.value > 1) {
                input.value = parseInt(input.value) - 1;
                updateCartItemQuantity(this);
            }
        });
    });
    
    document.querySelectorAll('.qty-plus').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            input.value = parseInt(input.value) + 1;
            updateCartItemQuantity(this);
        });
    });
    
    // Cambios en el input de cantidad
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            if (this.value < 1) this.value = 1;
            updateCartItemQuantity(this);
        });
    });
    
    // Botones eliminar
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.closest('.cart-item').dataset.productId);
            cart.removeItem(productId);
        });
    });
    
    // Botón proceder al pago
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            window.location.href = 'checkout.html';
        });
    }
}

function updateCartItemQuantity(element) {
    const cartItem = element.closest('.cart-item');
    const productId = parseInt(cartItem.dataset.productId);
    const quantity = parseInt(cartItem.querySelector('.quantity-input').value);
    
    cart.updateQuantity(productId, quantity);
}

// Configurar página de detalle de producto
function setupProductDetailPage() {
    // Cambiar imagen principal al hacer clic en miniaturas
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.addEventListener('click', function() {
            const mainImage = document.getElementById('mainImage');
            const newSrc = this.src.replace('-thumb', '-lg');
            mainImage.src = newSrc;
            
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Selector de cantidad
    document.querySelector('.qty-minus')?.addEventListener('click', function() {
        const input = this.nextElementSibling;
        if (input.value > 1) {
            input.value = parseInt(input.value) - 1;
        }
    });

    document.querySelector('.qty-plus')?.addEventListener('click', function() {
        const input = this.previousElementSibling;
        input.value = parseInt(input.value) + 1;
    });

    // Validar entrada de cantidad
    document.querySelector('.quantity-input')?.addEventListener('change', function() {
        if (this.value < 1) this.value = 1;
    });

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.getElementById(tabId).classList.add('active');
            this.classList.add('active');
        });
    });
}

// Inicialización cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', function() {
    setupAddToCartButtons();
    setupBuyNowButtons();
    
    if (document.querySelector('.product-detail')) {
        setupProductDetailPage();
    }
    
    if (document.querySelector('.cart')) {
        renderCartItems();
        setupCartEvents();
    }
    
    // Actualizar contador del carrito en todas las páginas
    cart.updateCartCount();
});