// Funcionalidad común roles
// Funcionalidad login
document.addEventListener('DOMContentLoaded', function() {
    // Verificar página login
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            
            if (!usernameInput || !passwordInput) {
                alert('Error: No se pudieron encontrar los campos de usuario y contraseña');
                return;
            }
            
            const username = usernameInput.value.trim();
            const password = passwordInput.value.trim();
            
            // Autenticación basada roles
            if (username === 'admin' && password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', 'admin');
                window.location.href = 'dashboard.html';
            } else if (username === 'vendedor' && password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', 'vendedor');
                window.location.href = 'vendedor.html';
            } else if (username === 'gerente' && password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', 'gerente');
                window.location.href = 'gerente.html';
            } else if (username === 'cliente' && password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                localStorage.setItem('userRole', 'cliente');
                window.location.href = 'cliente.html';
            } else {
                alert('Usuario o contraseña incorrectos.\n\nCredenciales válidas:\n• Admin: admin/123456\n• Vendedor: vendedor/123456\n• Gerente: gerente/123456\n• Cliente: cliente/123456');
            }
        });
    }
    
    // Verificar autenticación dashboards
    const dashboardPages = ['dashboard.html', 'vendedor.html', 'gerente.html', 'cliente.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (dashboardPages.includes(currentPage)) {
        if (!localStorage.getItem('isLoggedIn')) {
            window.location.href = 'index.html';
        }
    }
});

// Funcionalidad dashboard
function showSection(sectionId) {
    // Ocultar todas secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });
    

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    

    const selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    event.target.classList.add('active');
    

    if (sectionId === 'products') {

        if (typeof loadAdminProducts === 'function') {
            loadAdminProducts();
        }
    } else if (sectionId === 'promotions') {
        // Cargar promociones admin
        if (typeof loadPromotions === 'function') {
            loadPromotions();
        }
    } else if (sectionId === 'reorders') {
        // Cargar órdenes de reposición
        if (typeof loadReorders === 'function') {
            loadReorders();
        }
    } else if (sectionId === 'catalogo') {

        if (typeof loadSellerProducts === 'function') {
            loadSellerProducts();
        }
    } else if (sectionId === 'stock') {

        if (typeof loadStockProducts === 'function') {
            loadStockProducts();
        }
    } else if (sectionId === 'inventario') {
        // Cargar inventario para gerente
        if (typeof loadProductImages === 'function') {
            loadProductImages().then(() => {
                if (typeof loadStockProducts === 'function') {
                    loadStockProducts();
                }
            });
        } else if (typeof loadStockProducts === 'function') {
            loadStockProducts();
        }
    }
}


function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}


document.addEventListener('DOMContentLoaded', function() {

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn') && !e.target.onclick) {

            const originalText = e.target.textContent;
            e.target.innerHTML = '<span class="loading"></span> Cargando...';
            e.target.disabled = true;
            

            setTimeout(() => {
                e.target.textContent = originalText;
                e.target.disabled = false;
                

                if (originalText.includes('Agregar') || originalText.includes('Guardar') || originalText.includes('Generar')) {
                    showNotification('Acción completada exitosamente', 'success');
                }
            }, 1000);
        }
    });
});


function showNotification(message, type = 'info') {

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    

    document.body.appendChild(notification);
    

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}


