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

// Función para enviar notificación por email (simulada)
function sendEmailNotification(request) {
    // Simular envío de email
    console.log(`Enviando email a proveedor: ${request.supplier}`);
    console.log(`Asunto: Nueva orden de reposición - ${request.productName}`);
    console.log(`Contenido: Se solicita ${request.quantityRequested} unidades`);
    
    // En un sistema real, aquí se integraría con un servicio de email
    return {
        success: true,
        message: `Email enviado a ${request.supplier} exitosamente`,
        timestamp: new Date().toISOString()
    };
}

// Función para aprobar orden de reposición
function approveReorderRequest(requestId) {
    const request = reorderRequests.find(r => r.id === requestId);
    if (!request) return false;
    
    request.status = 'Aprobada';
    request.approvedDate = new Date().toLocaleDateString('es-ES');
    request.approvedTime = new Date().toLocaleTimeString('es-ES');
    
    // Enviar notificación por email
    const emailResult = sendEmailNotification(request);
    request.emailSent = emailResult.success;
    request.emailTimestamp = emailResult.timestamp;
    
    localStorage.setItem('reorderRequests', JSON.stringify(reorderRequests));
    
    return true;
}

// Función para marcar productos en promoción
function markProductsInPromotion() {
    return products.map(product => {
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
}
