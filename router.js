// ===== URL ROUTING SYSTEM =====

// Route mapping: frame number -> URL hash
const frameRoutes = {
    1: 'home',
    2: 'explore',
    3: 'earrings',
    4: 'necklaces',
    5: 'rings',
    6: 'bracelets',
    7: 'bangles',
    8: 'chains',
    9: 'statement-necklaces',
    10: 'store',
    11: 'profile',
    12: null, // Shop pages use dynamic routes
    13: 'custom-order',
    14: null,  // Product pages use dynamic routes
    15: 'earrings/all',
    16: 'necklaces/all',
    17: 'rings/all',
    18: 'bracelets/all',
    19: 'bangles/all',
    20: 'chains/all',
    21: 'statement-necklaces/all'
};

// Reverse mapping: URL hash -> frame number
const routeFrames = Object.fromEntries(
    Object.entries(frameRoutes)
        .filter(([_, route]) => route !== null)
        .map(([frame, route]) => [route, parseInt(frame)])
);

// Update URL without triggering navigation
function updateURL(path, replaceState = false) {
    const url = path.startsWith('#') ? path : `#${path}`;
    if (replaceState) {
        history.replaceState({ path }, '', url);
    } else {
        history.pushState({ path }, '', url);
    }
    console.log('🔗 URL updated:', url);
}

// Get route for frame
function getRouteForFrame(frameNum) {
    return frameRoutes[frameNum] || '';
}

// Handle route changes (back/forward button, direct URL access)
function handleRouteChange() {
    const hash = window.location.hash.slice(1); // Remove #
    console.log('🔗 Route change detected:', hash);

    if (!hash || hash === 'home') {
        goToFrameWithoutHistory(1);
        return;
    }

    // Check if it's a shop route (store/vendorname)
    if (hash.startsWith('store/')) {
        const vendorSlug = hash.split('/')[1];
        const vendorName = Object.keys(vendorMap).find(
            name => name.toLowerCase().replace(/[^a-z0-9]/g, '') === vendorSlug
        );
        if (vendorName) {
            goToShopWithoutHistory(vendorMap[vendorName], vendorName);
        }
        return;
    }

    // Check if it's a product route (product/id)
    if (hash.startsWith('product/')) {
        const productId = hash.split('/')[1];
        if (productId) {
            goToProductWithoutHistory(productId);
        }
        return;
    }

    // Check if it's a category route
    const frameNum = routeFrames[hash];
    if (frameNum) {
        goToFrameWithoutHistory(frameNum);
        return;
    }

    // Unknown route, go home
    console.warn('Unknown route:', hash);
    goToFrameWithoutHistory(1);
}

// Navigate to frame without adding to history (used by back button)
function goToFrameWithoutHistory(frameNum) {
    window.__skipHistoryUpdate = true;
    goToFrame(frameNum);
    window.__skipHistoryUpdate = false;
}

// Navigate to shop without adding to history
function goToShopWithoutHistory(vendorId, vendorName) {
    window.__skipHistoryUpdate = true;
    goToShop(vendorId, vendorName);
    window.__skipHistoryUpdate = false;
}

// Navigate to product without adding to history
function goToProductWithoutHistory(productId) {
    window.__skipHistoryUpdate = true;
    goToProduct(productId);
    window.__skipHistoryUpdate = false;
}

// Wrap goToFrame to update URL
const _originalGoToFrame = goToFrame;
window.goToFrame = function (frameNum) {
    _originalGoToFrame(frameNum);
    if (!window.__skipHistoryUpdate) {
        const route = getRouteForFrame(frameNum);
        if (route) {
            updateURL(route);
        }
    }
};

// Wrap goToShop to update URL
const _originalGoToShop = goToShop;
window.goToShop = async function (vendorId, vendorName) {
    await _originalGoToShop(vendorId, vendorName);
    if (!window.__skipHistoryUpdate) {
        const vendorSlug = vendorName.toLowerCase().replace(/[^a-z0-9]/g, '');
        updateURL(`store/${vendorSlug}`);
    }
};

// Wrap goToProduct to update URL
const _originalGoToProduct = goToProduct;
window.goToProduct = async function (productId) {
    await _originalGoToProduct(productId);
    if (!window.__skipHistoryUpdate) {
        updateURL(`product/${productId}`);
    }
};

// Initialize router
function initRouter() {
    // Listen for back/forward button
    window.addEventListener('popstate', (event) => {
        console.log('🔙 Popstate event:', event.state);
        handleRouteChange();
    });

    // Handle initial page load
    if (window.location.hash) {
        handleRouteChange();
    } else {
        // Set initial URL
        updateURL('home', true);
    }

    console.log('✅ Router initialized');
}

// Initialize router on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRouter);
} else {
    initRouter();
}