function formatCLP(amount) {
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

function formatCurrency(amount) {
    return formatCLP(amount);
}

let products = [
    {
        id: 1,
        name: "Calcetines Nike",
        price: 19990,
        category: "Accesorios",
        stock: 15,
        sizes: ["S", "M", "L", "XL"],
        description: "Calcetines deportivos de alta calidad, cómodos y duraderos",
        image: "productos/DX9632_010_A.jpg"
    },
    {
        id: 2,
        name: "Conjunto Adidas",
        price: 19990,
        category: "Ropa",
        stock: 25,
        sizes: ["S", "M", "L", "XL"],
        description: "poleron y buzo chandal básico 100% algodón, perfecta para el día a día",
        image: "productos/producto1.jpg"
    },
    {
        id: 3,
        name: "Zapatilla nike ",
        price: 45990,
        category: "Ropa",
        stock: 8,
        sizes: ["37", "38", "39", "40", "41"],
        description: "Zapatillas deportivas cómodas y modernas",
        image: "productos/producto3.jpg"
    },
    {
        id: 4,
        name: "Jordan retro 4 black cat",
        price: 69990,
        category: "Ropa",
        stock: 12,
        sizes: ["S", "M", "L", "XL"],
        description: "zapatillas deportivas de alta gama, diseño exclusivo y comodidad superior",
        image: "productos/producto4.jpg"
    },
    {
        id: 5,
        name: "Gorro invierno",
        price: 24990,
        category: "Accesorios",
        stock: 20,
        sizes: ["Única"],
        description: "Gorro con estilo urbano",
        image: "productos/gorro.jpg"
    },
    {
        id: 6,
        name: "Correa cuero",
        price: 129990,
        category: "Accesorios",
        stock: 6,
        sizes: ["S", "M", "L", "XL"],
        description: "correa de cuero genuino, elegante y duradera",
        image: "productos/images.jpg"
    },
    {
        id: 7,
        name: "Chaqueta Jordan urbana",
        price: 39990,
        category: "Accesorios",
        stock: 18,
        sizes: ["Única"],
        description: "Chaqueta Jordan, diseño moderno y funcional, ideal para el día a día",
        image: "productos/81sS3qh9TUL.jpg"
    },
    {
        id: 8,
        name: "Zapatilla Jordan MVP",
        price: 54990,
        category: "Ropa",
        stock: 14,
        sizes: ["S", "M", "L", "XL"],
        description: "Zapatilla Jordan MVP, diseño exclusivo y comodidad superior",
        image: "productos/515Wx515H-BOLD-NIDZ4475001-VIEW1.jpg"
    },
    {
        id: 9,
        name: "Zapatillas Jordan 1",
        price: 79990,
        category: "Zapatillas",
        stock: 3,
        sizes: ["37", "38", "39", "40", "41"],
        description: "Zapatillas clásicas de lona",
        image: "productos/FD1437_106_A_PREM.jpg"
    },
    {
        id: 10,
        name: "Poleron y buzo adidas",
        price: 34990,
        category: "Accesorios",
        stock: 22,
        sizes: ["85", "90", "95", "100", "105"],
        description: "Poleron y buzo adidas, conjunto cómodo y versátil para el día a día",
        image: "productos/producto1.jpg"
    }
];


document.addEventListener('DOMContentLoaded', async function() {

    const username = localStorage.getItem('username');
    const userRole = localStorage.getItem('userRole');
    
    if (username && userRole) {
        const userInfoElement = document.querySelector('.user-info span');
        if (userInfoElement) {
            const roleNames = {
                'admin': 'Administrador',
                'vendedor': 'Vendedor',
                'gerente': 'Gerente'
            };
            userInfoElement.textContent = `Bienvenido, ${roleNames[userRole]}`;
        }
    }
});


function calculateCommission(saleAmount, commissionRate = 0.05) {
    return saleAmount * commissionRate;
}


function imageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

async function scanProductsFolder() {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    
    for (let product of products) {
        let imageFound = false;
        

        for (let ext of imageExtensions) {
            const imagePath = `productos/${product.name.toLowerCase().replace(/\s+/g, '-')}${ext}`;
            
            if (await imageExists(imagePath)) {
                product.image = imagePath;
                imageFound = true;
                break;
            }
        }
        

        if (!imageFound) {
            product.image = `https://via.placeholder.com/200x150?text=${encodeURIComponent(product.name)}`;
        }
    }
}


function getImageUrl(imagePath) {

    if (imagePath.startsWith('http')) {
        return imagePath;
    }
    

    if (!imagePath.startsWith('./') && !imagePath.startsWith('/')) {
        return './' + imagePath;
    }
    
    return imagePath;
}

function createImageElement(imagePath, altText, className = '') {
    const img = document.createElement('img');
    img.src = getImageUrl(imagePath);
    img.alt = altText;
    if (className) img.className = className;
 
    img.onerror = function() {
        console.log('Error loading image:', imagePath);
        this.src = `https://via.placeholder.com/200x200/e9ecef/666666?text=${encodeURIComponent(altText)}`;
        this.style.background = '#f8f9fa';
        this.style.border = '2px dashed #dee2e6';
    };
    
    img.onload = function() {
        console.log('Successfully loaded image:', imagePath);
        this.style.background = 'transparent';
    };
    
    return img;
}


document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const currentSection = document.querySelector('.content-section.active');
            
            if (!currentSection) return;
            
  
            const cards = currentSection.querySelectorAll('.product-card, .client-card, .seller-card');
            cards.forEach(card => {
                const text = card.textContent.toLowerCase();
                card.style.display = text.includes(searchTerm) ? '' : 'none';
            });
        });
    });
});

