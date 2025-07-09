document.addEventListener('DOMContentLoaded', function() {
    
    if (window.location.pathname.includes('dashboard.html')) {
        initializeDashboard();
        
        // Load sales data for admin view
        setTimeout(() => {
            loadSalesDataForAdmin();
        }, 1000);
    }
});


function initializeDashboard() {

    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(statNumber => {
        const finalText = statNumber.textContent;
        const finalNumber = parseFloat(finalText.replace(/[^\d.]/g, ''));
        
        if (finalNumber > 0) {
            let currentNumber = 0;
            const increment = finalNumber / 30;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    statNumber.textContent = finalText;
                    clearInterval(timer);
                } else {
                    if (finalText.includes('$')) {
                        statNumber.textContent = formatCLP(currentNumber);
                    } else {
                        statNumber.textContent = Math.floor(currentNumber).toLocaleString();
                    }
                }
            }, 50);
        }
    });
    

    loadAdminProducts();
}


function loadSalesDataForAdmin() {
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    
    if (existingSales.length > 0) {

        const totalSales = existingSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        const totalCommissions = existingSales.reduce((sum, sale) => sum + parseFloat(sale.commission), 0);

        const statCards = document.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            const title = card.querySelector('h3').textContent;
            const numberElement = card.querySelector('.stat-number');
            
            if (title.includes('Ventas Hoy')) {
                numberElement.textContent = formatCLP(totalSales);
            }
        });
    }
}


function loadAdminProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const sizesHtml = product.sizes && product.sizes.length > 0 ? 
            `<div class="product-sizes">Tallas: ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}</div>` : 
            '<div class="product-sizes">Tallas: <span class="size-tag">No especificada</span></div>';
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card admin-view';
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" 
                 onerror="this.src='https://via.placeholder.com/200x200/e9ecef/666666?text=${encodeURIComponent(product.name)}'; this.style.background='#f8f9fa';"
                 onload="this.style.background='transparent';">
            <div class="product-content">
                <h3>${product.name}</h3>
                <p class="product-price">${formatCLP(product.price)}</p>
                <p class="product-stock">Stock: ${product.stock} unidades</p>
                <p class="product-category">Categoría: ${product.category}</p>
                ${sizesHtml}
            </div>
            <div class="product-actions">
                <button class="btn btn-small" onclick="editProduct(${product.id})">Editar</button>
                <button class="btn btn-small btn-danger" onclick="deleteProduct(${product.id})">Eliminar</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    

    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: #666; grid-column: 1 / -1;">No hay productos registrados.</p>';
    }
}


function updateProductsCounter() {
    const productCountElement = document.querySelector('.stat-card:nth-child(2) .stat-number');
    if (productCountElement) {
        const totalProducts = products.length;
        productCountElement.textContent = totalProducts.toLocaleString();
    }
}


function filterProducts(category) {
    alert(`Función de filtrado por categoría: ${category}\n\nEn el sistema real, aquí se filtrarían los productos mostrados según la categoría seleccionada.`);
}

document.addEventListener('DOMContentLoaded', function() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function(e) {
            const filterValue = e.target.value;
            if (filterValue.includes('categoría')) {
                filterProducts(filterValue);
            }
        });
    });
});


function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'block';
        

        document.body.style.overflow = 'hidden';
        

        setTimeout(() => {
            const firstInput = document.getElementById('productTitle');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.style.display = 'none';
        

        document.body.style.overflow = 'auto';

        const form = document.getElementById('addProductForm');
        if (form) form.reset();
    }
}


