// Gerente-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on manager dashboard
    if (window.location.pathname.includes('gerente.html')) {
        // Initialize executive dashboard
        initializeExecutiveDashboard();
        
        // Load manager-specific data
        setTimeout(() => {
            loadManagerData();
        }, 1000);
    }
});

// Initialize executive dashboard
function initializeExecutiveDashboard() {
    // Animate executive cards
    const executiveCards = document.querySelectorAll('.executive-card .card-value');
    executiveCards.forEach(card => {
        const finalText = card.textContent;
        const finalNumber = parseFloat(finalText.replace(/[^\d.]/g, ''));
        
        if (finalNumber > 0) {
            let currentNumber = 0;
            const increment = finalNumber / 30;
            
            const timer = setInterval(() => {
                currentNumber += increment;
                if (currentNumber >= finalNumber) {
                    card.textContent = finalText;
                    clearInterval(timer);
                } else {
                    if (finalText.includes('$')) {
                        card.textContent = formatCLP(currentNumber);
                    } else if (finalText.includes('%')) {
                        card.textContent = Math.floor(currentNumber) + '%';
                    } else {
                        card.textContent = Math.floor(currentNumber).toLocaleString();
                    }
                }
            }, 50);
        }
    });
    
    // Initialize simple sales chart
    initializeSalesChart();
}

// Load manager-specific data
function loadManagerData() {
    // Load sales data for executive view
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    
    if (existingSales.length > 0) {
        const totalSales = existingSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
        const totalTransactions = existingSales.length;
        
        // Update executive dashboard stats
        const revenueCard = document.querySelector('.executive-card.revenue .card-value');
        const salesCard = document.querySelector('.executive-card.sales .card-value');
        
        if (revenueCard) {
            revenueCard.textContent = formatCLP(totalSales);
        }
        if (salesCard) {
            salesCard.textContent = totalTransactions.toLocaleString();
        }
    }
}

