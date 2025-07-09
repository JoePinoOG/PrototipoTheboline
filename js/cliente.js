// Funcionalidad cliente específica
document.addEventListener('DOMContentLoaded', function() {
    // Solo inicializar página cliente
    if (window.location.pathname.includes('cliente.html')) {
        initializeClientDashboard();
    }
});

// Inicializar dashboard cliente
function initializeClientDashboard() {
    loadClientProducts();
    loadClientCart();
    loadClientOrders();
    updateCartCount();
    setupPaymentEventListeners();
}

// Configurar event listeners para el sistema de pago
function setupPaymentEventListeners() {
    // Setup customer form con un delay para asegurar que el DOM esté listo
    setTimeout(() => {
        const customerForm = document.getElementById('checkoutForm');
        if (customerForm) {
            customerForm.removeEventListener('submit', handleCustomerForm);
            customerForm.addEventListener('submit', handleCustomerForm);
        }
        
        // Setup process order button
        const processOrderBtn = document.getElementById('processOrderBtn');
        if (processOrderBtn) {
            processOrderBtn.removeEventListener('click', processPaymentClient);
            processOrderBtn.addEventListener('click', processPaymentClient);
        }
    }, 500);
}

// Array carrito cliente
let clientCart = [];

// Datos pedidos simulados
let clientOrders = [
    {
        id: 'ORD-001',
        date: '2024-12-15',
        status: 'delivered',
        items: [
            { name: 'Zapatillas Nike Air Max', quantity: 1, price: 89990, image: 'productos/DX9632_010_A.jpg' },
            { name: 'Polera Básica Algodón', quantity: 2, price: 19990, image: 'productos/producto1.jpg' }
        ],
        total: 129970
    },
    {
        id: 'ORD-002',
        date: '2024-12-20',
        status: 'processing',
        items: [
            { name: 'Jeans Slim Fit', quantity: 1, price: 45990, image: 'productos/producto3.jpg' }
        ],
        total: 51980
    },
    {
        id: 'ORD-003',
        date: '2024-12-22',
        status: 'shipped',
        items: [
            { name: 'Chaqueta Deportiva', quantity: 1, price: 69990, image: 'productos/producto4.jpg' },
            { name: 'Gorra Snapback', quantity: 1, price: 24990, image: 'productos/gorro.jpg' }
        ],
        total: 100970
    }
];

// Función cargar productos catálogo
function loadClientProducts() {
    // Usar la nueva función que incluye promociones
    loadClientProductsWithPromotions();
    
    // También cargar productos promocionales destacados
    showPromotionalProducts();
}

// Función agregar producto carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Verificar si producto existe
    const existingItem = clientCart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        clientCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartCount();
    loadClientCart();
    
    // Mostrar notificación
    alert(`${product.name} agregado al carrito`);
}

// Función remover producto carrito
function removeFromCart(productId) {
    const index = clientCart.findIndex(item => item.id === productId);
    if (index > -1) {
        clientCart.splice(index, 1);
        updateCartCount();
        loadClientCart();
    }
}

// Función actualizar cantidad carrito
function updateCartQuantity(productId, change) {
    const item = clientCart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            loadClientCart();
        }
    }
}

// Función actualizar contador carrito
function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        const totalItems = clientCart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

