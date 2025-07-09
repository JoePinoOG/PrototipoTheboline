// Vendedor-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize if we're on seller dashboard
    if (window.location.pathname.includes('vendedor.html')) {
        initializeSellerStats();
        
        // Load sales data on page load
        setTimeout(() => {
            loadSalesData();
        }, 1000);
        
        // Load seller products
        loadSellerProducts();
        updateSaleModalProducts();
    }
});

// Enhanced stats initialization for seller
function initializeSellerStats() {
    // Animate stat numbers
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
}

// Load sales data from localStorage
function loadSalesData() {
    // Update the sales table
    updateSalesTable();
    
    // Update recent sales display
    updateRecentSales();
    
    // Update sales statistics
    updateSalesStats();
}

// Enhanced notification system for seller actions
function showSellerNotification(action, details) {
    const messages = {
        'sale_created': `Venta creada: ${details}`,
        'client_contacted': `Cliente contactado: ${details}`,
        'product_sold': `Producto vendido: ${details}`,
        'commission_calculated': `Comisión calculada: ${details}`,
        'report_generated': `Reporte generado: ${details}`
    };
    
    const message = messages[action] || `Acción completada: ${details}`;
    showNotification(message, 'success');
}

// Function to load products in seller dashboard
function loadSellerProducts() {
    const productsGrid = document.getElementById('sellerProductsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const commission = (product.price * 0.05);
        const sizesHtml = product.sizes && product.sizes.length > 0 ? 
            `<div class="product-sizes">Tallas: ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}</div>` : 
            '<div class="product-sizes">Tallas: <span class="size-tag">No especificada</span></div>';
        
        const productCard = document.createElement('div');
        productCard.className = 'product-card seller-view';
        productCard.innerHTML = `
            <img src="${getImageUrl(product.image)}" alt="${product.name}"
                 onerror="this.src='https://via.placeholder.com/200x200/e9ecef/666666?text=${encodeURIComponent(product.name)}'; this.style.background='#f8f9fa';"
                 onload="this.style.background='transparent';">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-price">${formatCLP(product.price)}</p>
                <p class="product-commission">Comisión: ${formatCLP(commission)} (5%)</p>
                <p class="product-stock">Stock: ${product.stock} unidades</p>
                <p class="product-category">Categoría: ${product.category}</p>
                ${sizesHtml}
            </div>
            <div class="product-actions">
                <button class="btn btn-small btn-primary" onclick="sellProduct(${product.id})">Vender</button>
                <button class="btn btn-small" onclick="showProductDetails(${product.id})">Detalles</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Function to update product options in sale modal
function updateSaleModalProducts() {
    const productSelect = document.getElementById('saleProduct');
    if (!productSelect) return;
    
    productSelect.innerHTML = '<option value="">Seleccionar producto...</option>';
    
    products.forEach(product => {
        if (product.stock > 0) {
            const option = document.createElement('option');
            option.value = product.id;
            option.textContent = `${product.name} - ${formatCLP(product.price)} (Stock: ${product.stock})`;
            productSelect.appendChild(option);
        }
    });
}

// Product management functions
function sellProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.stock > 0) {
        openSaleModal();
        
        // Pre-select the product in the modal
        const productSelect = document.getElementById('saleProduct');
        if (productSelect) {
            productSelect.value = productId;
        }
        
        showNotification(`Iniciando venta de ${product.name}`, 'info');
    } else {
        showNotification('Producto sin stock disponible', 'error');
    }
}

function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        const details = `
DETALLES DEL PRODUCTO
==================

Nombre: ${product.name}
Precio: ${formatCLP(product.price)}
Categoría: ${product.category}
Stock: ${product.stock} unidades
Tallas: ${product.sizes.join(', ')}

Comisión por venta: ${formatCLP(product.price * 0.05)} (5%)

Descripción:
${product.description}
        `;
        
        alert(details);
    }
}

// Sales and Payment System
let currentSaleData = {};
let currentStep = 1;

// Sale Modal Functions
function openSaleModal() {
    const modal = document.getElementById('saleModal');
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Reset to first step
    goToStep(1);
    
    // Focus on first input
    setTimeout(() => {
        document.getElementById('saleClient').focus();
    }, 100);
}

function closeSaleModal() {
    document.getElementById('saleModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset form
    const saleForm = document.getElementById('saleForm');
    if (saleForm) {
        saleForm.reset();
    }
    
    // Reset to first step
    goToStep(1);
    
    // Clear current sale data
    currentSaleData = {};
}

// Step Navigation
function goToStep(stepNumber) {
    console.log('goToStep called with:', stepNumber);
    
    // Hide all steps
    document.querySelectorAll('.sale-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Show selected step
    const targetStep = document.getElementById(`saleStep${stepNumber}`);
    if (targetStep) {
        targetStep.classList.add('active');
        console.log('Step', stepNumber, 'activated');
    } else {
        console.error('Step element not found:', `saleStep${stepNumber}`);
    }
    
    currentStep = stepNumber;
}

// Enhanced sale form handling with step flow
document.addEventListener('DOMContentLoaded', function() {
    // Setup sale form with delay to ensure DOM is ready
    setTimeout(() => {
        const saleForm = document.getElementById('saleForm');
        
        if (saleForm) {
            saleForm.removeEventListener('submit', handleSaleSubmit);
            saleForm.addEventListener('submit', handleSaleSubmit);
        }
        
        // Setup process payment button
        const processPaymentBtn = document.getElementById('processPaymentBtn');
        if (processPaymentBtn) {
            processPaymentBtn.addEventListener('click', processPayment);
        }
    }, 500);
});

function handleSaleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const clientSelect = document.getElementById('saleClient');
    const productSelect = document.getElementById('saleProduct');
    const quantityInput = document.getElementById('saleQuantity');
    const discountInput = document.getElementById('saleDiscount');
    
    // Validate form elements
    if (!clientSelect || !productSelect || !quantityInput || !discountInput) {
        console.error('Form elements not found');
        showNotification('Error: No se pudieron encontrar los elementos del formulario', 'error');
        return;
    }
    
    // Validate selections
    if (!clientSelect.value) {
        showNotification('Por favor seleccione un cliente', 'error');
        return;
    }
    
    if (!productSelect.value) {
        showNotification('Por favor seleccione un producto', 'error');
        return;
    }
    
    // Get selected product details
    const selectedProduct = products.find(p => p.id == productSelect.value);
    
    if (!selectedProduct) {
        showNotification('Por favor seleccione un producto válido', 'error');
        return;
    }
    
    // Calculate totals
    const quantity = parseInt(quantityInput.value) || 1;
    const discount = parseFloat(discountInput.value) || 0;
    const unitPrice = selectedProduct.price;
    const subtotal = unitPrice * quantity;
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;
    
    // Store sale data for payment step
    currentSaleData = {
        client: clientSelect.options[clientSelect.selectedIndex].text,
        product: selectedProduct.name,
        quantity: quantity,
        unitPrice: unitPrice,
        discount: discount,
        discountAmount: discountAmount,
        subtotal: subtotal,
        total: total,
        commission: total * 0.05,
        saleId: 'VT' + Date.now().toString().slice(-6),
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES'),
        seller: localStorage.getItem('username') || 'Vendedor'
    };
    
    // Move to payment step
    showPaymentStep();
}

// Payment Step Functions
function showPaymentStep() {
    // Go to step 2
    goToStep(2);
    
    // Check if we're on the right step
    const currentStepElement = document.getElementById('saleStep2');
    
    // Update sale summary
    const summaryElements = {
        client: document.getElementById('summaryClient'),
        product: document.getElementById('summaryProduct'),
        quantity: document.getElementById('summaryQuantity'),
        price: document.getElementById('summaryPrice'),
        discount: document.getElementById('summaryDiscount'),
        total: document.getElementById('summaryTotal')
    };
    
    // Check if all elements exist
    const missingElements = Object.keys(summaryElements).filter(key => !summaryElements[key]);
    if (missingElements.length > 0) {
        console.error('Missing summary elements:', missingElements);
        showNotification('Error: Elementos del resumen no encontrados: ' + missingElements.join(', '), 'error');
        return;
    }
    
    // Populate summary
    try {
        summaryElements.client.textContent = currentSaleData.client || 'Sin cliente';
        summaryElements.product.textContent = currentSaleData.product || 'Sin producto';
        summaryElements.quantity.textContent = currentSaleData.quantity || '0';
        summaryElements.price.textContent = formatCLP(currentSaleData.unitPrice || 0);
        summaryElements.discount.textContent = (currentSaleData.discount || 0) + '%';
        summaryElements.total.textContent = formatCLP(currentSaleData.total || 0);
        
        // Reset payment method selection and disable process payment button
        currentSaleData.paymentMethod = null;
        document.querySelectorAll('.sale-payment-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        const processPaymentBtn = document.getElementById('processPaymentBtn');
        if (processPaymentBtn) {
            processPaymentBtn.disabled = true;
            // Re-configure event listener to ensure it's working
            processPaymentBtn.removeEventListener('click', processPayment);
            processPaymentBtn.addEventListener('click', processPayment);
        }
        
        showNotification('Resumen de venta cargado', 'success');
    } catch (error) {
        console.error('Error populating summary:', error);
        showNotification('Error al cargar el resumen de venta', 'error');
    }
}

// Payment Method Selection
function selectPaymentMethod(method) {
    console.log('selectPaymentMethod called with:', method);
    
    // Remove previous selection
    document.querySelectorAll('.sale-payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Add selection to clicked method
    const clickedOption = event.target.closest('.sale-payment-option');
    if (clickedOption) {
        clickedOption.classList.add('selected');
        currentSaleData.paymentMethod = method;
        console.log('Payment method set to:', method);
        
        // Enable process payment button
        const processPaymentBtn = document.getElementById('processPaymentBtn');
        if (processPaymentBtn) {
            processPaymentBtn.disabled = false;
            console.log('Process payment button enabled');
        }
    }
}

// Process Payment
function processPayment() {
    console.log('processPayment called');
    console.log('currentSaleData:', currentSaleData);
    
    if (!currentSaleData.paymentMethod) {
        console.log('No payment method selected');
        showNotification('Por favor seleccione un método de pago', 'error');
        return;
    }
    
    console.log('Payment method selected:', currentSaleData.paymentMethod);
    
    // Show receipt step
    showReceiptStep();
}

// Receipt Step
function showReceiptStep() {
    console.log('showReceiptStep called');
    console.log('currentSaleData before receipt:', currentSaleData);
    
    // Go to step 3
    goToStep(3);
    
    // Update receipt data
    const receiptData = {
        saleId: currentSaleData.saleId,
        date: currentSaleData.date,
        time: currentSaleData.time,
        client: currentSaleData.client,
        product: currentSaleData.product,
        quantity: currentSaleData.quantity,
        unitPrice: currentSaleData.unitPrice,
        subtotal: currentSaleData.subtotal,
        discount: currentSaleData.discount,
        discountAmount: currentSaleData.discountAmount,
        total: currentSaleData.total,
        paymentMethod: currentSaleData.paymentMethod,
        seller: currentSaleData.seller
    };
    
    console.log('receiptData:', receiptData);
    
    // Update receipt elements
    try {
        document.getElementById('receiptSaleId').textContent = receiptData.saleId;
        document.getElementById('receiptDate').textContent = receiptData.date;
        document.getElementById('receiptTime').textContent = receiptData.time;
        document.getElementById('receiptClient').textContent = receiptData.client;
        document.getElementById('receiptProduct').textContent = receiptData.product;
        document.getElementById('receiptQuantity').textContent = receiptData.quantity;
        document.getElementById('receiptUnitPrice').textContent = formatCLP(receiptData.unitPrice);
        document.getElementById('receiptSubtotal').textContent = formatCLP(receiptData.subtotal);
        document.getElementById('receiptDiscount').textContent = receiptData.discount + '%';
        document.getElementById('receiptDiscountAmount').textContent = formatCLP(receiptData.discountAmount);
        document.getElementById('receiptTotal').textContent = formatCLP(receiptData.total);
        document.getElementById('receiptPaymentMethod').textContent = receiptData.paymentMethod;
        document.getElementById('receiptSeller').textContent = receiptData.seller;
        
        // Calculate and display commission
        const commission = receiptData.total * 0.05; // 5% commission
        document.getElementById('receiptCommission').textContent = formatCLP(commission);
        
        console.log('Receipt elements updated successfully');
        showNotification('Boleta generada exitosamente', 'success');
    } catch (error) {
        console.error('Error updating receipt elements:', error);
        showNotification('Error al generar la boleta', 'error');
    }
}

// Receipt Functions
function printReceipt() {
    console.log('printReceipt called');
    window.print();
    showNotification('Preparando impresión...', 'info');
}

function saveReceipt() {
    console.log('saveReceipt called');
    showNotification('Boleta guardada exitosamente', 'success');
}

function finalizeSale() {
    // Create sale record
    const saleRecord = {
        id: currentSaleData.saleId,
        client: currentSaleData.client,
        product: currentSaleData.product,
        quantity: currentSaleData.quantity,
        unitPrice: currentSaleData.unitPrice,
        subtotal: currentSaleData.subtotal,
        discount: currentSaleData.discount,
        discountAmount: currentSaleData.discountAmount,
        total: currentSaleData.total,
        paymentMethod: currentSaleData.paymentMethod,
        date: currentSaleData.date,
        time: currentSaleData.time,
        status: 'Completada',
        commission: currentSaleData.commission,
        seller: currentSaleData.seller
    };
    
    // Save to localStorage
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    existingSales.push(saleRecord);
    localStorage.setItem('sales', JSON.stringify(existingSales));
    
    // Update all sales-related displays
    updateSalesTable();
    updateRecentSales();
    updateSalesStats();
    
    // Close modal and reset
    closeSaleModal();
    
    // Refresh products display
    if (window.location.pathname.includes('vendedor.html')) {
        loadSellerProducts();
    }
    
    showNotification(`Venta ${currentSaleData.saleId} finalizada exitosamente`, 'success');
    
    // Clear current sale data
    currentSaleData = {};
}

// Funciones simplificadas para el flujo de venta
function continuarPago() {
    console.log('continuarPago called');
    
    // Crear datos ficticios para la venta
    currentSaleData = {
        saleId: 'VT' + Date.now().toString().slice(-6),
        client: 'Juan Pérez',
        product: 'Zapatillas Nike Air Max',
        quantity: 1,
        unitPrice: 89990,
        discount: 0,
        discountAmount: 0,
        subtotal: 89990,
        total: 89990,
        date: new Date().toLocaleDateString('es-ES'),
        time: new Date().toLocaleTimeString('es-ES'),
        seller: 'Vendedor Test',
        commission: 89990 * 0.05,
        paymentMethod: null
    };
    
    console.log('Sale data created:', currentSaleData);
    
    // Ir al paso 2
    irAPaso2();
}

function irAPaso2() {
    console.log('irAPaso2 called');
    
    // Cambiar a paso 2
    document.querySelectorAll('.sale-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('saleStep2').classList.add('active');
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step2').classList.add('active');
    
    // Llenar el resumen
    document.getElementById('summaryClient').textContent = currentSaleData.client;
    document.getElementById('summaryProduct').textContent = currentSaleData.product;
    document.getElementById('summaryQuantity').textContent = currentSaleData.quantity;
    document.getElementById('summaryPrice').textContent = formatCLP(currentSaleData.unitPrice);
    document.getElementById('summaryDiscount').textContent = currentSaleData.discount + '%';
    document.getElementById('summaryTotal').textContent = formatCLP(currentSaleData.total);
    
    // Resetear selección de método de pago
    document.querySelectorAll('.sale-payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Deshabilitar botón procesar pago
    document.getElementById('processPaymentBtn').disabled = true;
    
    showNotification('Paso 2: Seleccionar método de pago', 'info');
}

function seleccionarMetodoPago(metodo) {
    console.log('seleccionarMetodoPago called with:', metodo);
    
    // Remover selección anterior
    document.querySelectorAll('.sale-payment-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Agregar selección al método clickeado
    event.target.closest('.sale-payment-option').classList.add('selected');
    
    // Guardar método de pago
    currentSaleData.paymentMethod = metodo;
    
    // Habilitar botón procesar pago
    document.getElementById('processPaymentBtn').disabled = false;
    
    showNotification('Método de pago seleccionado: ' + metodo, 'success');
}

function procesarPago() {
    console.log('procesarPago called');
    
    if (!currentSaleData.paymentMethod) {
        showNotification('Seleccione un método de pago', 'error');
        return;
    }
    
    console.log('Processing payment with method:', currentSaleData.paymentMethod);
    
    // Ir al paso 3
    irAPaso3();
}

function irAPaso3() {
    console.log('irAPaso3 called');
    
    // Cambiar a paso 3
    document.querySelectorAll('.sale-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('saleStep3').classList.add('active');
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step3').classList.add('active');
    
    // Llenar la boleta
    document.getElementById('receiptSaleId').textContent = currentSaleData.saleId;
    document.getElementById('receiptDate').textContent = currentSaleData.date;
    document.getElementById('receiptTime').textContent = currentSaleData.time;
    document.getElementById('receiptClient').textContent = currentSaleData.client;
    document.getElementById('receiptSeller').textContent = currentSaleData.seller;
    document.getElementById('receiptProduct').textContent = currentSaleData.product;
    document.getElementById('receiptQuantity').textContent = currentSaleData.quantity;
    document.getElementById('receiptUnitPrice').textContent = formatCLP(currentSaleData.unitPrice);
    document.getElementById('receiptSubtotal').textContent = formatCLP(currentSaleData.subtotal);
    document.getElementById('receiptDiscount').textContent = currentSaleData.discount + '%';
    document.getElementById('receiptDiscountAmount').textContent = formatCLP(currentSaleData.discountAmount);
    document.getElementById('receiptTotal').textContent = formatCLP(currentSaleData.total);
    document.getElementById('receiptPaymentMethod').textContent = currentSaleData.paymentMethod;
    document.getElementById('receiptCommission').textContent = formatCLP(currentSaleData.commission);
    
    showNotification('Boleta generada correctamente', 'success');
}

function regresarPaso1() {
    console.log('regresarPaso1 called');
    
    // Cambiar a paso 1
    document.querySelectorAll('.sale-step').forEach(step => {
        step.classList.remove('active');
    });
    
    document.getElementById('saleStep1').classList.add('active');
    
    // Actualizar indicadores de pasos
    document.querySelectorAll('.step').forEach(step => {
        step.classList.remove('active');
    });
    document.getElementById('step1').classList.add('active');
    
    showNotification('Regresando al paso 1', 'info');
}

function finalizarVenta() {
    console.log('finalizarVenta called');
    
    // Guardar venta en localStorage
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    existingSales.push(currentSaleData);
    localStorage.setItem('sales', JSON.stringify(existingSales));
    
    showNotification('Venta finalizada exitosamente', 'success');
    
    // Cerrar modal
    closeSaleModal();
    
    // Limpiar datos
    currentSaleData = {};
}

// Sales Management Functions
function updateSalesTable() {
    const salesTableBody = document.querySelector('#ventas .data-table tbody');
    if (!salesTableBody) return;
    
    // Get sales from localStorage
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    
    // Clear existing rows
    salesTableBody.innerHTML = '';
    
    // Add stored sales (most recent first)
    existingSales.reverse().forEach(sale => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${sale.id}</td>
            <td>${sale.client}</td>
            <td>${sale.date}</td>
            <td>${formatCLP(sale.total)}</td>
            <td><span class="status ${sale.status === 'Completada' ? 'active' : 'pending'}">${sale.status}</span></td>
            <td>${formatCLP(sale.commission)}</td>
            <td>
                <button class="btn btn-small" onclick="viewSale('${sale.id}')">Ver</button>
                <button class="btn btn-small" onclick="editSale('${sale.id}')">Editar</button>
            </td>
        `;
        salesTableBody.appendChild(row);
    });
    
    // If no sales, show default rows
    if (existingSales.length === 0) {
        salesTableBody.innerHTML = `
            <tr>
                <td>#VT001</td>
                <td>Juan Pérez</td>
                <td>08/07/2025</td>
                <td>${formatCLP(125000)}</td>
                <td><span class="status active">Completada</span></td>
                <td>${formatCLP(6250)}</td>
                <td>
                    <button class="btn btn-small">Ver</button>
                    <button class="btn btn-small">Editar</button>
                </td>
            </tr>
            <tr>
                <td>#VT002</td>
                <td>María García</td>
                <td>07/07/2025</td>
                <td>${formatCLP(89000)}</td>
                <td><span class="status active">Completada</span></td>
                <td>${formatCLP(4450)}</td>
                <td>
                    <button class="btn btn-small">Ver</button>
                    <button class="btn btn-small">Editar</button>
                </td>
            </tr>
            <tr>
                <td>#VT003</td>
                <td>Carlos López</td>
                <td>07/07/2025</td>
                <td>${formatCLP(210000)}</td>
                <td><span class="status pending">Pendiente</span></td>
                <td>${formatCLP(10500)}</td>
                <td>
                    <button class="btn btn-small">Ver</button>
                    <button class="btn btn-small">Editar</button>
                </td>
            </tr>
        `;
    }
}

