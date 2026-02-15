// ===== GRID ITEM NAVIGATION SETUP =====
// This function adds click handlers to all grid items for proper navigation

function setupGridItemNavigation() {
    console.log('🔗 Setting up grid item navigation...');

    // Frame 3 - Earrings (grid items are placeholder, no specific navigation needed)
    // Frame 4 - Necklaces
    // Frame 5 - Rings
    // Frame 6 - Bracelets
    // Frame 7 - Bangles
    // Frame 8 - Chains
    // Frame 9 - Statement Necklaces

    // Since grid items are static HTML and represent products,
    // they should open product detail pages when clicked
    // For now, we'll add a generic handler that can be customized per frame

    const frames = [3, 4, 5, 6, 7, 8, 9];

    frames.forEach(frameNum => {
        const frame = document.getElementById(`frame${frameNum}`);
        if (!frame) return;

        const gridItems = frame.querySelectorAll('.grid-item');
        gridItems.forEach((item, index) => {
            // Add data attribute for identification
            item.setAttribute('data-frame', frameNum);
            item.setAttribute('data-index', index);

            // Add click handler (only if not already added)
            if (!item.hasAttribute('data-nav-setup')) {
                item.setAttribute('data-nav-setup', 'true');

                // Make grid item clickable (cursor pointer)
                item.style.cursor = 'pointer';

                item.addEventListener('click', (e) => {
                    // Don't trigger if clicking the like button
                    if (e.target.classList.contains('btn-like-grid')) {
                        return;
                    }

                    const productName = item.querySelector('p')?.textContent || 'Product';
                    console.log(`🛍️ Clicked product: ${productName} in Frame ${frameNum}`);

                    // For now, just log - in a real app, this would open product detail
                    // You can add: goToProduct(productId) here when product IDs are available

                    // Example: If you want to navigate to a product detail page
                    // const productId = item.getAttribute('data-product-id');
                    // if (productId) {
                    //     goToProduct(productId);
                    // }
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
