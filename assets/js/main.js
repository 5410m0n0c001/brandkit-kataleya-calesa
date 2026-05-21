/* ==========================================================================
   KATALEYA × CALESA - LUXURY WEB SYSTEM INTERACTIVE CODE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Dark Mode Toggle
    initDarkMode();

    // 2. Interactive Color Copy
    initColorCopier();

    // 3. Tab Switcher for Calesa Style Variants
    initStyleSwitcher();

    // 4. Custom Lightbox Gallery
    initLightbox();

    // 5. Resource Center Filters
    initResourceFilters();

    // 6. Interactive Hashtags Copy
    initHashtagsCopier();

    // 7. Dynamic PDF Report Generator
    initPdfGenerator();

    // 8. ZIP Download Notification
    initZipTrigger();
});

/**
 * Dark Mode Management
 */
function initDarkMode() {
    const toggleBtn = document.getElementById('dark-mode-toggle');
    if (!toggleBtn) return;

    toggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const icon = toggleBtn.querySelector('i');
        if (document.body.classList.contains('dark-mode')) {
            icon.className = 'fas fa-sun text-yellow-400';
            toggleBtn.title = 'Activar Modo Claro';
        } else {
            icon.className = 'fas fa-moon text-indigo-800';
            toggleBtn.title = 'Activar Modo Oscuro';
        }
    });
}

/**
 * Copies color HEX code to clipboard on click
 */
function initColorCopier() {
    const tiles = document.querySelectorAll('.color-tile');
    tiles.forEach(tile => {
        tile.addEventListener('click', () => {
            const hex = tile.getAttribute('data-hex');
            navigator.clipboard.writeText(hex).then(() => {
                showToast(`HEX ${hex} copiado al portapapeles`);
            }).catch(err => {
                console.error('Could not copy text: ', err);
            });
        });
    });
}

/**
 * Switches between Calesa Style Variants
 */