document.addEventListener('DOMContentLoaded', function() {
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Datos duros para el producto de prueba
            const productosDisponibles = [
                {
                    name: "Zapatillas Running Pro",
                    price: 149990,
                    category: "Zapatillas",
                    stock: 15,
                    sizes: ["38", "39", "40", "41", "42", "43"],
                    description: "Zapatillas profesionales para running con tecnología de amortiguación avanzada",
                    image: "productos/DX9632_010_A.jpg"
                },
                {
                    name: "Chaqueta Técnica Premium",
                    price: 199990,
                    category: "Ropa",
                    stock: 12,
                    sizes: ["S", "M", "L", "XL"],
                    description: "Chaqueta técnica resistente al agua con membrana transpirable",
                    image: "productos/producto4.jpg"
                },
                {
                    name: "Mochila Ejecutiva",
                    price: 89990,
                    category: "Accesorios",
                    stock: 20,
                    sizes: ["Única"],
                    description: "Mochila ejecutiva con compartimento para laptop y diseño elegante",
                    image: "productos/images.jpg"
                },
                {
                    name: "Pantalón Deportivo",
                    price: 79990,
                    category: "Ropa",
                    stock: 18,
                    sizes: ["S", "M", "L", "XL"],
                    description: "Pantalón deportivo cómodo para entrenamiento y uso casual",
                    image: "productos/producto3.jpg"
                },
                {
                    name: "Gorra Snapback Premium",
                    price: 34990,
                    category: "Accesorios",
                    stock: 25,
                    sizes: ["Única"],
                    description: "Gorra snapback con bordado de alta calidad y ajuste perfecto",
                    image: "productos/gorro.jpg"
                },
                {
                    name: "Zapatillas Casual Urban",
                    price: 119990,
                    category: "Zapatillas",
                    stock: 22,
                    sizes: ["38", "39", "40", "41", "42", "43"],
                    description: "Zapatillas casuales urbanas con estilo moderno y comodidad excepcional",
                    image: "productos/515Wx515H-BOLD-NIDZ4475001-VIEW1.jpg"
                },
                {
                    name: "Reloj Deportivo Digital",
                    price: 159990,
                    category: "Accesorios",
                    stock: 8,
                    sizes: ["Única"],
                    description: "Reloj deportivo con GPS, resistente al agua y múltiples funciones",
                    image: "productos/81sS3qh9TUL.jpg"
                },
                {
                    name: "Zapatillas Blancas Classic",
                    price: 109990,
                    category: "Zapatillas",
                    stock: 30,
                    sizes: ["36", "37", "38", "39", "40", "41", "42"],
                    description: "Zapatillas blancas clásicas, perfectas para cualquier ocasión",
                    image: "productos/FD1437_106_A_PREM.jpg"
                },
                {
                    name: "Polera Básica Premium",
                    price: 29990,
                    category: "Ropa",
                    stock: 40,
                    sizes: ["S", "M", "L", "XL", "XXL"],
                    description: "Polera básica de algodón premium, suave y duradera",
                    image: "productos/producto1.jpg"
                }
            ];
            
            // Seleccionar un producto aleatorio de los disponibles
            const randomProduct = productosDisponibles[Math.floor(Math.random() * productosDisponibles.length)];
            
            // Crear nuevo producto con datos duros
            const newProduct = {
                id: Date.now(),
                name: randomProduct.name,
                price: randomProduct.price,
                category: randomProduct.category,
                stock: randomProduct.stock,
                sizes: randomProduct.sizes,
                description: randomProduct.description,
                image: randomProduct.image
            };
            

            products.push(newProduct);
            

            if (window.location.pathname.includes('dashboard.html')) {
                loadAdminProducts();
                updateProductsCounter();
            }
            

            closeAddProductModal();
            

            if (typeof showNotification === 'function') {
                showNotification(`Producto "${newProduct.name}" agregado exitosamente`, 'success');
            } else {
                alert(`Producto "${newProduct.name}" agregado exitosamente`);
            }
        });
    }
});

window.addEventListener('click', function(e) {
    const addProductModal = document.getElementById('addProductModal');
    
    if (e.target === addProductModal) {
        closeAddProductModal();
    }
});

document.addEventListener('DOMContentLoaded', async function() {

    if (window.location.pathname.includes('dashboard.html')) {

        loadAdminProducts();
        updateProductsCounter();
    }
});