// Función cargar elementos carrito
function loadClientCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (clientCart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-state">
                <h3>Tu carrito está vacío</h3>
                <p>Explora nuestro catálogo y encuentra productos increíbles</p>
                <button onclick="showSection('catalogo')">Ver Catálogo</button>
            </div>
        `;
        updateCartSummary();
        return;
    }
    
    cartItems.innerHTML = '';
    
    clientCart.forEach(item => {
        const originalPrice = item.price;
        const discountedPrice = getProductDiscountedPrice(item.id);
        const hasDiscount = discountedPrice < originalPrice;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="item-price">
                    ${hasDiscount ? `<span class="original-price">${formatCLP(originalPrice)}</span>` : ''}
                    <span class="current-price">${formatCLP(discountedPrice)}</span>
                </div>
            </div>
            <div class="quantity-controls">
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, -1)">-</button>
                <span class="quantity-display">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartItems.appendChild(cartItem);
    });
    
    updateCartSummary();
}

// Función actualizar resumen carrito
function updateCartSummary() {
    const subtotalElement = document.getElementById('subtotal');
    const discountElement = document.getElementById('discount');
    const totalElement = document.getElementById('total');
    
    if (!subtotalElement || !totalElement) return;
    
    // Calcular subtotal con precios promocionales individuales
    const subtotal = clientCart.reduce((sum, item) => {
        const discountedPrice = getProductDiscountedPrice(item.id);
        return sum + (discountedPrice * item.quantity);
    }, 0);
    
    const shipping = clientCart.length > 0 ? 5990 : 0;
    
    let additionalDiscount = 0;
    let finalTotal = subtotal + shipping;
    
    // Aplicar descuento adicional si hay código de promoción
    if (appliedPromotion && promotionCode) {
        const discountResult = applyDiscount(clientCart, promotionCode);
        // El descuento adicional se calcula sobre el subtotal ya con descuentos individuales
        additionalDiscount = discountResult.discount;
        finalTotal = subtotal - additionalDiscount + shipping;
    }
    
    subtotalElement.textContent = formatCLP(subtotal);
    if (discountElement) {
        discountElement.textContent = formatCLP(additionalDiscount);
        discountElement.parentElement.style.display = additionalDiscount > 0 ? 'flex' : 'none';
    }
    totalElement.textContent = formatCLP(finalTotal);
}

// Variables para promociones en cliente
let appliedPromotion = null;
let promotionCode = '';

// Función para aplicar código de promoción
function applyPromotionCode() {
    const promoInput = document.getElementById('promoCodeInput');
    if (!promoInput) return;
    
    const code = promoInput.value.trim().toUpperCase();
    if (!code) {
        showNotification('Por favor ingrese un código de promoción', 'error');
        return;
    }
    
    const validation = validatePromotionCode(code);
    if (!validation.valid) {
        showNotification(validation.message, 'error');
        return;
    }
    
    const cartTotal = clientCart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotal < validation.promotion.minPurchase) {
        showNotification(`Compra mínima requerida: ${formatCLP(validation.promotion.minPurchase)}`, 'error');
        return;
    }
    
    appliedPromotion = validation.promotion;
    promotionCode = code;
    updateCartSummary();
    showNotification(`¡Promoción aplicada! ${validation.promotion.description}`, 'success');
}

// Función para remover promoción
function removePromotion() {
    appliedPromotion = null;
    promotionCode = '';
    const promoInput = document.getElementById('promoCodeInput');
    if (promoInput) promoInput.value = '';
    updateCartSummary();
    showNotification('Promoción removida', 'info');
}

// Función cargar pedidos cliente
function loadClientOrders() {
    const ordersContainer = document.getElementById('ordersContainer');
    if (!ordersContainer) return;
    
    if (clientOrders.length === 0) {
        ordersContainer.innerHTML = `
            <div class="empty-state">
                <h3>No tienes compras realizadas</h3>
                <p>Realiza tu primera compra y aparecerá aquí</p>
                <button onclick="showSection('catalogo')">Ver Catálogo</button>
            </div>
        `;
        return;
    }
    
    ordersContainer.innerHTML = '';
    
    clientOrders.forEach(order => {
        const statusText = {
            'delivered': 'Entregado',
            'processing': 'Procesando',
            'shipped': 'Enviado'
        };
        
        const orderCard = document.createElement('div');
        orderCard.className = 'order-card';
        orderCard.innerHTML = `
            <div class="order-header">
                <div>
                    <div class="order-id">Pedido #${order.id}</div>
                    <div class="order-date">${formatDate(order.date)}</div>
                </div>
                <div class="order-status ${order.status}">${statusText[order.status]}</div>
            </div>
            <div class="order-items">
                ${order.items.map(item => `
                    <div class="order-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="order-item-info">
                            <h4>${item.name}</h4>
                            <p>Cantidad: ${item.quantity} - ${formatCLP(item.price)} c/u</p>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="order-total">Total: ${formatCLP(order.total)}</div>
        `;
        ordersContainer.appendChild(orderCard);
    });
}

// Función formatear fecha
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CL', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

// Función filtrar por categoría
function filterProductsByCategory() {
    const categoryFilter = document.getElementById('categoryFilter');
    if (!categoryFilter) return;
    
    const selectedCategory = categoryFilter.value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productInfo = card.querySelector('.product-info h3').textContent;
        const product = products.find(p => p.name === productInfo);
        
        if (selectedCategory === 'todas' || product.category === selectedCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función filtrar por precio
function filterProductsByPrice() {
    const priceFilter = document.getElementById('priceFilter');
    if (!priceFilter) return;
    
    const selectedRange = priceFilter.value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productInfo = card.querySelector('.product-info h3').textContent;
        const product = products.find(p => p.name === productInfo);
        
        let showProduct = true;
        
        if (selectedRange !== 'todos') {
            const price = product.price;
            
            switch (selectedRange) {
                case '0-50000':
                    showProduct = price <= 50000;
                    break;
                case '50000-100000':
                    showProduct = price > 50000 && price <= 100000;
                    break;
                case '100000-200000':
                    showProduct = price > 100000 && price <= 200000;
                    break;
                case '200000+':
                    showProduct = price > 200000;
                    break;
            }
        }
        
        card.style.display = showProduct ? 'block' : 'none';
    });
}

// Función buscar productos
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-info h3').textContent.toLowerCase();
        const productDescription = card.querySelector('.product-description').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productDescription.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función proceder al pago
function proceedToCheckout() {
    if (clientCart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = clientCart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 5990;
    alert(`Funcionalidad de pago - Prototipo\n\nTotal a pagar: ${formatCLP(total)}\n\nEn el sistema real, aquí se procesaría el pago y se generaría la orden.`);
}

// Función editar perfil
function editProfile() {
    alert('Funcionalidad de edición de perfil - Prototipo\n\nEn el sistema real, aquí se abriría un formulario para editar:\n- Información personal\n- Dirección de envío\n- Preferencias de contacto');
}

// Sobrescribir función navegación cliente
function showSection(sectionId) {
    // Ocultar todas secciones
    const sections = document.querySelectorAll('.client-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Remover clase activa enlaces
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Mostrar sección seleccionada
    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }
    
    // Agregar clase activa enlace
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Cargar contenido específico sección
    if (sectionId === 'catalogo') {
        loadClientProducts();
    } else if (sectionId === 'carrito') {
        loadClientCart();
    } else if (sectionId === 'historial') {
        loadClientOrders();
    }
}

// Buscar con tecla Enter
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});

// Funciones disponibles globalmente
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateCartQuantity = updateCartQuantity;
window.filterProductsByCategory = filterProductsByCategory;
window.filterProductsByPrice = filterProductsByPrice;
window.searchProducts = searchProducts;
window.proceedToCheckout = proceedToCheckout;
window.editProfile = editProfile;
window.showSection = showSection;
window.applyPromotionCode = applyPromotionCode;
window.removePromotion = removePromotion;

