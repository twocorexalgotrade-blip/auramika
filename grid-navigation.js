// ===== GRID ITEM NAVIGATION SETUP =====
// Maps each grid item to its product ID and enables navigation to product detail pages

// Product ID mapping for each frame's grid items (in order)
const GRID_PRODUCT_MAPPING = {
    3: [ // Frame 3 - Earrings
        'diamond-studs',
        'pearl-drops',
        'gold-chandbalis',
        'temple-jewelry'
    ],
    4: [ // Frame 4 - Necklaces
        'gold-chain',
        'diamond-tennis',
        'rose-gold-heart',
        'crystal-choker'
    ],
    5: [ // Frame 5 - Rings
        'gold-band',
        'rose-gold-stack',
        'sapphire-royal',
        'platinum-eternity'
    ],
    6: [ // Frame 6 - Bracelets
        'royal-bangle',
        'luxury-charm',
        'hammered-cuff',
        'classic-tennis'
    ],
    7: [ // Frame 7 - Bangles
        'classic-gold-bangle',
        'diamond-pair-bangles',
        'bridal-chooda',
        'hammered-cuff-bangle'
    ],
    8: [ // Frame 8 - Chains
        'classic-rope-chain',
        'box-chain-platinum',
        'figaro-gold-chain',
        'snake-chain-deluxe'
    ],
    9: [ // Frame 9 - Statement Necklaces
        'layered-pearl-statement',
        'emerald-collar-necklace',
        'antique-temple-necklace',
        'crystal-bib-necklace'
    ]
};

function setupGridItemNavigation() {
    console.log('🔗 Setting up grid item navigation with product IDs...');

    const frames = [3, 4, 5, 6, 7, 8, 9];

    frames.forEach(frameNum => {
        const frame = document.getElementById(`frame${frameNum}`);
        if (!frame) return;

        const gridItems = frame.querySelectorAll('.grid-item');
        const productIds = GRID_PRODUCT_MAPPING[frameNum] || [];

        gridItems.forEach((item, index) => {
            const productId = productIds[index];

            // Add data attributes for identification
            item.setAttribute('data-frame', frameNum);
            item.setAttribute('data-index', index);

            if (productId) {
                item.setAttribute('data-product-id', productId);
            }

            // Add click handler (only if not already added)
            if (!item.hasAttribute('data-nav-setup')) {
                item.setAttribute('data-nav-setup', 'true');
                item.style.cursor = 'pointer';

                item.addEventListener('click', (e) => {
                    // Don't trigger if clicking the like button
                    if (e.target.classList.contains('btn-like-grid')) {
                        return;
                    }

                    const productName = item.querySelector('p')?.textContent || 'Product';
                    const pid = item.getAttribute('data-product-id');

                    console.log(`🛍️ Clicked product: ${productName} (ID: ${pid}) in Frame ${frameNum}`);

                    // Navigate to product detail page
                    if (pid && typeof goToProduct === 'function') {
                        goToProduct(pid);
                    } else {
                        console.warn('⚠️ Product ID not found or goToProduct function not available');
                    }
                });
            }
        });

        console.log(`✅ Set up navigation for ${gridItems.length} items in Frame ${frameNum}`);
    });
}

// Call this function after DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupGridItemNavigation);
} else {
    setupGridItemNavigation();
}