// Funcionalidades de promociones
function loadPromotions() {
    const promotionsGrid = document.getElementById('promotionsGrid');
    if (!promotionsGrid) return;
    
    promotionsGrid.innerHTML = '';
    
    promotions.forEach(promotion => {
        const now = new Date();
        const validFrom = new Date(promotion.validFrom);
        const validUntil = new Date(promotion.validUntil);
        
        let status = 'Activa';
        let statusClass = 'status-active';
        
        if (!promotion.isActive) {
            status = 'Inactiva';
            statusClass = 'status-inactive';
        } else if (now < validFrom) {
            status = 'Programada';
            statusClass = 'status-scheduled';
        } else if (now > validUntil) {
            status = 'Expirada';
            statusClass = 'status-expired';
        }
        
        const promotionCard = document.createElement('div');
        promotionCard.className = 'promotion-card';
        
        promotionCard.innerHTML = `
            <div class="promotion-header">
                <h3>${promotion.name}</h3>
                <span class="promotion-status ${statusClass}">${status}</span>
            </div>
            <div class="promotion-details">
                <p><strong>Código:</strong> ${promotion.code}</p>
                <p><strong>Descuento:</strong> ${promotion.discountType === 'percentage' ? promotion.discountValue + '%' : formatCLP(promotion.discountValue)}</p>
                <p><strong>Compra mínima:</strong> ${formatCLP(promotion.minPurchase)}</p>
                <p><strong>Válido:</strong> ${validFrom.toLocaleDateString()} - ${validUntil.toLocaleDateString()}</p>
                <p><strong>Categorías:</strong> ${promotion.applicableCategories.join(', ')}</p>
            </div>
            <div class="promotion-actions">
                <button class="btn btn-small" onclick="editPromotion(${promotion.id})">Editar</button>
                <button class="btn btn-small ${promotion.isActive ? 'btn-warning' : 'btn-success'}" onclick="togglePromotion(${promotion.id})">
                    ${promotion.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button class="btn btn-small btn-danger" onclick="deletePromotion(${promotion.id})">Eliminar</button>
            </div>
        `;
        
        promotionsGrid.appendChild(promotionCard);
    });
    
    if (promotions.length === 0) {
        promotionsGrid.innerHTML = '<p style="text-align: center; color: #666;">No hay promociones registradas.</p>';
    }
}

function openAddPromotionModal() {
    const modal = document.getElementById('addPromotionModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Establecer fechas por defecto
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(today.getMonth() + 1);
        
        document.getElementById('validFrom').value = today.toISOString().split('T')[0];
        document.getElementById('validUntil').value = nextMonth.toISOString().split('T')[0];
    }
}

function closeAddPromotionModal() {
    const modal = document.getElementById('addPromotionModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('addPromotionForm').reset();
    }
}

function toggleDiscountFields() {
    const discountType = document.getElementById('discountType').value;
    const discountHint = document.getElementById('discountHint');
    
    if (discountType === 'percentage') {
        discountHint.textContent = 'Porcentaje de descuento (ej: 20 para 20%)';
    } else {
        discountHint.textContent = 'Monto fijo de descuento en CLP';
    }
}

function editPromotion(id) {
    alert(`Editar promoción ${id} - Funcionalidad en desarrollo`);
}

function togglePromotion(id) {
    const promotion = promotions.find(p => p.id === id);
    if (promotion) {
        promotion.isActive = !promotion.isActive;
        loadPromotions();
        showNotification(`Promoción ${promotion.isActive ? 'activada' : 'desactivada'} exitosamente`, 'success');
    }
}

function deletePromotion(id) {
    if (confirm('¿Está seguro de que desea eliminar esta promoción?')) {
        const index = promotions.findIndex(p => p.id === id);
        if (index !== -1) {
            promotions.splice(index, 1);
            loadPromotions();
            showNotification('Promoción eliminada exitosamente', 'success');
        }
    }
}