// Función para cargar productos con promociones
function loadClientProductsWithPromotions() {
    const productsCatalog = document.getElementById('productsCatalog');
    if (!productsCatalog) return;
    
    productsCatalog.innerHTML = '';
    
    // Obtener productos con promociones aplicadas
    const productsWithPromotions = products.map(product => {
        const applicablePromotions = promotions.filter(promotion => {
            if (!promotion.isActive) return false;
            if (new Date() < new Date(promotion.validFrom)) return false;
            if (new Date() > new Date(promotion.validUntil)) return false;
            
            return promotion.applicableCategories.includes(product.category) ||
                   promotion.applicableProducts.includes(product.id);
        });
        
        return {
            ...product,
            hasPromotion: applicablePromotions.length > 0,
            promotions: applicablePromotions
        };
    });
    
    productsWithPromotions.forEach(product => {
        const sizesHtml = product.sizes && product.sizes.length > 0 ? 
            `<div class="product-sizes">Tallas: ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}</div>` : 
            '';
        
        const productCard = document.createElement('div');
        productCard.className = `product-card ${product.hasPromotion ? 'promotion' : ''}`;
        
        let promotionBadge = '';
        let originalPriceHTML = '';
        let discountedPrice = product.price;
        
        if (product.hasPromotion && product.promotions.length > 0) {
            const bestPromotion = product.promotions[0]; // Usar la primera promoción disponible
            
            if (bestPromotion.discountType === 'percentage') {
                const discount = Math.min(
                    product.price * (bestPromotion.discountValue / 100),
                    bestPromotion.maxDiscount
                );
                discountedPrice = product.price - discount;
                promotionBadge = `<div class="promotion-badge">-${bestPromotion.discountValue}%</div>`;
                originalPriceHTML = `<span class="original-price">${formatCLP(product.price)}</span>`;
            } else {
                discountedPrice = product.price - bestPromotion.discountValue;
                promotionBadge = `<div class="promotion-badge">-${formatCLP(bestPromotion.discountValue)}</div>`;
                originalPriceHTML = `<span class="original-price">${formatCLP(product.price)}</span>`;
            }
        }
        
        productCard.innerHTML = `
            ${promotionBadge}
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/280x200/e9ecef/666666?text=${encodeURIComponent(product.name)}';">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="price-container">
                    ${originalPriceHTML}
                    <span class="current-price">${formatCLP(discountedPrice)}</span>
                </div>
                <p class="product-description">${product.description}</p>
                ${sizesHtml}
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;
        
        productsCatalog.appendChild(productCard);
    });
}

// Función para destacar productos en promoción en la página principal
function showPromotionalProducts() {
    const featuredContainer = document.getElementById('featuredProducts');
    if (!featuredContainer) return;
    
    const promotionalProducts = products.filter(product => {
        return promotions.some(promotion => {
            if (!promotion.isActive) return false;
            if (new Date() < new Date(promotion.validFrom)) return false;
            if (new Date() > new Date(promotion.validUntil)) return false;
            
            return promotion.applicableCategories.includes(product.category) ||
                   promotion.applicableProducts.includes(product.id);
        });
    });
    
    if (promotionalProducts.length === 0) {
        featuredContainer.innerHTML = '<p>No hay productos en promoción actualmente.</p>';
        return;
    }
    
    featuredContainer.innerHTML = '';
    
    // Mostrar máximo 6 productos promocionales
    promotionalProducts.slice(0, 6).forEach(product => {
        const applicablePromotion = promotions.find(promotion => {
            if (!promotion.isActive) return false;
            if (new Date() < new Date(promotion.validFrom)) return false;
            if (new Date() > new Date(promotion.validUntil)) return false;
            
            return promotion.applicableCategories.includes(product.category) ||
                   promotion.applicableProducts.includes(product.id);
        });
        
        let discountedPrice = product.price;
        let discountText = '';
        
        if (applicablePromotion) {
            if (applicablePromotion.discountType === 'percentage') {
                const discount = Math.min(
                    product.price * (applicablePromotion.discountValue / 100),
                    applicablePromotion.maxDiscount
                );
                discountedPrice = product.price - discount;
                discountText = `-${applicablePromotion.discountValue}%`;
            } else {
                discountedPrice = product.price - applicablePromotion.discountValue;
                discountText = `-${formatCLP(applicablePromotion.discountValue)}`;
            }
        }
        
        const productCard = document.createElement('div');
        productCard.className = 'featured-product promotion';
        
        productCard.innerHTML = `
            <div class="promotion-badge">${discountText}</div>
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/200x200/e9ecef/666666?text=${encodeURIComponent(product.name)}'; this.style.background='#f8f9fa';"
                 onload="this.style.background='transparent';">
            <div class="product-info">
                <h4>${product.name}</h4>
                <div class="price-container">
                    <span class="original-price">${formatCLP(product.price)}</span>
                    <span class="current-price">${formatCLP(discountedPrice)}</span>
                </div>
                <button class="btn btn-primary" onclick="addToCart(${product.id})">
                    Agregar al Carrito
                </button>
            </div>
        `;
        
        featuredContainer.appendChild(productCard);
    });
}

// Función para ver detalles del producto
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const applicablePromotions = promotions.filter(promotion => {
        if (!promotion.isActive) return false;
        if (new Date() < new Date(promotion.validFrom)) return false;
        if (new Date() > new Date(promotion.validUntil)) return false;
        
        return promotion.applicableCategories.includes(product.category) ||
               promotion.applicableProducts.includes(product.id);
    });
    
    let discountedPrice = product.price;
    let promotionInfo = '';
    
    if (applicablePromotions.length > 0) {
        const promotion = applicablePromotions[0];
        if (promotion.discountType === 'percentage') {
            const discount = Math.min(
                product.price * (promotion.discountValue / 100),
                promotion.maxDiscount
            );
            discountedPrice = product.price - discount;
            promotionInfo = `\n🎉 PROMOCIÓN ACTIVA: ${promotion.description}\nCódigo: ${promotion.code}\nDescuento: ${promotion.discountValue}%`;
        } else {
            discountedPrice = product.price - promotion.discountValue;
            promotionInfo = `\n🎉 PROMOCIÓN ACTIVA: ${promotion.description}\nCódigo: ${promotion.code}\nDescuento: ${formatCLP(promotion.discountValue)}`;
        }
    }
    
    const priceText = applicablePromotions.length > 0 ? 
        `Precio original: ${formatCLP(product.price)}\nPrecio con descuento: ${formatCLP(discountedPrice)}` :
        `Precio: ${formatCLP(product.price)}`;
    
    const sizesText = product.sizes && product.sizes.length > 0 ? 
        `\nTallas disponibles: ${product.sizes.join(', ')}` : '';
    
    alert(`${product.name}\n\n${product.description}\n\n${priceText}\nCategoría: ${product.category}\nStock disponible: ${product.stock}${sizesText}${promotionInfo}`);
}

// Función para calcular el precio con descuento de un producto
function getProductDiscountedPrice(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    const applicablePromotions = promotions.filter(promotion => {
        if (!promotion.isActive) return false;
        if (new Date() < new Date(promotion.validFrom)) return false;
        if (new Date() > new Date(promotion.validUntil)) return false;
        
        return promotion.applicableCategories.includes(product.category) ||
               promotion.applicableProducts.includes(product.id);
    });
    
    if (applicablePromotions.length === 0) return product.price;
    
    const promotion = applicablePromotions[0];
    if (promotion.discountType === 'percentage') {
        const discount = Math.min(
            product.price * (promotion.discountValue / 100),
            promotion.maxDiscount
        );
        return product.price - discount;
    } else {
        return product.price - promotion.discountValue;
    }
}

// Variables para el sistema de pago
let currentPaymentData = {};
let currentPaymentStep = 1;

// Función para abrir modal de pago
function openPaymentModal() {
    const modal = document.getElementById('checkoutModal');
    if (!modal) return;
    
    // Verificar que hay productos en el carrito
    if (clientCart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Calcular totales del carrito
    const cartSubtotal = clientCart.reduce((sum, item) => {
        const discountedPrice = getProductDiscountedPrice(item.id);
        return sum + (discountedPrice * item.quantity);
    }, 0);
    
    const shipping = 5990;
    let additionalDiscount = 0;
    let finalTotal = cartSubtotal + shipping;
    
    // Aplicar descuento adicional si hay código de promoción
    if (appliedPromotion && promotionCode) {
        const discountResult = applyDiscount(clientCart, promotionCode);
        additionalDiscount = discountResult.discount;
        finalTotal = cartSubtotal - additionalDiscount + shipping;
    }
    
    // Preparar datos de pago
    currentPaymentData = {
        items: [...clientCart],
        subtotal: cartSubtotal,
        shipping: shipping,
        additionalDiscount: additionalDiscount,
        total: finalTotal,
        orderId: 'ORD-' + Date.now().toString().slice(-6),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES'),
        customer: 'Cliente Online',
        promotionCode: promotionCode
    };
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Ir al primer paso
    goToPaymentStep(1);
    
    // Cargar datos del cliente
    loadCustomerData();
}

// Función para cerrar modal de pago
function closePaymentModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Resetear formulario
    const customerForm = document.getElementById('customerForm');
    if (customerForm) {
        customerForm.reset();
    }
    
    // Resetear a primer paso
    goToPaymentStep(1);
    
    // Limpiar datos de pago
    currentPaymentData = {};
}

// Alias para cerrar modal (usado en HTML)
function closeCheckoutModal() {
    closePaymentModal();
}

// Navegación entre pasos del modal
function goToPaymentStep(stepNumber) {
    // Ocultar todos los pasos
    document.querySelectorAll('.checkout-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Mostrar el paso seleccionado
    const targetStep = document.getElementById(`checkoutStepContent${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
    }
    
    // Activar indicador de paso
    const stepIndicator = document.getElementById(`checkoutStep${stepNumber}`);
    if (stepIndicator) {
        stepIndicator.classList.add('active');
    }
    
    currentPaymentStep = stepNumber;
}

// Función para ir a paso específico (usada en HTML)
function goToCheckoutStep(stepNumber) {
    goToPaymentStep(stepNumber);
}

// Función para cargar datos del cliente
function loadCustomerData() {
    const customerForm = document.getElementById('checkoutForm');
    if (!customerForm) return;
    
    // Cargar datos guardados del cliente si existen
    const savedCustomer = localStorage.getItem('customerData');
    if (savedCustomer) {
        try {
            const customerData = JSON.parse(savedCustomer);
            document.getElementById('customerName').value = customerData.name || '';
            document.getElementById('customerEmail').value = customerData.email || '';
            document.getElementById('customerPhone').value = customerData.phone || '';
            document.getElementById('customerRUT').value = customerData.rut || '';
            document.getElementById('deliveryAddress').value = customerData.address || '';
            document.getElementById('deliveryMethod').value = customerData.deliveryMethod || '';
        } catch (e) {
            console.error('Error al cargar datos del cliente:', e);
        }
    }
}

// Función para manejar el envío del formulario de datos del cliente
function handleCustomerForm(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const name = document.getElementById('customerName').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const rut = document.getElementById('customerRUT').value.trim();
    const address = document.getElementById('deliveryAddress').value.trim();
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    
    // Validar campos requeridos
    if (!name || !email || !phone || !rut || !address || !deliveryMethod) {
        showNotification('Por favor complete todos los campos', 'error');
        return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Por favor ingrese un email válido', 'error');
        return;
    }
    
    // Actualizar costo de envío basado en método de entrega
    let shippingCost = deliveryMethod === 'delivery' ? 5990 : 0;
    
    // Guardar datos del cliente
    const customerData = { name, email, phone, rut, address, deliveryMethod };
    localStorage.setItem('customerData', JSON.stringify(customerData));
    
    // Actualizar datos de pago
    currentPaymentData.customer = name;
    currentPaymentData.email = email;
    currentPaymentData.phone = phone;
    currentPaymentData.rut = rut;
    currentPaymentData.address = address;
    currentPaymentData.deliveryMethod = deliveryMethod;
    currentPaymentData.shipping = shippingCost;
    
    // Recalcular total con el nuevo costo de envío
    const cartSubtotal = clientCart.reduce((sum, item) => {
        const discountedPrice = getProductDiscountedPrice(item.id);
        return sum + (discountedPrice * item.quantity);
    }, 0);
    
    let additionalDiscount = 0;
    if (appliedPromotion && promotionCode) {
        const discountResult = applyDiscount(clientCart, promotionCode);
        additionalDiscount = discountResult.discount;
    }
    
    currentPaymentData.subtotal = cartSubtotal;
    currentPaymentData.additionalDiscount = additionalDiscount;
    currentPaymentData.total = cartSubtotal - additionalDiscount + shippingCost;
    
    // Ir al paso de pago
    showPaymentStepClient();
}

// Función para mostrar el paso de pago
function showPaymentStepClient() {
    // Ir al paso 2
    goToPaymentStep(2);
    
    // Actualizar resumen de compra
    updatePaymentSummary();
    
    showNotification('Datos del cliente guardados', 'success');
}

// Función para actualizar el resumen de la compra
function updatePaymentSummary() {
    // Actualizar productos en el resumen
    const orderItems = document.getElementById('orderItems');
    if (orderItems) {
        orderItems.innerHTML = '';
        currentPaymentData.items.forEach(item => {
            const discountedPrice = getProductDiscountedPrice(item.id);
            const itemElement = document.createElement('div');
            itemElement.className = 'order-item';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCLP(discountedPrice * item.quantity)}</span>
            `;
            orderItems.appendChild(itemElement);
        });
    }
    
    // Actualizar totales
    document.getElementById('orderSubtotal').textContent = formatCLP(currentPaymentData.subtotal);
    document.getElementById('orderShipping').textContent = formatCLP(currentPaymentData.shipping);
    
    // Mostrar descuento adicional si existe
    const discountLine = document.getElementById('orderDiscountLine');
    if (discountLine) {
        if (currentPaymentData.additionalDiscount > 0) {
            discountLine.style.display = 'block';
            document.getElementById('orderDiscount').textContent = formatCLP(currentPaymentData.additionalDiscount);
        } else {
            discountLine.style.display = 'none';
        }
    }
    
    document.getElementById('orderTotal').textContent = formatCLP(currentPaymentData.total);
    
    // Habilitar botón de procesar pedido
    const processOrderBtn = document.getElementById('processOrderBtn');
    if (processOrderBtn) {
        processOrderBtn.disabled = false;
    }
}

// Función para seleccionar método de pago
function selectPaymentMethodClient(method) {
    // Remover selección anterior
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Agregar selección al método clickeado
    const clickedOption = event.target.closest('.payment-option');
    if (clickedOption) {
        clickedOption.classList.add('selected');
        currentPaymentData.paymentMethod = method;
        
        // Habilitar botón procesar pedido
        const processOrderBtn = document.getElementById('processOrderBtn');
        if (processOrderBtn) {
            processOrderBtn.disabled = false;
        }
    }
}

// Función para seleccionar método de pago (alias usado en HTML)
function selectPaymentMethod(method) {
    selectPaymentMethodClient(method);
}

// Función para procesar el pago
function processPaymentClient() {
    if (!currentPaymentData.paymentMethod) {
        showNotification('Por favor seleccione un método de pago', 'error');
        return;
    }
    
    // Mostrar paso de boleta
    showReceiptStepClient();
}

// Función para mostrar el paso de boleta
function showReceiptStepClient() {
    // Ir al paso 3
    goToPaymentStep(3);
    
    // Actualizar datos de la boleta
    updateReceiptData();
    
    showNotification('Boleta generada exitosamente', 'success');
}

// Función para actualizar los datos de la boleta
function updateReceiptData() {
    // Información de la orden
    document.getElementById('receiptOrderId').textContent = currentPaymentData.orderId;
    document.getElementById('receiptOrderDate').textContent = currentPaymentData.date;
    document.getElementById('receiptOrderTime').textContent = currentPaymentData.time;
    
    // Información del cliente
    document.getElementById('receiptCustomerName').textContent = currentPaymentData.customer;
    document.getElementById('receiptCustomerEmail').textContent = currentPaymentData.email;
    document.getElementById('receiptCustomerPhone').textContent = currentPaymentData.phone;
    document.getElementById('receiptCustomerRUT').textContent = currentPaymentData.rut;
    
    // Información de entrega
    const deliveryMethodText = currentPaymentData.deliveryMethod === 'delivery' ? 'Entrega a Domicilio' : 'Retiro en Tienda';
    document.getElementById('receiptDeliveryMethod').textContent = deliveryMethodText;
    document.getElementById('receiptDeliveryAddress').textContent = currentPaymentData.address;
    
    // Productos en tabla
    const receiptItemsBody = document.getElementById('receiptOrderItemsBody');
    if (receiptItemsBody) {
        receiptItemsBody.innerHTML = '';
        currentPaymentData.items.forEach(item => {
            const discountedPrice = getProductDiscountedPrice(item.id);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatCLP(discountedPrice)}</td>
                <td>${formatCLP(discountedPrice * item.quantity)}</td>
            `;
            receiptItemsBody.appendChild(row);
        });
    }
    
    // Totales
    document.getElementById('receiptOrderSubtotal').textContent = formatCLP(currentPaymentData.subtotal);
    document.getElementById('receiptOrderShipping').textContent = formatCLP(currentPaymentData.shipping);
    
    // Descuento adicional
    const receiptDiscountLine = document.getElementById('receiptDiscountLine');
    if (receiptDiscountLine) {
        if (currentPaymentData.additionalDiscount > 0) {
            receiptDiscountLine.style.display = 'flex';
            document.getElementById('receiptOrderDiscount').textContent = formatCLP(currentPaymentData.additionalDiscount);
        } else {
            receiptDiscountLine.style.display = 'none';
        }
    }
    
    document.getElementById('receiptOrderTotal').textContent = formatCLP(currentPaymentData.total);
    document.getElementById('receiptPaymentMethod').textContent = currentPaymentData.paymentMethod;
}

// Función para imprimir boleta
function printReceiptClient() {
    window.print();
}

// Función para imprimir boleta (alias usado en HTML)
function printOrderReceipt() {
    printReceiptClient();
}

// Función para descargar boleta
function downloadReceiptClient() {
    // Crear contenido de la boleta para descarga
    const receiptContent = `
BOLETA ELECTRÓNICA
==================

Tienda: Theboline
Fecha: ${currentPaymentData.date}
Hora: ${currentPaymentData.time}
Orden: ${currentPaymentData.orderId}

CLIENTE:
${currentPaymentData.customer}
RUT: ${currentPaymentData.rut}
${currentPaymentData.email}
${currentPaymentData.phone}

ENTREGA:
Método: ${currentPaymentData.deliveryMethod === 'delivery' ? 'Entrega a Domicilio' : 'Retiro en Tienda'}
Dirección: ${currentPaymentData.address}

PRODUCTOS:
${currentPaymentData.items.map(item => {
    const discountedPrice = getProductDiscountedPrice(item.id);
    return `${item.name} - Cantidad: ${item.quantity} - ${formatCLP(discountedPrice)} c/u - Total: ${formatCLP(discountedPrice * item.quantity)}`;
}).join('\n')}

RESUMEN:
Subtotal: ${formatCLP(currentPaymentData.subtotal)}
Envío: ${formatCLP(currentPaymentData.shipping)}
${currentPaymentData.additionalDiscount > 0 ? `Descuento: ${formatCLP(currentPaymentData.additionalDiscount)}` : ''}
TOTAL: ${formatCLP(currentPaymentData.total)}

Método de pago: ${currentPaymentData.paymentMethod}
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleta-${currentPaymentData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Boleta descargada exitosamente', 'success');
}

// Función para finalizar la compra
function finalizePurchaseClient() {
    // Crear registro de la orden
    const orderRecord = {
        id: currentPaymentData.orderId,
        date: currentPaymentData.date,
        time: currentPaymentData.time,
        customer: currentPaymentData.customer,
        email: currentPaymentData.email,
        phone: currentPaymentData.phone,
        rut: currentPaymentData.rut,
        address: currentPaymentData.address,
        deliveryMethod: currentPaymentData.deliveryMethod,
        items: [...currentPaymentData.items],
        subtotal: currentPaymentData.subtotal,
        shipping: currentPaymentData.shipping,
        additionalDiscount: currentPaymentData.additionalDiscount,
        total: currentPaymentData.total,
        paymentMethod: currentPaymentData.paymentMethod,
        promotionCode: currentPaymentData.promotionCode,
        status: 'processing'
    };
    
    // Guardar en localStorage
    const existingOrders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    existingOrders.push(orderRecord);
    localStorage.setItem('clientOrders', JSON.stringify(existingOrders));
    
    // Agregar a las órdenes del cliente
    clientOrders.unshift(orderRecord);
    
    // Vaciar carrito
    clientCart = [];
    appliedPromotion = null;
    promotionCode = '';
    
    // Actualizar UI
    updateCartCount();
    loadClientCart();
    loadClientOrders();
    
    // Cerrar modal
    closePaymentModal();
    
    // Mostrar mensaje de éxito
    showNotification(`¡Compra realizada exitosamente! Orden: ${currentPaymentData.orderId}`, 'success');
    
    // Ir a la sección de compras
    showSection('compras');
    
    // Limpiar datos de pago
    currentPaymentData = {};
}

// Variables para el proceso de checkout
let currentCheckoutData = {};

// Funciones simplificadas para el flujo de checkout del cliente
function abrirCheckout() {
    console.log('abrirCheckout called');
    
    // Verificar que hay productos en el carrito (simulado)
    const modal = document.getElementById('checkoutModal');
    if (!modal) {
        showNotification('Error: Modal no encontrado', 'error');
        return;
    }
    
    // Crear datos ficticios para la compra
    currentCheckoutData = {
        orderId: 'ORD-' + Date.now().toString().slice(-6),
        customer: {
            name: 'María Cliente',
            rut: '12.345.678-9',
            email: 'maria@email.com',
            phone: '+56 9 8765 4321',
            address: 'Calle Falsa 123, Santiago, Chile'
        },
        items: [
            { name: 'Zapatillas Nike Air Max', quantity: 1, price: 89990 },
            { name: 'Polera Básica Algodón', quantity: 2, price: 19990 }
        ],
        deliveryMethod: 'Entrega a Domicilio',
        subtotal: 129970,
        shipping: 5990,
        discount: 0,
        total: 135960,
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES'),
        paymentMethod: null
    };
    
    console.log('Checkout data created:', currentCheckoutData);
    
    // Mostrar modal
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Ir al paso 1
    irAPasoCheckout1();
}

function cerrarCheckout() {
    console.log('cerrarCheckout called');
    
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    // Limpiar datos
    currentCheckoutData = {};
    
    // Resetear a paso 1
    irAPasoCheckout1();
}

function irAPasoCheckout1() {
    console.log('irAPasoCheckout1 called');
    
    // Cambiar a paso 1
    document.querySelectorAll('.payment-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('paymentStep1').classList.add('active');
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.checkout-step-item').forEach(step => {
        step.classList.remove('active', 'completed');
    });
    document.getElementById('checkoutStep1').classList.add('active');
    
    // Llenar formulario con datos ficticios
    if (currentCheckoutData.customer) {
        document.getElementById('customerName').value = currentCheckoutData.customer.name;
        document.getElementById('customerRUT').value = currentCheckoutData.customer.rut;
        document.getElementById('customerEmail').value = currentCheckoutData.customer.email;
        document.getElementById('customerPhone').value = currentCheckoutData.customer.phone;
        document.getElementById('deliveryAddress').value = currentCheckoutData.customer.address;
        document.getElementById('deliveryMethod').value = 'delivery';
    }
    
    showNotification('Paso 1: Completar información de entrega', 'info');
}

function continuarPagoCliente() {
    console.log('continuarPagoCliente called');
    
    // Actualizar datos del cliente desde el formulario
    currentCheckoutData.customer = {
        name: document.getElementById('customerName').value || 'María Cliente',
        rut: document.getElementById('customerRUT').value || '12.345.678-9',
        email: document.getElementById('customerEmail').value || 'maria@email.com',
        phone: document.getElementById('customerPhone').value || '+56 9 8765 4321',
        address: document.getElementById('deliveryAddress').value || 'Calle Falsa 123, Santiago, Chile'
    };
    
    const deliveryMethod = document.getElementById('deliveryMethod').value;
    currentCheckoutData.deliveryMethod = deliveryMethod === 'delivery' ? 'Entrega a Domicilio ($5.990)' : 'Retiro en Tienda (Gratis)';
    currentCheckoutData.shipping = deliveryMethod === 'delivery' ? 5990 : 0;
    currentCheckoutData.total = currentCheckoutData.subtotal + currentCheckoutData.shipping - currentCheckoutData.discount;
    
    console.log('Customer data updated:', currentCheckoutData.customer);
    
    // Ir al paso 2
    irAPasoCheckout2();
}

function irAPasoCheckout2() {
    console.log('irAPasoCheckout2 called');
    
    // Cambiar a paso 2
    document.querySelectorAll('.payment-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('paymentStep2').classList.add('active');
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.checkout-step-item').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('checkoutStep1').classList.add('completed');
    document.getElementById('checkoutStep2').classList.add('active');
    
    // Llenar resumen
    const summaryItemsContainer = document.getElementById('summaryItemsCliente');
    if (summaryItemsContainer) {
        summaryItemsContainer.innerHTML = '';
        currentCheckoutData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-summary-product';
            itemElement.innerHTML = `
                <span>${item.name} x${item.quantity}</span>
                <span>${formatCLP(item.price * item.quantity)}</span>
            `;
            summaryItemsContainer.appendChild(itemElement);
        });
    }
    
    document.getElementById('summarySubtotalCliente').textContent = formatCLP(currentCheckoutData.subtotal);
    document.getElementById('summaryShippingCliente').textContent = formatCLP(currentCheckoutData.shipping);
    document.getElementById('summaryTotalCliente').textContent = formatCLP(currentCheckoutData.total);
    
    // Resetear selección de método de pago
    document.querySelectorAll('.checkout-payment-method').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Deshabilitar botón procesar pedido
    document.getElementById('processOrderBtn').disabled = true;
    
    showNotification('Paso 2: Seleccionar método de pago', 'info');
}

function seleccionarMetodoPagoCliente(metodo) {
    console.log('seleccionarMetodoPagoCliente called with:', metodo);
    
    // Remover selección anterior
    document.querySelectorAll('.checkout-payment-method').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Agregar selección al método clickeado
    event.target.closest('.checkout-payment-method').classList.add('selected');
    
    // Guardar método de pago
    currentCheckoutData.paymentMethod = metodo;
    
    // Habilitar botón procesar pedido
    document.getElementById('processOrderBtn').disabled = false;
    
    showNotification('Método de pago seleccionado: ' + metodo, 'success');
}

function procesarPedidoCliente() {
    console.log('procesarPedidoCliente called');
    
    if (!currentCheckoutData.paymentMethod) {
        showNotification('Seleccione un método de pago', 'error');
        return;
    }
    
    console.log('Processing order with payment method:', currentCheckoutData.paymentMethod);
    
    // Ir al paso 3
    irAPasoCheckout3();
}

function irAPasoCheckout3() {
    console.log('irAPasoCheckout3 called');
    
    // Cambiar a paso 3
    document.querySelectorAll('.payment-step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('paymentStep3').classList.add('active');
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.checkout-step-item').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('checkoutStep1').classList.add('completed');
    document.getElementById('checkoutStep2').classList.add('completed');
    document.getElementById('checkoutStep3').classList.add('active');
    
    // Llenar la boleta
    document.getElementById('receiptOrderId').textContent = currentCheckoutData.orderId;
    document.getElementById('receiptOrderDate').textContent = currentCheckoutData.date;
    document.getElementById('receiptOrderTime').textContent = currentCheckoutData.time;
    document.getElementById('receiptCustomerName').textContent = currentCheckoutData.customer.name;
    document.getElementById('receiptCustomerRUT').textContent = currentCheckoutData.customer.rut;
    document.getElementById('receiptCustomerEmail').textContent = currentCheckoutData.customer.email;
    document.getElementById('receiptCustomerPhone').textContent = currentCheckoutData.customer.phone;
    document.getElementById('receiptDeliveryMethod').textContent = currentCheckoutData.deliveryMethod;
    document.getElementById('receiptDeliveryAddress').textContent = currentCheckoutData.customer.address;
    
    // Llenar productos
    const receiptItemsContainer = document.getElementById('receiptOrderItems');
    if (receiptItemsContainer) {
        receiptItemsContainer.innerHTML = '';
        currentCheckoutData.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'checkout-receipt-item';
            itemElement.innerHTML = `
                <div class="checkout-receipt-item-details">
                    <strong>${item.name}</strong>
                    <span>Cantidad: ${item.quantity}</span>
                    <span>Precio unitario: ${formatCLP(item.price)}</span>
                </div>
                <div class="checkout-receipt-item-total">
                    ${formatCLP(item.price * item.quantity)}
                </div>
            `;
            receiptItemsContainer.appendChild(itemElement);
        });
    }
    
    // Llenar totales
    document.getElementById('receiptOrderSubtotal').textContent = formatCLP(currentCheckoutData.subtotal);
    document.getElementById('receiptOrderShipping').textContent = formatCLP(currentCheckoutData.shipping);
    document.getElementById('receiptOrderTotal').textContent = formatCLP(currentCheckoutData.total);
    document.getElementById('receiptPaymentMethod').textContent = currentCheckoutData.paymentMethod;
    
    showNotification('Boleta generada correctamente', 'success');
}

function regresarPaso1Cliente() {
    console.log('regresarPaso1Cliente called');
    irAPasoCheckout1();
}

function imprimirBoletaCliente() {
    console.log('imprimirBoletaCliente called');
    window.print();
    showNotification('Preparando impresión...', 'info');
}

function descargarBoletaCliente() {
    console.log('descargarBoletaCliente called');
    
    // Crear contenido de la boleta para descarga
    const receiptContent = `
BOLETA DE COMPRA ONLINE
=======================

THEBOLINE
Tienda de Moda Online
www.theboline.cl

Pedido: ${currentCheckoutData.orderId}
Fecha: ${currentCheckoutData.date}
Hora: ${currentCheckoutData.time}

CLIENTE:
${currentCheckoutData.customer.name}
RUT: ${currentCheckoutData.customer.rut}
Email: ${currentCheckoutData.customer.email}
Teléfono: ${currentCheckoutData.customer.phone}

ENTREGA:
${currentCheckoutData.deliveryMethod}
Dirección: ${currentCheckoutData.customer.address}

PRODUCTOS:
${currentCheckoutData.items.map(item => `${item.name} - Cantidad: ${item.quantity} - ${formatCLP(item.price)} c/u - Total: ${formatCLP(item.price * item.quantity)}`).join('\n')}

RESUMEN:
Subtotal: ${formatCLP(currentCheckoutData.subtotal)}
Envío: ${formatCLP(currentCheckoutData.shipping)}
TOTAL: ${formatCLP(currentCheckoutData.total)}

Método de pago: ${currentCheckoutData.paymentMethod}

¡Gracias por tu compra!
    `;
    
    // Crear y descargar archivo
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boleta-${currentCheckoutData.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Boleta descargada exitosamente', 'success');
}

function finalizarCompraCliente() {
    console.log('finalizarCompraCliente called');
    
    // Guardar pedido en localStorage
    const existingOrders = JSON.parse(localStorage.getItem('clientOrders') || '[]');
    existingOrders.push({
        ...currentCheckoutData,
        status: 'processing'
    });
    localStorage.setItem('clientOrders', JSON.stringify(existingOrders));
    
    showNotification('¡Compra finalizada exitosamente!', 'success');
    
    // Cerrar modal
    cerrarCheckout();
    
    // Ir a la sección de historial
    setTimeout(() => {
        showSection('historial');
        showNotification('Puedes ver tu pedido en "Mis Compras"', 'info');
    }, 1000);
    
    // Limpiar datos
    currentCheckoutData = {};
}

function updateDeliveryInfo() {
    console.log('updateDeliveryInfo called');
    // Esta función puede expandirse para mostrar información de entrega
}