function initStyleSwitcher() {
    const tabs = document.querySelectorAll('.style-tab');
    const contents = document.querySelectorAll('.style-tab-content');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.getAttribute('data-style');
            
            // Toggle active tabs
            tabs.forEach(t => t.classList.remove('active', 'border-calesa-olive', 'text-calesa-olive', 'font-bold'));
            tabs.forEach(t => t.classList.add('border-transparent', 'text-gray-500'));
            
            tab.classList.add('active', 'border-calesa-olive', 'text-calesa-olive', 'font-bold');
            tab.classList.remove('border-transparent', 'text-gray-500');
            
            // Toggle active contents
            contents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `calesa-style-${target}`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

/**
 * Custom Lightbox for Mockups and Assets
 */
function initLightbox() {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <span class="absolute top-5 right-10 text-white text-4xl cursor-pointer hover:text-pink-500 transition-colors" id="lightbox-close">&times;</span>
        <img class="lightbox-img" src="" alt="Vista previa">
    `;
    document.body.appendChild(lightbox);

    const closeBtn = lightbox.querySelector('#lightbox-close');
    const lightboxImg = lightbox.querySelector('.lightbox-img');

    // Bind triggers
    const triggers = document.querySelectorAll('.lightbox-trigger');
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const src = trigger.getAttribute('href') || trigger.getAttribute('data-src');
            if (src) {
                lightboxImg.src = src;
                lightbox.classList.add('active');
            }
        });
    });

    // Close on click outside or close button
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.classList.remove('active');
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
        }
    });
}

/**
 * Filter items in Resource Center
 */
function initResourceFilters() {
    const filters = document.querySelectorAll('.filter-btn');
    const items = document.querySelectorAll('.resource-card');

    filters.forEach(filter => {
        filter.addEventListener('click', () => {
            const category = filter.getAttribute('data-filter');
            
            filters.forEach(f => f.classList.remove('bg-calesa-olive', 'text-white', 'bg-kataleya-pink'));
            filters.forEach(f => f.classList.add('bg-white', 'text-gray-700', 'border-gray-200'));
            
            if (category === 'kataleya') {
                filter.classList.add('bg-kataleya-pink', 'text-white');
            } else if (category === 'calesa') {
                filter.classList.add('bg-calesa-olive', 'text-white');
            } else {
                filter.classList.add('bg-calesa-olive', 'text-white');
            }

            items.forEach(item => {
                const itemCat = item.getAttribute('data-category');
                if (category === 'all' || itemCat === category) {
                    item.style.display = 'block';
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

/**
 * Micro-Interaction: Copy Hashtags to Clipboard
 */
function initHashtagsCopier() {
    const copyBtns = document.querySelectorAll('.copy-hashtags-btn');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const targetContainer = document.getElementById(targetId);
            if (targetContainer) {
                const text = targetContainer.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    showToast('¡Bóveda de Hashtags copiada al portapapeles!');
                }).catch(err => {
                    console.error('Could not copy hashtags: ', err);
                });
            }
        });
    });
}

/**
 * Dynamic Branding Audit PDF Generator via jsPDF
 */
function initPdfGenerator() {
    const downloadBtns = document.querySelectorAll('.generate-pdf-btn');
    downloadBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            generateBrandingAuditPdf();
        });
    });
}

function generateBrandingAuditPdf() {
    const { jsPDF } = window.jspdf;
    if (!jsPDF) {
        showToast('Error: Biblioteca de PDF no cargada.', true);
        return;
    }

    showToast('Generando reporte PDF premium...');

    const doc = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4'
    });

    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();

    // ----------------------------------------------------
    // PAGE 1: COVER PAGE
    // ----------------------------------------------------
    // Draw Elegant Dark Garden Overlay Cover Background
    doc.setFillColor(18, 20, 15); // Calesa dark palette
    doc.rect(0, 0, pageW, pageH, 'F');

    // Floral Vector-like borders
    doc.setDrawColor(102, 114, 62); // Olive Green
    doc.setLineWidth(0.5);
    doc.rect(10, 10, pageW - 20, pageH - 20);
    doc.rect(12, 12, pageW - 24, pageH - 24);

    // Cover Typography
    doc.setTextColor(245, 236, 227); // Crema Floral
    doc.setFont('Cormorant Garamond', 'normal');
    doc.setFontSize(28);
    doc.text('KATALEYA × CALESA', pageW / 2, 70, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('Montserrat', 'light');
    doc.text('AUDITORÍA DE MARCA & ESTRATEGIA COMERCIAL DUAL', pageW / 2, 85, { align: 'center' });

    // Center divider
    doc.setDrawColor(165, 28, 108); // Kataleya Orchid Pink
    doc.setLineWidth(1);
    doc.line(pageW / 2 - 20, 100, pageW / 2 + 20, 100);

    // Secondary Title
    doc.setTextColor(213, 141, 179); // Orchid light
    doc.setFont('Cormorant Garamond', 'italic');
    doc.setFontSize(20);
    doc.text('Estudio de Posicionamiento y Expansión Premium', pageW / 2, 115, { align: 'center' });

    // Footer of Cover Page
    doc.setTextColor(163, 158, 148); // Stone Grey
    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(9);
    doc.text('Preparado por el Equipo Consultor de Branding Multidisciplinar', pageW / 2, 230, { align: 'center' });
    doc.text('Documento Corporativo de Alta Fidelidad - Confidencial', pageW / 2, 238, { align: 'center' });
    doc.text('2026', pageW / 2, 246, { align: 'center' });

    // ----------------------------------------------------
    // PAGE 2: EXECUTIVE SUMMARY & KATALEYA FLORIST AUDIT
    // ----------------------------------------------------
    doc.addPage();
    // Background Off-white
    doc.setFillColor(253, 251, 247);
    doc.rect(0, 0, pageW, pageH, 'F');
    
    // Page Header
    doc.setFont('Cormorant Garamond', 'normal');
    doc.setFontSize(20);
    doc.setTextColor(18, 20, 15);
    doc.text('1. AUDITORÍA EXCLUSIVA: KATALEYA FLORIST', 15, 20);
    
    doc.setDrawColor(165, 28, 108);
    doc.setLineWidth(0.5);
    doc.line(15, 23, pageW - 15, 23);

    // Brand description
    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    let text = "Kataleya Florist es la máxima expresión del arte botánico contemporáneo, la elegancia natural y la sofisticación femenina. Se posiciona como una marca boutique idónea para bodas de alto nivel, regalos florales de lujo y decoración exclusiva.";
    let splitText = doc.splitTextToSize(text, pageW - 30);
    doc.text(splitText, 15, 32);

    // Diagnostics Dashboard Table Header
    doc.setFillColor(245, 236, 227);
    doc.rect(15, 48, pageW - 30, 8, 'F');
    doc.setFont('Montserrat', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(18, 20, 15);
    doc.text('MÉTRICA DE BRANDING', 18, 53);
    doc.text('EVALUACIÓN', pageW / 2 + 10, 53);
    doc.text('DESEMPEÑO', pageW - 35, 53);

    // Diagnostics items
    const metricsK = [
        { n: 'Identidad Visual', r: '5/5 Estrellas', p: 'Sobresaliente' },
        { n: 'Consistencia de Marca', r: '5/5 Estrellas', p: 'Consistente' },
        { n: 'Escalabilidad Comercial', r: '4/5 Estrellas', p: 'Excelente' },
        { n: 'Posicionamiento Premium', r: '5/5 Estrellas', p: 'Lujo Absoluto' },
        { n: 'Experiencia Digital', r: '3/5 Estrellas', p: 'Oportunidad' }
    ];

    doc.setFont('Montserrat', 'normal');
    let y = 62;
    metricsK.forEach(m => {
        doc.text(m.n, 18, y);
        doc.text(m.r, pageW / 2 + 10, y);
        doc.text(m.p, pageW - 35, y);
        doc.setDrawColor(220, 220, 220);
        doc.line(15, y + 2, pageW - 15, y + 2);
        y += 8;
    });

    // Executive analysis box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(213, 141, 179);
    doc.rect(15, y + 5, pageW - 30, 42, 'FD');

    doc.setFont('Cormorant Garamond', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(165, 28, 108);
    doc.text('INSIGHTS ESTRATÉGICOS & OPORTUNIDADES PREMIUM', 20, y + 12);

    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const insightsK = [
        "- Fortalezas: Identidad visual exquisita y sofisticación fotográfica impecable.",
        "- Inconsistencias: Canales digitales actuales sin embudo de conversión automatizado.",
        "- Oportunidad Premium: Lanzamiento de 'Kataleya Atelier', un servicio de suscripción floral mensual para hoteles boutique, residencias de lujo y oficinas corporativas."
    ];
    let yIn = y + 18;
    insightsK.forEach(ins => {
        let splitIns = doc.splitTextToSize(ins, pageW - 40);
        doc.text(splitIns, 20, yIn);
        yIn += 7;
    });

    // Recommendations Box
    doc.setFillColor(245, 236, 227);
    doc.rect(15, y + 52, pageW - 30, 48, 'F');
    doc.setFont('Cormorant Garamond', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(18, 20, 15);
    doc.text('RECOMENDACIONES DE MEJORA RÁPIDA (QUICK WINS)', 20, y + 58);

    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(9);
    const recsK = [
        "1. Optimización SEO Local: Indexación de palabras clave con alta conversión como 'florería boutique premium' o 'diseño de eventos florales exclusivos' en la zona metropolitana.",
        "2. Papelería de Lujo: Refinar las tarjetas de precio y hang tags mediante relieves táctiles y estampado en oro rosa (Rose Gold Foil).",
        "3. Portafolio Editorial: Desarrollar un Lookbook de temporada con curaduría de bodas reales."
    ];
    let yRec = y + 64;
    recsK.forEach(rec => {
        let splitRec = doc.splitTextToSize(rec, pageW - 40);
        doc.text(splitRec, 20, yRec);
        yRec += 12;
    });

    // ----------------------------------------------------
    // PAGE 3: CALESA EVENT GARDEN AUDIT
    // ----------------------------------------------------
    doc.addPage();
    doc.setFillColor(253, 251, 247);
    doc.rect(0, 0, pageW, pageH, 'F');
    
    // Page Header
    doc.setFont('Cormorant Garamond', 'normal');
    doc.setFontSize(20);
    doc.setTextColor(18, 20, 15);
    doc.text('2. AUDITORÍA EXCLUSIVA: CALESA JARDÍN DE EVENTOS', 15, 20);
    
    doc.setDrawColor(102, 114, 62);
    doc.setLineWidth(0.5);
    doc.line(15, 23, pageW - 15, 23);

    // Brand description
    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    
    text = "Calesa Jardín de Eventos representa la fusión entre elegancia clásica, tradición arquitectónica y la naturaleza viva. Se consolida como un espacio premium versátil capaz de adaptarse a bodas de ensueño y banquetes corporativos.";
    splitText = doc.splitTextToSize(text, pageW - 30);
    doc.text(splitText, 15, 32);

    // Diagnostics Dashboard Table Header
    doc.setFillColor(233, 225, 210);
    doc.rect(15, 48, pageW - 30, 8, 'F');
    doc.setFont('Montserrat', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(18, 20, 15);
    doc.text('MÉTRICA DE BRANDING', 18, 53);
    doc.text('EVALUACIÓN', pageW / 2 + 10, 53);
    doc.text('DESEMPEÑO', pageW - 35, 53);

    // Diagnostics items
    const metricsC = [
        { n: 'Identidad Visual', r: '4/5 Estrellas', p: 'Sólida / Tradicional' },
        { n: 'Consistencia de Marca', r: '4/5 Estrellas', p: 'Excelente' },
        { n: 'Escalabilidad Comercial', r: '5/5 Estrellas', p: 'Gran Potencial' },
        { n: 'Posicionamiento Premium', r: '4/5 Estrellas', p: 'Premium Elevado' },
        { n: 'Experiencia Digital', r: '2/5 Estrellas', p: 'Área Crítica' }
    ];

    doc.setFont('Montserrat', 'normal');
    y = 62;
    metricsC.forEach(m => {
        doc.text(m.n, 18, y);
        doc.text(m.r, pageW / 2 + 10, y);
        doc.text(m.p, pageW - 35, y);
        doc.setDrawColor(220, 220, 220);
        doc.line(15, y + 2, pageW - 15, y + 2);
        y += 8;
    });

    // Executive analysis box
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(102, 114, 62);
    doc.rect(15, y + 5, pageW - 30, 42, 'FD');

    doc.setFont('Cormorant Garamond', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(102, 114, 62);
    doc.text('INSIGHTS ESTRATÉGICOS & OPORTUNIDADES PREMIUM', 20, y + 12);

    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    const insightsC = [
        "- Fortalezas: Magnífica versatilidad cromática e identidad basada en tres estilos diferenciados.",
        "- Inconsistencias: Logotipo vectorizado muy detallado que pierde legibilidad en resoluciones digitales pequeñas.",
        "- Oportunidad Premium: Creación de la alianza exclusiva 'Calesa Wedding Atelier', vinculando directamente las flores de Kataleya con el hospedaje y el banquete del jardín."
    ];
    yIn = y + 18;
    insightsC.forEach(ins => {
        let splitIns = doc.splitTextToSize(ins, pageW - 40);
        doc.text(splitIns, 20, yIn);
        yIn += 7;
    });

    // Recommendations Box
    doc.setFillColor(233, 225, 210);
    doc.rect(15, y + 52, pageW - 30, 48, 'F');
    doc.setFont('Cormorant Garamond', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(18, 20, 15);
    doc.text('RECOMENDACIONES DE MEJORA RÁPIDA (QUICK WINS)', 20, y + 58);

    doc.setFont('Montserrat', 'normal');
    doc.setFontSize(9);
    const recsC = [
        "1. Simplificación del Isotipo: Refinar las líneas de la calesa (carruaje) para optimizar su uso digital como avatar web e ícono de aplicación.",
        "2. Dirección Fotográfica: Enfocar las redes sociales en detalles de alta gama (iluminación suspendida, mantelería fina) en lugar de tomas panorámicas genéricas.",
        "3. Alianzas Corporativas: Desarrollar folletos digitales interactivos orientados a grandes eventos corporativos."
    ];
    yRec = y + 64;
    recsC.forEach(rec => {
        let splitRec = doc.splitTextToSize(rec, pageW - 40);
        doc.text(splitRec, 20, yRec);
        yRec += 12;
    });

    // Save dynamic PDF
    doc.save('Kataleya_Calesa_Auditoria.pdf');
    showToast('¡Reporte PDF descargado con éxito!');
}

/**
 * Custom Simple Toast Notification
 */
function showToast(message, isError = false) {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = `custom-toast fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-xl text-white font-medium z-50 transition-all duration-300 transform translate-y-10 ${
        isError ? 'bg-red-600' : 'bg-gradient-to-r from-calesa-olive to-kataleya-pink'
    }`;
    toast.style.animation = 'fadeIn 0.3s ease forwards';
    toast.innerHTML = `<i class="${isError ? 'fas fa-exclamation-triangle' : 'fas fa-check-circle'} mr-2"></i> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 400);
    }, 4000);
}

/**
 * Handle Resources ZIP triggers
 */
function initZipTrigger() {
    const zipBtn = document.getElementById('download-zip-btn');
    if (zipBtn) {
        zipBtn.addEventListener('click', () => {
            showToast('Preparando descarga de paquete de marca consolidado (.ZIP)...');
        });
    }
}