function filterPromotions(filter) {
    const cards = document.querySelectorAll('.promotion-card');
    cards.forEach(card => {
        const statusElement = card.querySelector('.promotion-status');
        const statusClass = statusElement.className;
        
        let show = true;
        if (filter === 'active') {
            show = statusClass.includes('status-active');
        } else if (filter === 'inactive') {
            show = statusClass.includes('status-inactive');
        } else if (filter === 'expired') {
            show = statusClass.includes('status-expired');
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Funcionalidades de órdenes de reposición
function loadReorders() {
    const reordersGrid = document.getElementById('reordersGrid');
    if (!reordersGrid) return;
    
    // Cargar órdenes desde localStorage
    const savedReorders = localStorage.getItem('reorderRequests');
    if (savedReorders) {
        reorderRequests = JSON.parse(savedReorders);
    }
    
    reordersGrid.innerHTML = '';
    
    reorderRequests.forEach(request => {
        const reorderCard = document.createElement('div');
        reorderCard.className = 'reorder-card';
        
        let statusClass = 'status-pending';
        if (request.status === 'Aprobada') statusClass = 'status-approved';
        if (request.status === 'Completada') statusClass = 'status-completed';
        
        reorderCard.innerHTML = `
            <div class="reorder-header">
                <h3>${request.productName}</h3>
                <span class="reorder-status ${statusClass}">${request.status}</span>
            </div>
            <div class="reorder-details">
                <p><strong>Cantidad:</strong> ${request.quantityRequested} unidades</p>
                <p><strong>Stock actual:</strong> ${request.currentStock}</p>
                <p><strong>Prioridad:</strong> ${request.priority}</p>
                <p><strong>Proveedor:</strong> ${request.supplier}</p>
                <p><strong>Costo estimado:</strong> ${formatCLP(request.estimatedCost)}</p>
                <p><strong>Solicitado por:</strong> ${request.requestedBy}</p>
                <p><strong>Fecha:</strong> ${request.requestDate} ${request.requestTime}</p>
                ${request.notes ? `<p><strong>Notas:</strong> ${request.notes}</p>` : ''}
            </div>
            <div class="reorder-actions">
                ${request.status === 'Pendiente Aprobación' ? 
                    `<button class="btn btn-small btn-success" onclick="approveReorder(${request.id})">Aprobar</button>` : 
                    ''}
                <button class="btn btn-small" onclick="viewReorderDetails(${request.id})">Ver Detalles</button>
                <button class="btn btn-small btn-danger" onclick="cancelReorder(${request.id})">Cancelar</button>
            </div>
        `;
        
        reordersGrid.appendChild(reorderCard);
    });
    
    if (reorderRequests.length === 0) {
        reordersGrid.innerHTML = '<p style="text-align: center; color: #666;">No hay órdenes de reposición registradas.</p>';
    }
}

function openCreateReorderModal() {
    const modal = document.getElementById('createReorderModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Llenar select de productos
        const productSelect = document.getElementById('reorderProduct');
        productSelect.innerHTML = '<option value="">Seleccionar producto</option>';
        productSelect.innerHTML += '<option value="new_product">+ Crear Producto Nuevo</option>';
        
        products.forEach(product => {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} (Stock: ${product.stock})`;
            productSelect.appendChild(option);
        });
        
        // Ocultar campos de producto nuevo inicialmente
        document.getElementById('newProductFields').style.display = 'none';
    }
}

function closeCreateReorderModal() {
    const modal = document.getElementById('createReorderModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        document.getElementById('createReorderForm').reset();
        document.getElementById('reorderSummary').style.display = 'none';
        document.getElementById('newProductFields').style.display = 'none';
        
        // Limpiar requerimientos de campos
        document.getElementById('newProductName').required = false;
        document.getElementById('newProductCategory').required = false;
        document.getElementById('newProductPrice').required = false;
    }
}

function approveReorder(id) {
    if (confirm('¿Aprobar esta orden de reposición?')) {
        const result = approveReorderRequest(id);
        if (result) {
            loadReorders();
            showNotification('Orden aprobada y notificación enviada al proveedor', 'success');
        }
    }
}

function viewReorderDetails(id) {
    const request = reorderRequests.find(r => r.id === id);
    if (request) {
        alert(`Detalles de la orden:\n\nProducto: ${request.productName}\nCantidad: ${request.quantityRequested}\nCosto: ${formatCLP(request.estimatedCost)}\nProveedor: ${request.supplier}\nEntrega estimada: ${request.estimatedDelivery}`);
    }
}

function cancelReorder(id) {
    if (confirm('¿Cancelar esta orden de reposición?')) {
        const index = reorderRequests.findIndex(r => r.id === id);
        if (index !== -1) {
            reorderRequests.splice(index, 1);
            localStorage.setItem('reorderRequests', JSON.stringify(reorderRequests));
            loadReorders();
            showNotification('Orden cancelada exitosamente', 'success');
        }
    }
}

function filterReorders(filter) {
    const cards = document.querySelectorAll('.reorder-card');
    cards.forEach(card => {
        const statusElement = card.querySelector('.reorder-status');
        const statusText = statusElement.textContent;
        
        let show = true;
        if (filter && statusText !== filter) {
            show = false;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Event listeners para formularios de promociones
document.addEventListener('DOMContentLoaded', function() {
    const addPromotionForm = document.getElementById('addPromotionForm');
    if (addPromotionForm) {
        addPromotionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const categories = Array.from(formData.getAll('categories'));
            
            const newPromotion = {
                id: Date.now(),
                name: formData.get('promotionName'),
                description: formData.get('promotionDescription'),
                discountType: formData.get('discountType'),
                discountValue: parseFloat(formData.get('discountValue')),
                minPurchase: parseFloat(formData.get('minPurchase')) || 0,
                maxDiscount: parseFloat(formData.get('maxDiscount')) || 999999,
                validFrom: formData.get('validFrom'),
                validUntil: formData.get('validUntil'),
                applicableCategories: categories,
                applicableProducts: [],
                isActive: true,
                code: formData.get('promotionCode').toUpperCase()
            };
            
            promotions.push(newPromotion);
            loadPromotions();
            closeAddPromotionModal();
            showNotification('Promoción creada exitosamente', 'success');
        });
    }
    
    const createReorderForm = document.getElementById('createReorderForm');
    if (createReorderForm) {
        createReorderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const productSelect = document.getElementById('reorderProduct');
            const quantity = parseInt(formData.get('reorderQuantity'));
            const priority = formData.get('reorderPriority');
            const notes = formData.get('reorderNotes');
            
            let productId;
            
            // Verificar si es producto nuevo
            if (productSelect.value === 'new_product') {
                // Crear producto nuevo
                const newProductName = formData.get('newProductName');
                const newProductCategory = formData.get('newProductCategory');
                const newProductPrice = parseFloat(formData.get('newProductPrice'));
                const newProductDescription = formData.get('newProductDescription');
                const newProductSizes = Array.from(formData.getAll('newProductSizes'));
                
                if (!newProductName || !newProductCategory || !newProductPrice) {
                    alert('Por favor complete todos los campos obligatorios del producto nuevo');
                    return;
                }
                
                // Crear el nuevo producto
                const newProduct = {
                    id: Date.now(),
                    name: newProductName,
                    price: newProductPrice,
                    category: newProductCategory,
                    stock: 0, // Producto nuevo sin stock inicial
                    sizes: newProductSizes.length > 0 ? newProductSizes : ['Única'],
                    description: newProductDescription || `${newProductName} - Producto nuevo`,
                    image: 'productos/producto1.jpg' // Imagen por defecto
                };
                
                // Agregar a la lista de productos
                products.push(newProduct);
                productId = newProduct.id;
                
                // Actualizar vista de productos si está activa
                if (typeof loadAdminProducts === 'function') {
                    loadAdminProducts();
                }
                
                showNotification(`Producto "${newProductName}" creado exitosamente`, 'success');
            } else {
                productId = parseInt(productSelect.value);
            }
            
            // Crear la orden de reposición
            const request = createReorderRequest(productId, quantity, priority, notes);
            if (request) {
                loadReorders();
                closeCreateReorderModal();
                showNotification('Orden de reposición creada exitosamente', 'success');
            }
        });
        
        // Mostrar resumen cuando se selecciona producto
        const productSelect = document.getElementById('reorderProduct');
        const quantityInput = document.getElementById('reorderQuantity');
        
        function updateReorderSummary() {
            const productSelect = document.getElementById('reorderProduct');
            const quantity = parseInt(document.getElementById('reorderQuantity').value);
            
            if (productSelect.value === 'new_product') {
                const productName = document.getElementById('newProductName').value;
                const productPrice = parseFloat(document.getElementById('newProductPrice').value);
                const productCategory = document.getElementById('newProductCategory').value;
                
                if (productName && productPrice && quantity) {
                    const cost = productPrice * 0.6 * quantity; // Costo estimado 60% del precio
                    
                    document.getElementById('reorderSummary').style.display = 'block';
                    document.getElementById('reorderDetails').innerHTML = `
                        <p><strong>Producto:</strong> ${productName} (NUEVO)</p>
                        <p><strong>Categoría:</strong> ${productCategory || 'No especificada'}</p>
                        <p><strong>Precio de venta:</strong> ${formatCLP(productPrice)}</p>
                        <p><strong>Stock inicial:</strong> 0 (producto nuevo)</p>
                        <p><strong>Cantidad solicitada:</strong> ${quantity}</p>
                        <p><strong>Proveedor:</strong> Proveedor General</p>
                        <p><strong>Costo estimado:</strong> ${formatCLP(cost)}</p>
                    `;
                } else {
                    document.getElementById('reorderSummary').style.display = 'none';
                }
            } else {
                const productId = parseInt(productSelect.value);
                
                if (productId && quantity) {
                    const product = products.find(p => p.id === productId);
                    if (product) {
                        const cost = calculateReorderCost(productId, quantity);
                        const supplier = getProductSupplier(productId);
                        
                        document.getElementById('reorderSummary').style.display = 'block';
                        document.getElementById('reorderDetails').innerHTML = `
                            <p><strong>Producto:</strong> ${product.name}</p>
                            <p><strong>Stock actual:</strong> ${product.stock}</p>
                            <p><strong>Cantidad solicitada:</strong> ${quantity}</p>
                            <p><strong>Proveedor:</strong> ${supplier}</p>
                            <p><strong>Costo estimado:</strong> ${formatCLP(cost)}</p>
                        `;
                    }
                } else {
                    document.getElementById('reorderSummary').style.display = 'none';
                }
            }
        }
        
        productSelect.addEventListener('change', updateReorderSummary);
        quantityInput.addEventListener('input', updateReorderSummary);
        
        // Event listeners para campos de producto nuevo
        document.getElementById('newProductName').addEventListener('input', updateReorderSummary);
        document.getElementById('newProductPrice').addEventListener('input', updateReorderSummary);
        document.getElementById('newProductCategory').addEventListener('change', updateReorderSummary);
    }
});

// Función para mostrar/ocultar campos de producto nuevo
function toggleNewProductFields() {
    const productSelect = document.getElementById('reorderProduct');
    const newProductFields = document.getElementById('newProductFields');
    
    if (productSelect.value === 'new_product') {
        newProductFields.style.display = 'block';
        newProductFields.classList.add('show');
        
        // Hacer campos obligatorios
        document.getElementById('newProductName').required = true;
        document.getElementById('newProductCategory').required = true;
        document.getElementById('newProductPrice').required = true;
        
        // Agregar título si no existe
        if (!newProductFields.querySelector('h4')) {
            const title = document.createElement('h4');
            title.textContent = 'Información del Producto Nuevo';
            newProductFields.insertBefore(title, newProductFields.firstChild);
        }
    } else {
        newProductFields.style.display = 'none';
        newProductFields.classList.remove('show');
        
        // Remover requerimiento de campos
        document.getElementById('newProductName').required = false;
        document.getElementById('newProductCategory').required = false;
        document.getElementById('newProductPrice').required = false;
        
        // Limpiar campos
        document.getElementById('newProductName').value = '';
        document.getElementById('newProductCategory').value = '';
        document.getElementById('newProductPrice').value = '';
        document.getElementById('newProductDescription').value = '';
        
        // Desmarcar checkboxes
        const checkboxes = newProductFields.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => checkbox.checked = false);
    }
    
    // Actualizar resumen
    updateReorderSummary();
}

// ...existing code...

// Función para generar órdenes automáticas desde el admin
function generateAutomaticReorders() {
    const newRequests = window.generateAutomaticReorders ? window.generateAutomaticReorders() : [];
    
    if (newRequests.length > 0) {
        loadReorders();
        showNotification(`${newRequests.length} órdenes automáticas generadas`, 'success');
    } else {
        showNotification('No se requieren órdenes automáticas en este momento', 'info');
    }
}

// Actualizar la función showSection para cargar promociones y órdenes
const originalShowSection = window.showSection;
window.showSection = function(sectionId) {
    if (originalShowSection) {
        originalShowSection(sectionId);
    }
    
    if (sectionId === 'promotions') {
        loadPromotions();
    } else if (sectionId === 'reorders') {
        loadReorders();
    }
};

// Exponer funciones globalmente
window.loadPromotions = loadPromotions;
window.openAddPromotionModal = openAddPromotionModal;
window.closeAddPromotionModal = closeAddPromotionModal;
window.toggleDiscountFields = toggleDiscountFields;
window.editPromotion = editPromotion;
window.togglePromotion = togglePromotion;
window.deletePromotion = deletePromotion;
window.filterPromotions = filterPromotions;

window.loadReorders = loadReorders;
window.openCreateReorderModal = openCreateReorderModal;
window.closeCreateReorderModal = closeCreateReorderModal;
window.toggleNewProductFields = toggleNewProductFields;
window.approveReorder = approveReorder;
window.viewReorderDetails = viewReorderDetails;
window.cancelReorder = cancelReorder;
window.filterReorders = filterReorders;
window.generateAutomaticReorders = generateAutomaticReorders;
window.toggleNewProductFields = toggleNewProductFields;
