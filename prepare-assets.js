const fs = require('fs');
const path = require('path');
const JSZip = require('jszip');

const assetsMap = {
    // Brand Kits
    'calesabrandkit - copia.png': {
        targets: ['images/calesabrandkit.png', 'brandkits/calesabrandkit.png']
    },
    'Sin título - 20 de mayo de 2026 a las 15.22.15.png': {
        targets: ['images/kataleyabrandkit.png', 'brandkits/kataleyabrandkit.png']
    },
    // Banners
    'Sin título - 17 de mayo de 2026 a las 18.07.00.png': {
        targets: ['images/kataleya_banner.png']
    },
    'Sin título - 17 de mayo de 2026 a las 18.07.00 (1).png': {
        targets: ['images/calesa_banner.png']
    },
    // Kataleya logo variations
    'Sin título - 20 de mayo de 2026 a las 16.52.35.png': {
        targets: ['images/logo_kataleya_sym.png']
    },
    'Sin título - 20 de mayo de 2026 a las 16.52.35 (1).png': {
        targets: ['images/logo_kataleya_v_white.png']
    },
    'Sin título-1 (1).png': {
        targets: ['images/logo_kataleya_h.png']
    },
    // Calesa logo variations
    'Sin título - 2026-05-18T171047.927.png': {
        targets: ['images/logo_calesa_v.png']
    },
    // Mockups
    'Sin título - 20 de mayo de 2026 a las 17.13.57.png': {
        targets: ['images/kataleya_applications_mockup.png']
    },
    // PDFs
    'calesa.pdf': {
        targets: ['downloads/Calesa_BrandKit.pdf', 'brandkits/calesa_brandkit.pdf']
    },
    'kataleya.pdf': {
        targets: ['downloads/Kataleya_BrandKit.pdf', 'brandkits/kataleya_brandkit.pdf']
    }
};

function copyFiles() {
    console.log('Copying and renaming visual assets...');
    for (const [source, val] of Object.entries(assetsMap)) {
        if (fs.existsSync(source)) {
            val.targets.forEach(target => {
                const dir = path.dirname(target);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir, { recursive: true });
                }
                fs.copyFileSync(source, target);
                console.log(`Copied: ${source} -> ${target}`);
            });
        } else {
            console.warn(`Source file not found: ${source}`);
        }
    }
}

async function generateZip() {
    console.log('Generating brand_resources.zip...');
    const zip = new JSZip();

    const filesToZip = [
        { path: 'downloads/Kataleya_BrandKit.pdf', name: 'Kataleya_BrandKit.pdf' },
        { path: 'downloads/Calesa_BrandKit.pdf', name: 'Calesa_BrandKit.pdf' },
        { path: 'images/kataleyabrandkit.png', name: 'Kataleya_BrandKit_Sheet.png' },
        { path: 'images/calesabrandkit.png', name: 'Calesa_BrandKit_Sheet.png' },
        { path: 'images/logo_kataleya_sym.png', name: 'Kataleya_Orchid_Symbol.png' },
        { path: 'images/logo_kataleya_v_white.png', name: 'Kataleya_Logo_Vertical.png' },
        { path: 'images/logo_kataleya_h.png', name: 'Kataleya_Logo_Horizontal.png' },
        { path: 'images/logo_calesa_v.png', name: 'Calesa_Logo_Vertical.png' },
        { path: 'images/kataleya_applications_mockup.png', name: 'Kataleya_Mockup_Showcase.png' },
        { path: 'images/kataleya_banner.png', name: 'Kataleya_Header_Banner.png' },
        { path: 'images/calesa_banner.png', name: 'Calesa_Header_Banner.png' }
    ];

    filesToZip.forEach(file => {
        if (fs.existsSync(file.path)) {
            const fileData = fs.readFileSync(file.path);
            zip.file(file.name, fileData);
            console.log(`Added to zip: ${file.path} as ${file.name}`);
        } else {
            console.warn(`File to zip not found: ${file.path}`);
        }
    });

    try {
        const content = await zip.generateAsync({ type: 'nodebuffer' });
        const destDir = 'downloads';
        if (!fs.existsSync(destDir)) {
            fs.mkdirSync(destDir, { recursive: true });
        }
        const zipPath = path.join(destDir, 'brand_resources.zip');
        fs.writeFileSync(zipPath, content);
        console.log(`Successfully generated zip: ${zipPath} (${content.length} bytes)`);
    } catch (err) {
        console.error('Error generating zip:', err);
    }
}

async function main() {
    copyFiles();
    await generateZip();
    console.log('Asset preparation completed successfully!');
}

main();