// Sistema de promociones y descuentos
let promotions = [
    {
        id: 1,
        name: "Descuento de Temporada",
        description: "20% de descuento en ropa de temporada",
        discountType: "percentage", // percentage o fixed
        discountValue: 20,
        minPurchase: 50000,
        maxDiscount: 30000,
        validFrom: "2024-07-01",
        validUntil: "2024-07-31",
        applicableCategories: ["Ropa"],
        applicableProducts: [],
        isActive: true,
        code: "TEMPORADA20"
    },
    {
        id: 2,
        name: "Descuento Zapatillas",
        description: "15% de descuento en zapatillas",
        discountType: "percentage",
        discountValue: 15,
        minPurchase: 70000,
        maxDiscount: 25000,
        validFrom: "2024-07-01",
        validUntil: "2024-08-15",
        applicableCategories: ["Zapatillas"],
        applicableProducts: [],
        isActive: true,
        code: "ZAPAS15"
    },
    {
        id: 3,
        name: "Descuento Fijo Accesorios",
        description: "$10.000 de descuento en accesorios",
        discountType: "fixed",
        discountValue: 10000,
        minPurchase: 40000,
        maxDiscount: 10000,
        validFrom: "2024-07-01",
        validUntil: "2024-07-31",
        applicableCategories: ["Accesorios"],
        applicableProducts: [],
        isActive: true,
        code: "ACCESORIOS10"
    }
];

// Función para aplicar descuentos
function applyDiscount(cart, promotionCode = null) {
    let totalDiscount = 0;
    let appliedPromotion = null;
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Buscar promoción por código si se proporciona
    if (promotionCode) {
        const promotion = promotions.find(p => 
            p.code === promotionCode && 
            p.isActive && 
            new Date() >= new Date(p.validFrom) && 
            new Date() <= new Date(p.validUntil)
        );
        
        if (promotion && cartTotal >= promotion.minPurchase) {
            appliedPromotion = promotion;
        }
    }
    
    // Si no hay código, buscar la mejor promoción aplicable automáticamente
    if (!appliedPromotion) {
        const applicablePromotions = promotions.filter(p => {
            if (!p.isActive) return false;
            if (new Date() < new Date(p.validFrom)) return false;
            if (new Date() > new Date(p.validUntil)) return false;
            if (cartTotal < p.minPurchase) return false;
            
            // Verificar si hay productos aplicables
            const hasApplicableProducts = cart.some(item => {
                const product = products.find(prod => prod.id === item.id);
                return product && (
                    p.applicableCategories.includes(product.category) ||
                    p.applicableProducts.includes(product.id)
                );
            });
            
            return hasApplicableProducts;
        });
        
        // Seleccionar la promoción con mayor descuento
        appliedPromotion = applicablePromotions.reduce((best, current) => {
            const currentDiscount = current.discountType === 'percentage' 
                ? Math.min(cartTotal * (current.discountValue / 100), current.maxDiscount)
                : current.discountValue;
            
            const bestDiscount = best 
                ? (best.discountType === 'percentage' 
                    ? Math.min(cartTotal * (best.discountValue / 100), best.maxDiscount)
                    : best.discountValue)
                : 0;
            
            return currentDiscount > bestDiscount ? current : best;
        }, null);
    }
    
    // Calcular descuento
    if (appliedPromotion) {
        if (appliedPromotion.discountType === 'percentage') {
            totalDiscount = Math.min(
                cartTotal * (appliedPromotion.discountValue / 100),
                appliedPromotion.maxDiscount
            );
        } else {
            totalDiscount = appliedPromotion.discountValue;
        }
    }
    
    return {
        originalTotal: cartTotal,
        discount: totalDiscount,
        finalTotal: cartTotal - totalDiscount,
        appliedPromotion: appliedPromotion
    };
}