// View sale details
function viewSale(saleId) {
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const sale = existingSales.find(s => s.id === saleId);
    
    if (sale) {
        const saleDetails = `
DETALLES DE LA VENTA
====================

ID de Venta: ${sale.id}
Cliente: ${sale.client}
Fecha: ${sale.date}
Hora: ${sale.time || 'No especificada'}

PRODUCTOS:
Producto: ${sale.product}
Cantidad: ${sale.quantity || 1}
Precio Unitario: ${formatCLP(sale.unitPrice || sale.total)}
Subtotal: ${formatCLP(sale.subtotal || sale.total)}
Descuento: ${sale.discount || 0}%
Monto Descuento: ${formatCLP(sale.discountAmount || 0)}

PAGO:
Método de Pago: ${sale.paymentMethod || 'No especificado'}
Total Final: ${formatCLP(sale.total)}

VENDEDOR:
Vendedor: ${sale.seller}
Comisión: ${formatCLP(sale.commission)}

Estado: ${sale.status}
        `;
        
        alert(saleDetails);
    } else {
        showNotification('Venta no encontrada', 'error');
    }
}

// Edit sale (placeholder)
function editSale(saleId) {
    showNotification(`Función de edición para venta ${saleId} próximamente`, 'info');
}

// Clear all sales (for development/testing)
function clearAllSales() {
    if (confirm('¿Está seguro de que desea eliminar todas las ventas guardadas?')) {
        localStorage.removeItem('sales');
        updateSalesTable();
        updateRecentSales();
        updateSalesStats();
        showNotification('Todas las ventas han sido eliminadas', 'success');
    }
}

