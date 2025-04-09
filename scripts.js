// Función para mostrar los productos en el carrito
function renderCarrito() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
    const contenedorCarrito = document.getElementById('carritoContenido');
    contenedorCarrito.innerHTML = ''; // Limpiar contenido existente
    
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = '<p>No hay productos en el carrito</p>';
    } else {
        carrito.forEach(item => {
            const div = document.createElement('div');
            div.className = 'producto';
            div.innerHTML = `
                <img src="${item.imagen}" alt="${item.nombre}">
                <h3>${item.nombre}</h3>
                <span>${item.precio} USD</span>
            `;
            contenedorCarrito.appendChild(div);
        });
    }
}

// Llamar la función para renderizar el carrito si estamos en la página del carrito
if (window.location.pathname.includes('carrito.html')) {
    renderCarrito();
}