// Función para validar código de promoción
function validatePromotionCode(code) {
    const promotion = promotions.find(p => p.code === code);
    
    if (!promotion) {
        return { valid: false, message: "Código de promoción no válido" };
    }
    
    if (!promotion.isActive) {
        return { valid: false, message: "La promoción no está activa" };
    }
    
    const now = new Date();
    if (now < new Date(promotion.validFrom)) {
        return { valid: false, message: "La promoción aún no ha comenzado" };
    }
    
    if (now > new Date(promotion.validUntil)) {
        return { valid: false, message: "La promoción ha expirado" };
    }
    
    return { valid: true, promotion: promotion };
}

// Sistema de órdenes de reposición
let reorderRequests = [];

// Función para crear orden de reposición manual
function createReorderRequest(productId, quantity, priority = 'Media', notes = '') {
    const product = products.find(p => p.id === productId);
    if (!product) return null;
    
    const request = {
        id: Date.now(),
        productId: productId,
        productName: product.name,
        currentStock: product.stock,
        quantityRequested: quantity,
        priority: priority,
        notes: notes,
        requestDate: new Date().toLocaleDateString('es-ES'),
        requestTime: new Date().toLocaleTimeString('es-ES'),
        status: 'Pendiente Aprobación',
        requestedBy: localStorage.getItem('username') || 'Sistema',
        estimatedDelivery: getEstimatedDelivery(),
        supplier: getProductSupplier(productId),
        estimatedCost: calculateReorderCost(productId, quantity)
    };
    
    reorderRequests.push(request);
    localStorage.setItem('reorderRequests', JSON.stringify(reorderRequests));
    
    return request;
}

// Función para obtener proveedor del producto
function getProductSupplier(productId) {
    const suppliers = {
        1: 'Nike Chile',
        2: 'Textil Nacional',
        3: 'Denim Import',
        4: 'SportWear Chile',
        5: 'Accesorios Plus',
        6: 'TimeWatch',
        7: 'BackPack Co',
        8: 'Comfort Wear',
        9: 'Converse Chile',
        10: 'Leather Goods'
    };
    
    return suppliers[productId] || 'Proveedor General';
}

// Función para calcular costo estimado de reposición
function calculateReorderCost(productId, quantity) {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    
    // Costo estimado es 60% del precio de venta
    const unitCost = product.price * 0.6;
    return unitCost * quantity;
}

// Función para obtener fecha estimada de entrega
function getEstimatedDelivery() {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 7); // 7 días desde hoy
    return deliveryDate.toLocaleDateString('es-ES');
}

// Función para generar orden de reposición automática
function generateAutomaticReorders() {
    const lowStockProducts = products.filter(p => p.stock <= 10);
    const newRequests = [];
    
    lowStockProducts.forEach(product => {
        const quantity = product.stock <= 5 ? 30 : 20;
        const priority = product.stock <= 5 ? 'Alta' : 'Media';
        
        const request = createReorderRequest(
            product.id,
            quantity,
            priority,
            'Orden automática generada por stock bajo'
        );
        
        if (request) {
            newRequests.push(request);
        }
    });
    
    return newRequests;
}