// Add sample sales for testing
function addSampleSales() {
    const sampleSales = [
        {
            id: 'VT' + Date.now().toString().slice(-6),
            client: 'Ana Martínez',
            product: 'Zapatillas Nike Air Max',
            quantity: 1,
            unitPrice: 89990,
            subtotal: 89990,
            discount: 0,
            discountAmount: 0,
            total: 89990,
            date: '08/07/2025',
            time: '10:30:00',
            status: 'Completada',
            commission: 4499,
            paymentMethod: 'Tarjeta de Crédito',
            seller: 'vendedor'
        },
        {
            id: 'VT' + (Date.now() + 1000).toString().slice(-6),
            client: 'Pedro González',
            product: 'Jeans Slim Fit',
            quantity: 2,
            unitPrice: 45990,
            subtotal: 91980,
            discount: 5,
            discountAmount: 4599,
            total: 87381,
            date: '08/07/2025',
            time: '11:45:00',
            status: 'Completada',
            commission: 4369,
            paymentMethod: 'Efectivo',
            seller: 'vendedor'
        },
        {
            id: 'VT' + (Date.now() + 2000).toString().slice(-6),
            client: 'Laura Rodríguez',
            product: 'Chaqueta Deportiva',
            quantity: 1,
            unitPrice: 69990,
            subtotal: 69990,
            discount: 15,
            discountAmount: 10498,
            total: 59492,
            date: '07/07/2025',
            time: '16:20:00',
            status: 'Completada',
            commission: 2975,
            paymentMethod: 'Tarjeta de Débito',
            seller: 'vendedor'
        }
    ];
    
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const combinedSales = [...existingSales, ...sampleSales];
    localStorage.setItem('sales', JSON.stringify(combinedSales));
    
    updateSalesTable();
    updateRecentSales();
    updateSalesStats();
    
    showNotification('Ventas de ejemplo agregadas', 'success');
}