// Initialize simple sales chart
function initializeSalesChart() {
    const canvas = document.getElementById('salesChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Sample data for demonstration
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul'];
    const sales = [25, 32, 28, 45, 38, 52, 48];
    
    // Chart settings
    const margin = 40;
    const chartWidth = width - 2 * margin;
    const chartHeight = height - 2 * margin;
    const maxSales = Math.max(...sales);
    
    // Draw axes
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(margin, margin);
    ctx.lineTo(margin, height - margin);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(margin, height - margin);
    ctx.lineTo(width - margin, height - margin);
    ctx.stroke();
    
    // Draw bars
    const barWidth = chartWidth / months.length;
    const barSpacing = barWidth * 0.2;
    const actualBarWidth = barWidth - barSpacing;
    
    ctx.fillStyle = '#FFD700';
    
    sales.forEach((sale, index) => {
        const barHeight = (sale / maxSales) * chartHeight;
        const x = margin + index * barWidth + barSpacing / 2;
        const y = height - margin - barHeight;
        
        ctx.fillRect(x, y, actualBarWidth, barHeight);
        
        // Add labels
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(months[index], x + actualBarWidth / 2, height - margin + 15);
        ctx.fillText(sale + 'M', x + actualBarWidth / 2, y - 5);
        
        ctx.fillStyle = '#FFD700';
    });
}

// Seller management functions
function openAddSellerModal() {
    showNotification('Modal de agregar vendedor próximamente', 'info');
}

function viewSellerDetails(sellerId) {
    showNotification(`Cargando detalles del vendedor ${sellerId}`, 'info');
}

function editSeller(sellerId) {
    showNotification(`Editando vendedor ${sellerId}`, 'info');
}

function viewSellerReports(sellerId) {
    showNotification(`Cargando reportes del vendedor ${sellerId}`, 'info');
}

// Report management functions
function generateExecutiveReport() {
    showNotification('Generando reporte ejecutivo...', 'info');
    
    // Simulate report generation
    setTimeout(() => {
        showNotification('Reporte ejecutivo generado exitosamente', 'success');
    }, 2000);
}

function viewReport(reportType) {
    const reportNames = {
        'executive': 'Reporte Ejecutivo',
        'sales': 'Análisis de Ventas',
        'inventory': 'Reporte de Inventario',
        'performance': 'Rendimiento del Equipo'
    };
    
    const reportName = reportNames[reportType] || 'Reporte';
    showNotification(`Abriendo ${reportName}...`, 'info');
    
    // Simulate report viewing
    setTimeout(() => {
        showNotification(`${reportName} cargado exitosamente`, 'success');
    }, 1500);
}

function downloadReport(reportType) {
    const reportNames = {
        'executive': 'Reporte Ejecutivo',
        'sales': 'Análisis de Ventas',
        'inventory': 'Reporte de Inventario',
        'performance': 'Rendimiento del Equipo'
    };
    
    const reportName = reportNames[reportType] || 'Reporte';
    showNotification(`Descargando ${reportName}...`, 'info');
    
    // Simulate download
    setTimeout(() => {
        showNotification(`${reportName} descargado exitosamente`, 'success');
    }, 1000);
}

// Stock management functions
function loadStockProducts() {
    const stockProductsContainer = document.getElementById('stockProducts');
    if (!stockProductsContainer) return;
    
    stockProductsContainer.innerHTML = '';
    
    products.forEach(product => {
        const stockLevel = product.stock <= 5 ? 'critical-stock' : 
                          product.stock <= 10 ? 'low-stock' : 'normal-stock';
        
        const sizesHtml = product.sizes && product.sizes.length > 0 ? 
            `<div class="product-sizes">Tallas: ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}</div>` : 
            '<div class="product-sizes">Tallas: <span class="size-tag">No especificada</span></div>';
        
        const productCard = document.createElement('div');
        productCard.className = `product-card stock-view ${stockLevel}`;
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}"
                 onerror="handleImageError(this, '${product.name}')"
                 onload="handleImageLoad(this)">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${formatCLP(product.price)}</p>
                <p class="product-stock ${stockLevel}">Stock: ${product.stock} unidades</p>
                <p class="product-category">Categoría: ${product.category}</p>
                ${sizesHtml}
                ${product.stock <= 5 ? '<p class="stock-alert">⚠️ Stock Crítico - Solicitar inmediatamente</p>' : ''}
                ${product.stock > 5 && product.stock <= 10 ? '<p class="stock-alert">⚠️ Stock Bajo - Considerar reposición</p>' : ''}
            </div>
            <div class="product-actions">
                <button class="btn btn-small btn-primary" onclick="requestStock(${product.id})">Solicitar Stock</button>
                <button class="btn btn-small" onclick="editProductStock(${product.id})">Editar Stock</button>
                <button class="btn btn-small btn-info" onclick="viewStockHistory(${product.id})">Ver Historial</button>
            </div>
        `;
        stockProductsContainer.appendChild(productCard);
    });
    
    // Actualizar resumen después de cargar productos
    updateInventorySummary();
}

function requestStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Solicitar cantidad específica al gerente
    const quantityRequested = prompt(`¿Cuántas unidades desea solicitar para "${product.name}"?\n\nStock actual: ${product.stock} unidades\nStock recomendado: ${product.stock <= 5 ? '20-50' : '10-30'} unidades`, product.stock <= 5 ? '30' : '20');
    
    if (quantityRequested === null || isNaN(quantityRequested) || quantityRequested <= 0) {
        showNotification('Solicitud cancelada o cantidad inválida', 'error');
        return;
    }
    
    const quantity = parseInt(quantityRequested);
    const priority = product.stock <= 5 ? 'Alta' : product.stock <= 10 ? 'Media' : 'Baja';
    
    // Guardar solicitud en localStorage
    const stockRequests = JSON.parse(localStorage.getItem('stockRequests') || '[]');
    const newRequest = {
        id: Date.now(),
        productId: productId,
        productName: product.name,
        currentStock: product.stock,
        quantityRequested: quantity,
        priority: priority,
        requestDate: new Date().toLocaleDateString('es-ES'),
        requestTime: new Date().toLocaleTimeString('es-ES'),
        status: 'Pendiente Aprobación',
        requestedBy: localStorage.getItem('username') || 'Gerente Local',
        estimatedDelivery: getEstimatedDelivery(),
        reason: product.stock <= 5 ? 'Stock crítico' : 'Reposición preventiva'
    };
    
    stockRequests.push(newRequest);
    localStorage.setItem('stockRequests', JSON.stringify(stockRequests));
    
    showNotification(`Solicitud de ${quantity} unidades de "${product.name}" enviada exitosamente.\nPrioridad: ${priority}\nEntrega estimada: ${newRequest.estimatedDelivery}`, 'success');
    
    // Simular procesamiento de solicitud
    setTimeout(() => {
        updateRequestStatus(newRequest.id, 'En Proceso');
        showNotification(`Solicitud ${newRequest.id} ahora está en proceso`, 'info');
        
        // Simular llegada del stock
        setTimeout(() => {
            product.stock += quantity;
            updateRequestStatus(newRequest.id, 'Completada');
            loadStockProducts();
            showNotification(`Stock recibido: ${product.name} ahora tiene ${product.stock} unidades`, 'success');
        }, 3000);
    }, 2000);
}

function editProductStock(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newStock = prompt(`Ingrese el nuevo stock para ${product.name}:`, product.stock);
    if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
        product.stock = parseInt(newStock);
        loadStockProducts();
        showNotification(`Stock actualizado: ${product.name} ahora tiene ${product.stock} unidades`, 'success');
    }
}

// Filter functions
function filterStockProducts(filter) {
    const productCards = document.querySelectorAll('.product-card.stock-view');
    
    productCards.forEach(card => {
        const stockText = card.querySelector('.product-stock').textContent;
        const stockNumber = parseInt(stockText.match(/\d+/)[0]);
        
        let shouldShow = true;
        
        switch (filter) {
            case 'stock-critico':
                shouldShow = stockNumber <= 5;
                break;
            case 'stock-bajo':
                shouldShow = stockNumber > 5 && stockNumber <= 10;
                break;
            case 'stock-normal':
                shouldShow = stockNumber > 10;
                break;
            case 'todos':
            default:
                shouldShow = true;
                break;
        }
        
        card.style.display = shouldShow ? '' : 'none';
    });
}

function filterStockByCategory(category) {
    const productCards = document.querySelectorAll('.product-card.stock-view');
    
    productCards.forEach(card => {
        const productCategory = card.querySelector('.product-category').textContent.toLowerCase();
        
        if (category === 'todas' || productCategory.includes(category.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Alert management functions
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('alert-action')) {
        const alertItem = e.target.closest('.alert-item');
        const alertTitle = alertItem.querySelector('h4').textContent;
        
        if (alertTitle.includes('Stock')) {
            showNotification('Redirigiendo a gestión de inventario...', 'info');
        } else if (alertTitle.includes('Meta')) {
            showNotification('Cargando reporte de metas...', 'info');
        } else if (alertTitle.includes('Reporte')) {
            showNotification('Descargando reporte semanal...', 'info');
        }
    }
});

// Enhanced search functionality for manager dashboard
document.addEventListener('DOMContentLoaded', function() {
    const searchInputs = document.querySelectorAll('.search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const currentSection = document.querySelector('.content-section.active');
            
            if (currentSection && currentSection.id === 'vendedores') {
                // Search in seller cards
                const sellerCards = document.querySelectorAll('.seller-card');
                sellerCards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            } else if (currentSection && currentSection.id === 'reposicion') {
                // Search in stock products
                const stockCards = document.querySelectorAll('.product-card.stock-view');
                stockCards.forEach(card => {
                    const text = card.textContent.toLowerCase();
                    card.style.display = text.includes(searchTerm) ? '' : 'none';
                });
            }
        });
    });
});

// Filter functionality for manager dashboard
document.addEventListener('DOMContentLoaded', function() {
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function(e) {
            const filterValue = e.target.value;
            const currentSection = document.querySelector('.content-section.active');
            
            if (currentSection && currentSection.id === 'vendedores') {
                filterSellers(filterValue);
            } else if (currentSection && currentSection.id === 'reposicion') {
                if (filterValue.includes('stock')) {
                    filterStockProducts(filterValue);
                } else {
                    filterStockByCategory(filterValue);
                }
            } else {
                showNotification(`Filtro aplicado: ${filterValue}`, 'info');
            }
        });
    });
});

// Filter sellers by status
function filterSellers(status) {
    const sellerCards = document.querySelectorAll('.seller-card');
    
    sellerCards.forEach(card => {
        const sellerStatus = card.querySelector('.seller-status').textContent.toLowerCase();
        
        if (status === 'todos los vendedores' || sellerStatus.includes(status.toLowerCase())) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// Manager notification system
function showManagerNotification(action, details) {
    const messages = {
        'report_generated': `Reporte generado: ${details}`,
        'seller_added': `Vendedor agregado: ${details}`,
        'config_saved': `Configuración guardada: ${details}`,
        'alert_reviewed': `Alerta revisada: ${details}`,
        'data_exported': `Datos exportados: ${details}`
    };
    
    const message = messages[action] || `Acción completada: ${details}`;
    showNotification(message, 'success');
}

// Initialize manager dashboard when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Only run on manager dashboard
    if (window.location.pathname.includes('gerente.html')) {
        // Cargar productos con imágenes correctas
        await loadProductImages();
        
        // Load stock products if we're on stock management section
        setTimeout(() => {
            loadStockProducts();
        }, 500);
    }
});

// Función para cargar imágenes de productos
async function loadProductImages() {
    // Actualizar rutas de imágenes para que funcionen correctamente
    products.forEach(product => {
        // Asegurar que las rutas sean relativas y correctas
        if (product.image && !product.image.startsWith('http')) {
            // Si la imagen no empieza con productos/, agregarla
            if (!product.image.startsWith('productos/')) {
                product.image = 'productos/' + product.image;
            }
        }
    });
}

// Funciones auxiliares para gestión de stock
function getEstimatedDelivery() {
    const today = new Date();
    const deliveryDate = new Date(today.getTime() + (3 * 24 * 60 * 60 * 1000)); // 3 días
    return deliveryDate.toLocaleDateString('es-ES');
}

function updateRequestStatus(requestId, newStatus) {
    const stockRequests = JSON.parse(localStorage.getItem('stockRequests') || '[]');
    const requestIndex = stockRequests.findIndex(req => req.id === requestId);
    
    if (requestIndex !== -1) {
        stockRequests[requestIndex].status = newStatus;
        if (newStatus === 'Completada') {
            stockRequests[requestIndex].completedDate = new Date().toLocaleDateString('es-ES');
            stockRequests[requestIndex].completedTime = new Date().toLocaleTimeString('es-ES');
        }
        localStorage.setItem('stockRequests', JSON.stringify(stockRequests));
    }
}

function viewStockHistory(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const stockRequests = JSON.parse(localStorage.getItem('stockRequests') || '[]');
    const productRequests = stockRequests.filter(req => req.productId === productId);
    
    if (productRequests.length === 0) {
        showNotification(`No hay historial de solicitudes para ${product.name}`, 'info');
        return;
    }
    
    let historyMessage = `Historial de solicitudes para "${product.name}":\n\n`;
    productRequests.forEach(req => {
        historyMessage += `• ${req.requestDate} - ${req.quantityRequested} unidades\n`;
        historyMessage += `  Estado: ${req.status} | Prioridad: ${req.priority}\n`;
        if (req.completedDate) {
            historyMessage += `  Completado: ${req.completedDate}\n`;
        }
        historyMessage += `\n`;
    });
    
    alert(historyMessage);
}

function getStockRequestsSummary() {
    const stockRequests = JSON.parse(localStorage.getItem('stockRequests') || '[]');
    const pending = stockRequests.filter(req => req.status === 'Pendiente Aprobación').length;
    const inProcess = stockRequests.filter(req => req.status === 'En Proceso').length;
    const completed = stockRequests.filter(req => req.status === 'Completada').length;
    
    return {
        pending: pending,
        inProcess: inProcess,
        completed: completed,
        total: stockRequests.length
    };
}

// Función para mostrar resumen de solicitudes
function showStockRequestsSummary() {
    const summary = getStockRequestsSummary();
    const message = `Resumen de Solicitudes de Stock:\n\n` +
                   `• Pendientes: ${summary.pending}\n` +
                   `• En Proceso: ${summary.inProcess}\n` +
                   `• Completadas: ${summary.completed}\n` +
                   `• Total: ${summary.total}`;
    
    alert(message);
}

// Función para solicitar stock masivo
function requestBulkStock() {
    const lowStockProducts = products.filter(p => p.stock <= 10);
    
    if (lowStockProducts.length === 0) {
        showNotification('No hay productos con stock bajo para solicitar', 'info');
        return;
    }
    
    const confirmMessage = `¿Desea solicitar stock para ${lowStockProducts.length} productos con stock bajo?\n\n` +
                          lowStockProducts.map(p => `• ${p.name}: ${p.stock} unidades`).join('\n');
    
    if (confirm(confirmMessage)) {
        let requestsCreated = 0;
        
        lowStockProducts.forEach(product => {
            const quantity = product.stock <= 5 ? 30 : 20;
            const stockRequests = JSON.parse(localStorage.getItem('stockRequests') || '[]');
            
            const newRequest = {
                id: Date.now() + requestsCreated,
                productId: product.id,
                productName: product.name,
                currentStock: product.stock,
                quantityRequested: quantity,
                priority: product.stock <= 5 ? 'Alta' : 'Media',
                requestDate: new Date().toLocaleDateString('es-ES'),
                requestTime: new Date().toLocaleTimeString('es-ES'),
                status: 'Pendiente Aprobación',
                requestedBy: localStorage.getItem('username') || 'Gerente Local',
                estimatedDelivery: getEstimatedDelivery(),
                reason: 'Solicitud masiva - Stock bajo'
            };
            
            stockRequests.push(newRequest);
            requestsCreated++;
            
            localStorage.setItem('stockRequests', JSON.stringify(stockRequests));
        });
        
        showNotification(`${requestsCreated} solicitudes de stock creadas exitosamente`, 'success');
    }
}

// Función para actualizar resumen de inventario
function updateInventorySummary() {
    const totalProducts = products.length;
    const criticalStock = products.filter(p => p.stock <= 5).length;
    const lowStock = products.filter(p => p.stock > 5 && p.stock <= 10).length;
    const normalStock = products.filter(p => p.stock > 10).length;
    
    // Actualizar valores en el DOM
    const totalElement = document.getElementById('totalProducts');
    const criticalElement = document.getElementById('criticalStock');
    const lowElement = document.getElementById('lowStock');
    const normalElement = document.getElementById('normalStock');
    
    if (totalElement) totalElement.textContent = totalProducts;
    if (criticalElement) criticalElement.textContent = criticalStock;
    if (lowElement) lowElement.textContent = lowStock;
    if (normalElement) normalElement.textContent = normalStock;
}

// Funciones para manejo de imágenes
function handleImageError(imgElement, productName) {
    console.log('Error loading image for:', productName);
    imgElement.src = `https://via.placeholder.com/200x200/e9ecef/666666?text=${encodeURIComponent(productName)}`;
    imgElement.style.background = '#f8f9fa';
    imgElement.style.border = '2px dashed #dee2e6';
}

function handleImageLoad(imgElement) {
    console.log('Successfully loaded image');
    imgElement.style.background = 'transparent';
    imgElement.style.border = 'none';
}

// Make functions available globally
window.openAddSellerModal = openAddSellerModal;
window.viewSellerDetails = viewSellerDetails;
window.editSeller = editSeller;
window.viewSellerReports = viewSellerReports;
window.generateExecutiveReport = generateExecutiveReport;
window.viewReport = viewReport;
window.downloadReport = downloadReport;
window.requestStock = requestStock;
window.editProductStock = editProductStock;
window.filterStockProducts = filterStockProducts;
window.filterStockByCategory = filterStockByCategory;
window.loadStockProducts = loadStockProducts;
window.viewStockHistory = viewStockHistory;
window.showStockRequestsSummary = showStockRequestsSummary;
window.requestBulkStock = requestBulkStock;
window.updateInventorySummary = updateInventorySummary;
window.loadProductImages = loadProductImages;
window.handleImageError = handleImageError;
window.handleImageLoad = handleImageLoad;