// Update recent sales in dashboard
function updateRecentSales() {
    const recentSalesList = document.querySelector('.recent-sales .sales-list');
    if (!recentSalesList) return;
    
    // Get recent sales from localStorage
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    const recentSales = existingSales.slice(-3).reverse(); // Get last 3 sales
    
    if (recentSales.length === 0) return;
    
    // Clear existing items
    recentSalesList.innerHTML = '';
    
    // Add recent sales
    recentSales.forEach(sale => {
        const saleItem = document.createElement('div');
        saleItem.className = 'sale-item';
        saleItem.innerHTML = `
            <div class="sale-info">
                <span class="customer-name">${sale.client}</span>
                <span class="sale-date">${sale.date} - ${sale.paymentMethod}</span>
            </div>
            <span class="sale-amount">${formatCLP(sale.total)}</span>
        `;
        recentSalesList.appendChild(saleItem);
    });
}

// Update sales statistics
function updateSalesStats() {
    const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
    
    if (existingSales.length === 0) return;
    
    // Calculate totals
    const totalSales = existingSales.reduce((sum, sale) => sum + parseFloat(sale.total), 0);
    const totalCommissions = existingSales.reduce((sum, sale) => sum + parseFloat(sale.commission), 0);
    const totalProducts = existingSales.reduce((sum, sale) => sum + (sale.quantity || 1), 0);
    
    // Update dashboard stats
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        const numberElement = card.querySelector('.stat-number');
        
        if (title.includes('Ventas del Mes')) {
            numberElement.textContent = formatCLP(totalSales);
        } else if (title.includes('Comisiones')) {
            numberElement.textContent = formatCLP(totalCommissions);
        } else if (title.includes('Productos Vendidos')) {
            numberElement.textContent = totalProducts.toLocaleString();
        }
    });
}

// Client management functions
function openClientModal() {
    showNotification('Modal de agregar cliente próximamente', 'info');
}

// Client card interactions
document.addEventListener('DOMContentLoaded', function() {
    // Contact client functionality
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Contactar') {
            const clientCard = e.target.closest('.client-card');
            const clientName = clientCard.querySelector('h3').textContent;
            showNotification(`Contactando a ${clientName}...`, 'info');
        }
        
        if (e.target.textContent === 'Ver Historial') {
            const clientCard = e.target.closest('.client-card');
            const clientName = clientCard.querySelector('h3').textContent;
            showNotification(`Cargando historial de ${clientName}...`, 'info');
        }
    });
});

// Product selling functionality
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.textContent === 'Vender') {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            openSaleModal();
            showNotification(`Iniciando venta de ${productName}`, 'info');
        }
        
        if (e.target.textContent === 'Detalles') {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            showNotification(`Mostrando detalles de ${productName}`, 'info');
        }
    });
});

// Make functions available globally for testing
window.clearAllSales = clearAllSales;
window.addSampleSales = addSampleSales;
window.loadSalesData = loadSalesData;
window.openSaleModal = openSaleModal;
window.closeSaleModal = closeSaleModal;
window.openClientModal = openClientModal;
window.goToStep = goToStep;
window.selectPaymentMethod = selectPaymentMethod;
window.processPayment = processPayment;
window.printReceipt = printReceipt;
window.saveReceipt = saveReceipt;
window.finalizeSale = finalizeSale;
window.viewSale = viewSale;
window.editSale = editSale;
window.sellProduct = sellProduct;
window.showProductDetails = showProductDetails;
