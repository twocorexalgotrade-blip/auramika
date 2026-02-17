// ===== CONFIGURATION =====
const VIDEO_PATHS = {
    t1: 'assets/t1.mp4',
    t1Reverse: 'assets/t1 - REVERSE .mp4',
    t2: 'assets/t2.mp4',
    t2Reverse: 'assets/t2 - REVERSE .mp4',
    t3: 'assets/T3.mp4',
    t3Reverse: 'assets/T3 - REVERSE .mp4',
    t4: 'assets/T4.mp4',
    t4Reverse: 'assets/T4 - REVERSE .mp4',
    t5: 'assets/T5.mp4',
    t5Reverse: 'assets/T5 - REVERSE .mp4',
    t6: 'assets/t6.mp4',
    t6Reverse: 'assets/t6 - REVERSE - .mp4',
    t7: 'assets/t7.mp4',
    t7Reverse: 'assets/t7 - REVERSE .mp4',
    t8: 'assets/t8.mp4',
    t8Reverse: '/web_assets/chain to necklace - REVERSE .mp4',
    // Wait, list_dir didn't show t8 reverse. 
    // It showed t8.mp4.
    // I will just update t8.
    t9: '/web_assets/chain to necklace.mp4',
    t9Reverse: '/web_assets/chain to necklace - REVERSE .mp4',
    t10: null // No video for Frame 11 transition
};

const API_BASE_URL = 'https://swarna-setu-api.onrender.com';

// ===== MOCK PRODUCT DATA (shown when API is unavailable) =====
const mockProductData = {
    'SAGAR GOLD': [
        { id: 'sg1', name: 'Imperial Polki Necklace', price: 250000, weight: '45g', purity: '22K', category: 'Necklaces', imageUrl: '/web_assets/products/temple_jewelry.png', description: 'A masterpiece of unfinished diamonds set in 22K gold.' },
        { id: 'sg2', name: 'Gold Chain Collection', price: 45000, weight: '8.5g', purity: '22K', category: 'Necklaces', imageUrl: '/web_assets/products/gold_chain.png', description: 'Exquisite handcrafted gold chains showing traditional artistry.' },
        { id: 'sg3', name: 'Royal Kundan Choker', price: 180000, weight: '32g', purity: '22K', category: 'Necklaces', imageUrl: '/web_assets/products/crystal_choker.png', description: 'Regal choker necklace capable of elevating any bridal look.' },
        { id: 'sg4', name: 'Sleek Gold Bangles', price: 68000, weight: '12.5g', purity: '22K', category: 'Bangles', imageUrl: '/web_assets/products/gold_bangle.png', description: 'Set of 4 daily wear gold bangles.' },
        { id: 'sg5', name: 'Diamond Solitaire Ring', price: 320000, weight: '4.5g', purity: '18K', category: 'Rings', imageUrl: '/web_assets/products/diamond_solitaire.png', description: 'A timeless symbol of love, featuring a 1ct solitaire.' },
        { id: 'sg6', name: 'Sapphire & Diamond Ring', price: 85000, weight: '5.2g', purity: '18K', category: 'Rings', imageUrl: '/web_assets/products/sapphire_ring.png', description: 'Deep blue sapphire surrounded by a halo of diamonds.' },
        { id: 'sg7', name: 'Thick Gold Chain', price: 110000, weight: '22g', purity: '22K', category: 'Necklaces', imageUrl: '/web_assets/products/thick_gold_chain.png', description: 'Heavy weight gold chain statement piece.' },
        { id: 'sg8', name: 'Rose Gold Pendant', price: 18000, weight: '3.5g', purity: '18K', category: 'Pendants', imageUrl: '/web_assets/products/rose_gold_pendant.png', description: 'Delicate rose gold pendant for modern elegance.' },
        { id: 'sg9', name: 'Diamond Tennis Bracelet', price: 145000, weight: '10g', purity: '18K', category: 'Bracelets', imageUrl: '/web_assets/products/diamond_tennis_bracelet.png', description: 'A continuous line of brilliant-cut diamonds.' },
        { id: 'sg10', name: 'Antique Gold Chandbalis', price: 55000, weight: '15g', purity: '22K', category: 'Earrings', imageUrl: '/web_assets/products/gold_chandbalis.png', description: 'Traditional earrings with intricate gold filigree work.' },
    ]
};

// ===== SHOP PAGE LOGIC =====

const vendorMap = {
    'SHRI HARI JEWELS': 'store1',
    'TANISHQ - VASHI': 'store2',
    'CARATLANE': 'store3',
    'MALABAR GOLD & DIAMONDS': 'store4',
    'BLUESTONE': 'store5',
    'SENCO GOLD & DIAMONDS': 'store6',
    'KALYAN JEWELLERS': 'store7',
    'JOYALUKKAS': 'store8',
    'PC JEWELLER': 'store9',
    'OPULENT OUDH': 'store10'
};

function setupShopButtons() {
    const shopButtons = document.querySelectorAll('.btn-shop');
    shopButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click
            const card = btn.closest('.jeweler-card');
            if (card) {
                const nameElement = card.querySelector('.jeweler-info h3');
                if (nameElement) {
                    const vendorName = nameElement.textContent.trim();
                    const vendorId = vendorMap[vendorName] || 'store1'; // Default to store1 if not found
                    goToShop(vendorId, vendorName);
                }
            }
        });
    });
}

async function goToShop(vendorId, vendorName) {
    console.log(`🛍️ Going to shop: ${vendorName} (${vendorId})`);

    // Navigate to shop frame first — before any DOM access that could throw
    goToFrame(13);

    // Update Shop Header
    const shopNameEl = document.getElementById('shopName');
    const shopAddressEl = document.getElementById('shopAddress');
    const shopLogo = document.getElementById('shopLogo');
    const shopBanner = document.getElementById('shopBanner');

    if (shopNameEl) shopNameEl.textContent = vendorName || 'Exclusive Jeweler';
    if (shopAddressEl) shopAddressEl.textContent = '';
    if (shopLogo) {
        shopLogo.src = `/web_assets/logos/${vendorName.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and')}.png`;
        shopLogo.onerror = function () { this.src = '/web_assets/logos/shree_hari.png'; };
    }
    if (shopBanner) shopBanner.style.backgroundImage = "url('/web_assets/shop_banner_luxury.png')";

    // Fetch products (non-blocking — page is already visible)
    const grid = document.getElementById('shopProductGrid');
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">Loading collection...</p>';

    try {
        const response = await fetch(`${API_BASE_URL}/api/vendor/products/${vendorId}`);
        let products = [];

        if (response.ok) {
            const data = await response.json();
            products = data.products || [];
        } else {
            console.warn('Failed to fetch shop products, using mock data');
        }

        // Fall back to mock data if API returned nothing
        if (products.length === 0 && mockProductData[vendorName]) {
            products = mockProductData[vendorName];
        }

        grid.innerHTML = '';

        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No products found in this collection.</p>';
        } else {
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'shop-product-card';
                card.setAttribute('onclick', `goToProduct('${p.id}', '${vendorName}')`);
                card.innerHTML = `
                    <div class="product-image-container">
                        <img src="${p.imageUrl || p.image_url || 'assets/images/placeholder.jpg'}" alt="${p.name}">
                    </div>
                    <div class="product-details">
                        <h4>${p.name}</h4>
                        <div class="price">₹${p.price.toLocaleString()}</div>
                        <p class="desc">${p.description || 'Exquisite craftsmanship.'}</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        }

    } catch (error) {
        console.error('Error loading shop products:', error);
        // Try mock data on network error too
        const fallback = mockProductData[vendorName];
        if (fallback && fallback.length > 0) {
            grid.innerHTML = '';
            fallback.forEach(p => {
                const card = document.createElement('div');
                card.className = 'shop-product-card';
                card.setAttribute('onclick', `goToProduct('${p.id}', '${vendorName}')`);
                card.innerHTML = `
                    <div class="product-image-container">
                        <img src="${p.imageUrl}" alt="${p.name}">
                    </div>
                    <div class="product-details">
                        <h4>${p.name}</h4>
                        <div class="price">₹${p.price.toLocaleString()}</div>
                        <p class="desc">${p.description}</p>
                    </div>
                `;
                grid.appendChild(card);
            });
        } else {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">Collection coming soon.</p>';
        }
    }
}

// ===== PRODUCT DETAIL PAGE LOGIC =====

// Flat lookup of all mock products by id, built once at runtime
function findMockProduct(productId) {
    for (const vendor of Object.values(mockProductData)) {
        const p = vendor.find(item => item.id === productId);
        if (p) return p;
    }
    return null;
}

async function goToProduct(productId, vendorName) {
    console.log(`🔍 Opening product: ${productId}`);

    // Navigate first so the frame is visible immediately
    goToFrame(14);

    // Reset UI to loading state
    document.getElementById('productName').textContent = 'Loading...';
    document.getElementById('productPrice').textContent = '';
    document.getElementById('productDescription').textContent = '';
    document.getElementById('productMainImage').src = '/web_assets/products/placeholder.png';

    let product = findMockProduct(productId);

    if (!product) {
        // Not in mock data? Try fetching from API
        try {
            const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);
            if (response.ok) {
                product = await response.json();
            }
        } catch (err) {
            console.error('Error fetching product details:', err);
        }
    }

    if (!product) {
        console.warn('Product not found (Mock or API):', productId);
        document.getElementById('productName').textContent = 'Product Not Found';
        return;
    }

    // Populate product info
    document.getElementById('productName').textContent = product.name;
    document.getElementById('productPrice').textContent = `₹${(product.price || 0).toLocaleString()}`;
    document.getElementById('productDescription').textContent = product.description || 'No description available.';
    document.getElementById('productWeight').textContent = product.weight_grams ? `${product.weight_grams}g` : (product.weight || '-');
    document.getElementById('productPurity').textContent = product.purity || '-';
    document.getElementById('productCategory').textContent = product.category || '-';

    // Set main image
    const img = document.getElementById('productMainImage');
    img.src = product.image_url || product.imageUrl || '/web_assets/products/placeholder.png';
    img.alt = product.name;

    // Related products: others from same vendor, excluding this product
    // For now, sticking to mock data for related items as API implementation for related items is separate
    const allVendorProducts = vendorName ? (mockProductData[vendorName] || []) : [];
    const related = allVendorProducts.filter(p => p.id !== productId).slice(0, 4);
    renderRelatedProducts(related, vendorName);
}

function renderRelatedProducts(products, vendorName) {
    const grid = document.getElementById('relatedProductsGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">No related products found.</p>';
        return;
    }

    products.slice(0, 4).forEach(p => {
        const card = document.createElement('div');
        card.className = 'related-product-card';
        card.setAttribute('onclick', `goToProduct('${p.id}', '${vendorName}')`);
        card.innerHTML = `
            <img src="${p.image_url || p.imageUrl || '/web_assets/products/placeholder.png'}" alt="${p.name}">
            <div class="card-info">
                <h4>${p.name}</h4>
                <div class="price">₹${(p.price || 0).toLocaleString()}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Global helper — called from inline onclick on jeweler cards in HTML
function openJewelerShop(card) {
    const nameEl = card.querySelector('.jeweler-info h3');
    if (!nameEl) return;
    const vendorName = nameEl.textContent.trim();
    const vendorId = vendorMap[vendorName] || 'store1';
    goToShop(vendorId, vendorName);
}

function setupJewelerCardClicks() {
    document.querySelectorAll('.jeweler-card').forEach(card => {
        let tapStartX = 0;
        let tapStartY = 0;

        // touchstart: record start position
        card.addEventListener('touchstart', function (e) {
            tapStartX = e.changedTouches[0].clientX;
            tapStartY = e.changedTouches[0].clientY;
        }, { passive: true });

        // touchend: if tiny movement → it's a tap, navigate to shop
        card.addEventListener('touchend', function (e) {
            if (e.target.closest('button')) return;
            const dx = Math.abs(e.changedTouches[0].clientX - tapStartX);
            const dy = Math.abs(e.changedTouches[0].clientY - tapStartY);
            if (dx < 10 && dy < 10) {
                openJewelerShop(card);
            }
        }, { passive: true });

        // click: fallback for desktop (skipped on touch devices)
        card.addEventListener('click', function (e) {
            if ('ontouchstart' in window) return;
            if (e.target.closest('button')) return;
            openJewelerShop(card);
        });
    });
}

function deactivateAllJewelerCards() {
    const allCards = document.querySelectorAll('.jeweler-card');
    allCards.forEach(c => {
        c.classList.remove('active');
        c.classList.remove('dimmed');
        c.classList.remove('shifting');
        c.style.transform = '';
    });
}

// ===== STATE =====
let currentFrame = 1;
let isTransitioning = false;
let nextTargetFrame = 1;
let transitionCallback = null;

// ===== DOM ELEMENTS =====
// Splash screen removed
const mainContainer = document.getElementById('mainContainer');
const videoOverlay = document.getElementById('videoOverlay');
const transitionVideo = document.getElementById('transitionVideo');
const navHint = document.getElementById('navHint');
const productFrames = {
    1: document.getElementById('frame1'),
    2: document.getElementById('frame2'),
    3: document.getElementById('frame3'),
    4: document.getElementById('frame4'),
    5: document.getElementById('frame5'),
    6: document.getElementById('frame6'),
    7: document.getElementById('frame7'),
    8: document.getElementById('frame8'),
    9: document.getElementById('frame9'),
    10: document.getElementById('frame10'),
    11: document.getElementById('frame11'),
    12: document.getElementById('frame12'),
    13: document.getElementById('frame13'),
    14: document.getElementById('frame14')
};

// ===== HEADER VISIBILITY =====
function updateHeaderVisibility() {
    const header = document.getElementById('appHeader');
    if (!header) return;

    if (currentFrame >= 2) {
        header.classList.remove('hidden');
        console.log('📍 Header visible (Frame ' + currentFrame + ')');
    } else {
        header.classList.add('hidden');
        console.log('📍 Header hidden (Frame ' + currentFrame + ')');
    }
}

// ===== MOBILE MENU TOGGLE =====
function toggleMobileMenu() {
    const navLinks = document.getElementById('mobileNavLinks');
    const menuToggle = document.querySelector('.menu-toggle span');

    if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.textContent = 'MENU ▾';
    } else {
        navLinks.classList.add('active');
        menuToggle.textContent = 'CLOSE ▴';
    }
}

// ===== DIRECT FRAME NAVIGATION =====
function goToFrame(targetFrame) {
    // Mobile: Allow video transitions but triggered via touch/scroll
    // Removed the "return" that disabled video transitions on mobile

    // Check if we are already transitioning
    if (isTransitioning) return;

    // Desktop: Original video transition logic
    if (isTransitioning) return;

    console.log(`🎯 Navigating from Frame ${currentFrame} to Frame ${targetFrame}`);

    // Define video paths for direct navigation to each category
    const categoryVideos = {
        4: VIDEO_PATHS.t3,        // Earrings
        5: VIDEO_PATHS.t4,        // Necklaces
        6: VIDEO_PATHS.t5,        // Rings (ta1.mp4)
        7: VIDEO_PATHS.t6,        // Bracelets
        8: VIDEO_PATHS.t7,        // Bangles
        9: VIDEO_PATHS.t8,        // Chains (bangles to chain.mp4)
        10: VIDEO_PATHS.t8,       // Statement Necklaces (bangles to chain.mp4)
        10: VIDEO_PATHS.t8,       // Statement Necklaces (bangles to chain.mp4)
        11: VIDEO_PATHS.t9,       // Store (chain to necklace.mp4)
        12: null,                 // Account Setup (No video specific, fade)
        1: null                   // Frame 1 (Home) - Handled separately
    };

    // Special handling for Home (Frame 1)
    if (targetFrame === 1) {
        handleDirectNavigation(1);
        return;
    }

    // Special handling for Shop (Frame 13)
    if (targetFrame === 13) {
        handleDirectNavigation(13);
        return;
    }

    // Special handling for Profile (Frame 12)
    if (targetFrame === 12) {
        handleDirectNavigation(12);
        return;
    }

    // Special handling for Product Detail Page (Frame 14)
    if (targetFrame === 14) {
        handleDirectNavigation(14);
        return;
    }
    const videoPath = categoryVideos[targetFrame];

    if (!videoPath) {
        console.warn(`⚠️ No video path defined for frame ${targetFrame}, using direct nav`);
        handleDirectNavigation(targetFrame);
        return;
    }

    // Hide current frame content if it exists
    const currentFrameElement = productFrames[currentFrame];
    if (currentFrameElement) {
        const currentContent = currentFrameElement.querySelector('.product-showcase');
        if (currentContent) {
            currentContent.style.transition = 'opacity 0.5s ease';
            currentContent.style.opacity = '0';
        }
    }

    // Play transition after content fade
    setTimeout(() => {
        playTransition(videoPath, targetFrame);
    }, 500);
}

// Helper for direct navigation without video (pushes history)
function handleDirectNavigation(targetFrame) {
    // Hide current
    const currentFrameElement = productFrames[currentFrame];
    if (currentFrameElement) currentFrameElement.classList.remove('active');

    // Show target
    const targetEl = productFrames[targetFrame];
    if (targetEl) {
        targetEl.classList.add('active');
        targetEl.style.opacity = '1';
        targetEl.style.visibility = 'visible';

        // Reset opacity of children if needed
        const content = targetEl.querySelector('.product-showcase');
        if (content) content.style.opacity = '1';
    }

    currentFrame = targetFrame;
    updateHeaderVisibility();
    pushHistoryState(targetFrame);
}

function pushHistoryState(frame) {
    if (!isPoppingState) {
        const state = { frame: frame };
        const title = `Frame ${frame}`;
        const url = `?frame=${frame}`;
        history.pushState(state, title, url);
        console.log(`📌 Pushed state: Frame ${frame}`);
    }
}

// ===== INITIALIZATION =====
function init() {
    console.log('🎬 Initializing...');

    // Hide splash screen after 3.8 seconds
    setTimeout(() => {
        // Splash screen cleanup removed

        console.log('✅ Splash screen hidden');
    }, 3800);

    // Hide navigation hint after 8 seconds
    setTimeout(() => {
        navHint.classList.add('hidden');
    }, 8000);

    // Keyboard event listener
    document.addEventListener('keydown', handleKeyPress);

    // Video ended event
    transitionVideo.addEventListener('ended', handleVideoEnd);

    // Initialize 3D tilt effects
    init3DTilt();

    // Initialize Shop Buttons
    setupShopButtons();

    // Initialize Jeweler Card Clicks (separate from 3D tilt, works on all devices)
    setupJewelerCardClicks();

    // Initialize Touch Navigation for Mobile
    initTouchNavigation();

    // Initialize header visibility (hidden on Frame 1)
    updateHeaderVisibility();

    // Set initial history state
    if (!history.state) {
        history.replaceState({ frame: 1 }, 'Frame 1', '?frame=1');
    }

    // ===== MOBILE SCROLL VIDEO LOGIC =====
    if (window.matchMedia("(max-width: 768px)").matches) {
        initMobileScrollVideo();
    }

    console.log('✅ Initialization complete');
}

function initMobileScrollVideo() {
    const videoContainer = document.getElementById('scrollVideoContainer');
    const video = document.getElementById('introVideo');

    if (!videoContainer || !video) return;

    window.addEventListener('scroll', () => {
        const rect = videoContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Calculate detailed scroll progress through the container
        // When container top reaches bottom of screen -> Start
        // When container bottom reaches bottom of screen -> End
        const start = windowHeight;
        const end = -rect.height + windowHeight;

        // Check if container is in view
        if (rect.top <= windowHeight && rect.bottom >= 0) {

            // Calculate progress (0 to 1)
            // progress = (current_position - start_position) / (end_position - start_position)
            // We want 0 when rect.top = windowHeight
            // We want 1 when rect.bottom = windowHeight (fully scrolled past) or rect.top = -height

            const totalDistance = rect.height + windowHeight;
            const scrolledDistance = windowHeight - rect.top;

            let progress = scrolledDistance / totalDistance;

            // Adjust progress to be more sensitive in the middle if needed
            // For now, linear mapping to video duration

            // Clamp progress
            progress = Math.max(0, Math.min(1, progress));

            if (video.duration) {
                video.currentTime = video.duration * progress;
            }

            // Ensure video renders the frame
            if (video.paused) {
                // Creating a micro-play to force render on some mobile browsers if seeking doesn't update
                // video.play().then(() => video.pause()); 
                // Usually setting currentTime is enough, but play/pause can help if stuck
            }
        }
    });
}

// ===== 3D TILT EFFECT =====
function init3DTilt() {
    // Disable on mobile/touch devices
    if (window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window) {
        console.log('📱 Mobile detected - 3D Tilt disabled');
        return;
    }

    const heroCard = document.querySelector('.hero-card');
    const gridItems = document.querySelectorAll('.grid-item');

    // Hero card tilt
    if (heroCard) {
        heroCard.addEventListener('mousemove', handleTilt);
        heroCard.addEventListener('mouseleave', resetTilt);
    }

    // Grid items tilt
    gridItems.forEach(item => {
        item.addEventListener('mousemove', handleTilt);
        item.addEventListener('mouseleave', resetTilt);
    });

    // Jeweler card clicks and deactivation are now handled by setupJewelerCardClicks()
}

// ===== TOUCH NAVIGATION (SWIPE) =====
let touchStartY = 0;
let touchEndY = 0;

function initTouchNavigation() {
    document.addEventListener('touchstart', e => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: false });

    // Allow default scroll but prevent bounce if needed?
    // Actually, we want native scroll inside frames, so don't preventDefault blindly
    // document.addEventListener('touchmove', ...); 

    document.addEventListener('touchend', e => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe(e.target);
    }, { passive: false });
}

function handleSwipe(target) {
    if (isTransitioning) return;

    const swipeThreshold = 50; // Minimum distance for swipe
    const diff = touchStartY - touchEndY;

    // Get current frame element to check scroll state
    const currentFrameEl = productFrames[currentFrame];

    // Check if frame is scrollable
    const style = window.getComputedStyle(currentFrameEl);
    const isOverflowHidden = style.overflowY === 'hidden';
    const isScrollable = !isOverflowHidden && (currentFrameEl.scrollHeight > currentFrameEl.clientHeight);

    const scrollTop = currentFrameEl.scrollTop;
    const maxScroll = currentFrameEl.scrollHeight - currentFrameEl.clientHeight;

    // Tolerance for scroll checks (sometimes it's off by <1px)
    const tolerance = 5;

    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe UP (Next) - DISABLED as per user request
            // User defaults to buttons for next frame
            // Native scroll is allowed (no preventDefault), so internal scrolling works
            console.log('👆 Swipe Up detected but disabled (Button required for Next)');
        } else {
            // Swipe DOWN (User wants Previous Frame or Scroll Up)

            if (isScrollable) {
                // Navigate Up only if we are at the top
                if (scrollTop <= tolerance) {
                    console.log('📜 Reached top, navigating up...');
                    navigateUp();
                } else {
                    console.log('📜 Scheduling scrolling (native)...');
                }
            } else {
                navigateUp();
            }
        }
    }
}

function handleTilt(e) {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    // Calculate mouse position relative to card center for Tilt
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Inject CSS variables for Spotlight effect
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);

    // Disable transition for instant response (prevents jitter)
    card.style.transition = 'none';

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation angles (max 15 degrees)
    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    // Apply transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
}

function resetTilt(e) {
    const card = e.currentTarget;

    // Re-enable smooth transition for reset
    card.style.transition = 'transform 0.5s ease-out';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

function toggleJewelerCard(card) {
    const isActive = card.classList.contains('active');

    // On mobile, go directly to shop instead of opening drawer
    if (window.matchMedia("(max-width: 768px)").matches && !isActive) {
        const nameElement = card.querySelector('.jeweler-info h3');
        if (nameElement) {
            const vendorName = nameElement.textContent.trim();
            const vendorId = vendorMap[vendorName] || 'store1';
            goToShop(vendorId, vendorName);
            return; // Skip the drawer logic
        }
    }

    // Reset all first
    deactivateAllJewelerCards();

    if (!isActive) {
        // Get all cards and find this card's index
        const allCards = Array.from(document.querySelectorAll('.jeweler-card'));
        const cardIndex = allCards.indexOf(card);
        const positionInRow = cardIndex % 3; // 0=left, 1=middle, 2=right

        // Get cards in the same row
        const rowStartIndex = cardIndex - positionInRow;
        const rowCards = allCards.slice(rowStartIndex, rowStartIndex + 3);

        // Stage 1: Dim siblings (0.3s)
        rowCards.forEach(c => {
            if (c !== card) {
                c.classList.add('dimmed');
            }
        });

        // If card is middle or right, we need to shift it
        if (positionInRow > 0) {
            // Stage 2: Shift card to left position (after 0.3s)
            setTimeout(() => {
                // Calculate shift distance
                const leftCard = rowCards[0];
                const cardRect = card.getBoundingClientRect();
                const leftCardRect = leftCard.getBoundingClientRect();
                const shiftDistance = leftCardRect.left - cardRect.left;

                // Add shifting class and apply transform
                card.classList.add('shifting');
                card.style.transform = `translateX(${shiftDistance}px)`;

                // Stage 3: Activate and open drawer (after shift completes, 0.8s)
                setTimeout(() => {
                    card.classList.add('active');
                    card.classList.remove('shifting');

                    // Scroll to show drawer on mobile
                    if (window.matchMedia("(max-width: 768px)").matches) {
                        setTimeout(() => {
                            const drawer = card.querySelector('.feature-drawer');
                            const frame = document.getElementById('frame11');
                            if (drawer && frame) {
                                // Scroll the frame container to show the drawer
                                const drawerRect = drawer.getBoundingClientRect();
                                const frameRect = frame.getBoundingClientRect();
                                const scrollAmount = drawerRect.top - frameRect.top + frame.scrollTop;
                                frame.scrollTo({ top: scrollAmount, behavior: 'smooth' });
                            }
                        }, 100);
                    }
                }, 800);
            }, 300);
        } else {
            // Card is already on the left, just activate immediately
            setTimeout(() => {
                card.classList.add('active');

                // Scroll to show drawer on mobile
                if (window.matchMedia("(max-width: 768px)").matches) {
                    setTimeout(() => {
                        const drawer = card.querySelector('.feature-drawer');
                        const frame = document.getElementById('frame11');
                        if (drawer && frame) {
                            // Scroll the frame container to show the drawer
                            const drawerRect = drawer.getBoundingClientRect();
                            const frameRect = frame.getBoundingClientRect();
                            const scrollAmount = drawerRect.top - frameRect.top + frame.scrollTop;
                            frame.scrollTo({ top: scrollAmount, behavior: 'smooth' });
                        }
                    }, 100);
                }
            }, 300);
        }
    }

    function deactivateAllJewelerCards() {
        const allCards = document.querySelectorAll('.jeweler-card');
        allCards.forEach(c => {
            c.classList.remove('active');
            c.classList.remove('dimmed');
            c.classList.remove('shifting');
            c.style.transform = ''; // Reset any manual transforms
        });
    }

}

// ===== KEYBOARD HANDLER =====
function handleKeyPress(e) {
    if (isTransitioning) {
        console.log('⏸️ Transition in progress, ignoring input');
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        navigateDown();
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        navigateUp();
    }
}

// ===== NAVIGATION DOWN =====
function navigateDown() {
    console.log(`⬇️ Navigate down from frame ${currentFrame}`);

    if (currentFrame === 1) {
        // Frame 1 → t1 video → Frame 2
        playTransition(VIDEO_PATHS.t1, 2);
    } else if (currentFrame === 2) {
        // Frame 2 → t2 video → Frame 3
        playTransition(VIDEO_PATHS.t2, 3);
    } else if (currentFrame === 3) {
        // Frame 3 → t3 video → Frame 4
        playTransition(VIDEO_PATHS.t3, 4);
    } else if (currentFrame === 4) {
        // Frame 4 → Hide Content → t4 video → Frame 5
        const frame4Content = document.querySelector('#frame4 .mobile-content-panel');
        if (frame4Content) {
            frame4Content.style.transition = 'opacity 0.5s ease';
            frame4Content.style.opacity = '0';

            // Wait for fade out then play transition
            isTransitioning = true; // Block input during fade out
            setTimeout(() => {
                isTransitioning = false; // Allow transition to start
                playTransition(VIDEO_PATHS.t4, 5);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t4, 5);
        }
    } else if (currentFrame === 5) {
        // Frame 5 → Hide Content → t5 video → Frame 6
        const frame5Content = document.querySelector('#frame5 .product-showcase');
        if (frame5Content) {
            frame5Content.style.transition = 'opacity 0.5s ease';
            frame5Content.style.opacity = '0';

            // Wait for fade out then play transition
            isTransitioning = true; // Block input during fade out
            setTimeout(() => {
                isTransitioning = false; // Allow transition to start
                playTransition(VIDEO_PATHS.t5, 6);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t5, 6);
        }
    } else if (currentFrame === 6) {
        // Frame 6 → Hide Content → t6 video → Frame 7
        const frame6Content = document.querySelector('#frame6 .product-showcase');
        if (frame6Content) {
            frame6Content.style.transition = 'opacity 0.5s ease';
            frame6Content.style.opacity = '0';

            // Wait for fade out then play transition
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t6, 7);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t6, 7);
        }
    } else if (currentFrame === 7) {
        // Frame 7 → Hide Content → t7 video → Frame 8
        const frame7Content = document.querySelector('#frame7 .mobile-content-panel');
        if (frame7Content) {
            frame7Content.style.transition = 'opacity 0.5s ease';
            frame7Content.style.opacity = '0';

            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t7, 8);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t7, 8);
        }
    } else if (currentFrame === 8) {
        // Frame 8 → Hide Content → t8 video → Frame 9
        const frame8Content = document.querySelector('#frame8 .mobile-content-panel');
        if (frame8Content) {
            frame8Content.style.transition = 'opacity 0.5s ease';
            frame8Content.style.opacity = '0';

            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t8, 9);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t8, 9);
        }
    } else if (currentFrame === 9) {
        // Frame 9 → Frame 11 (Fade Transition) - Skip Frame 10
        const frame9 = document.getElementById('frame9');
        const frame11 = document.getElementById('frame11');

        if (frame9 && frame11) {
            isTransitioning = true;
            // Manual transition
            frame9.style.zIndex = '10';
            frame11.style.zIndex = '11';

            frame11.style.opacity = '0';
            frame11.style.display = 'flex'; // Ensure flex for Featured Jewelers
            frame11.classList.add('active'); // Ensure visibility

            // Fade out 9 content
            const frame9Content = document.querySelector('#frame9 .mobile-content-panel');
            if (frame9Content) frame9Content.style.opacity = '0';

            setTimeout(() => {
                frame11.scrollIntoView({ behavior: 'smooth' });
                frame11.style.opacity = '1';
                currentFrame = 11;
                // removed updateDotState
                pushHistoryState(11); // Ensure history is pushed
                isTransitioning = false;

                // Cleanup old frame
                frame9.classList.remove('active');
            }, 500);
        }
    } else if (currentFrame === 11) {
        console.log('⚠️ Already at last frame');
    }
}

// ===== NAVIGATION UP =====
function navigateUp() {
    console.log(`⬆️ Navigate up from frame ${currentFrame}`);

    if (currentFrame === 11) {
        // Frame 11 → Frame 9 (Skip Frame 10)
        const frame9 = document.getElementById('frame9');
        const frame11 = document.getElementById('frame11');

        if (frame9 && frame11) {
            isTransitioning = true;
            frame11.style.opacity = '0';

            // Restore 9 content
            const frame9Content = document.querySelector('#frame9 .mobile-content-panel');
            if (frame9Content) frame9Content.style.opacity = '1';

            frame9.classList.add('active'); // Ensure 9 is visible

            // Manual clean up of 11 after transition
            setTimeout(() => {
                frame9.scrollIntoView({ behavior: 'smooth' });
                currentFrame = 9;
                // updateDotState(9);
                pushHistoryState(9); // Ensure history is pushed
                isTransitioning = false;
                frame11.style.display = 'none';
                frame11.classList.remove('active');
            }, 500);
        }
    } else if (currentFrame === 10) {
        // Frame 10 → t9 reverse → Frame 9
        playTransition(VIDEO_PATHS.t9Reverse, 9, () => {
            const frame9Content = document.querySelector('#frame9 .product-showcase');
            if (frame9Content) {
                frame9Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 9) {
        // Frame 9 → t8 reverse → Frame 8
        playTransition(VIDEO_PATHS.t8Reverse, 8, () => {
            const frame8Content = document.querySelector('#frame8 .mobile-content-panel');
            if (frame8Content) {
                frame8Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 8) {
        // Frame 8 → t7 reverse → Frame 7
        playTransition(VIDEO_PATHS.t7Reverse, 7, () => {
            const frame7Content = document.querySelector('#frame7 .mobile-content-panel');
            if (frame7Content) {
                frame7Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 7) {
        // Frame 7 → t6 reverse → Frame 6
        playTransition(VIDEO_PATHS.t6Reverse, 6, () => {
            // Show Frame 6 content after transition
            const frame6Content = document.querySelector('#frame6 .product-showcase');
            if (frame6Content) {
                frame6Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 6) {
        // Frame 6 → t5 reverse → Frame 5
        playTransition(VIDEO_PATHS.t5Reverse, 5, () => {
            // Show Frame 5 content after transition
            const frame5Content = document.querySelector('#frame5 .product-showcase');
            if (frame5Content) {
                frame5Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 5) {
        // Frame 5 → t4 reverse → Frame 4
        playTransition(VIDEO_PATHS.t4Reverse, 4, () => {
            // Show Frame 4 content after transition
            const frame4Content = document.querySelector('#frame4 .mobile-content-panel');
            if (frame4Content) {
                frame4Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 4) {
        // Frame 4 → t3 reverse → Frame 3
        playTransition(VIDEO_PATHS.t3Reverse, 3);
    } else if (currentFrame === 3) {
        // Frame 3 → t2 reverse → Frame 2
        playTransition(VIDEO_PATHS.t2Reverse, 2);
    } else if (currentFrame === 2) {
        // Frame 2 → t1 reverse → Frame 1
        playTransition(VIDEO_PATHS.t1Reverse, 1);
    } else if (currentFrame === 1) {
        console.log('⚠️ Already at first frame');
    }
}

// ===== PLAY TRANSITION VIDEO =====
function playTransition(videoPath, targetFrame, callback) {
    if (isTransitioning && !videoOverlay.classList.contains('active')) return;

    console.log(`🎥 Playing transition: ${videoPath} → Frame ${targetFrame}`);

    isTransitioning = true;
    nextTargetFrame = targetFrame;
    transitionCallback = callback; // Store callback globally

    // Set video source WITHOUT cache busting to allow browser caching
    transitionVideo.src = videoPath;
    transitionVideo.load();

    // Show video overlay
    videoOverlay.style.display = 'block'; // Ensure it's rendered
    // Force reflow
    void videoOverlay.offsetWidth;
    videoOverlay.classList.add('active');

    // Play video
    transitionVideo.play().then(() => {
        console.log('▶️ Video playing');
    }).catch(err => {
        console.error('❌ Video play error:', err);
        completeTransition(targetFrame);
    });
}

// ===== VIDEO END HANDLER =====
function handleVideoEnd() {
    console.log('🏁 Video ended');

    // Determine target frame based on current state
    // The target frame is already set when playTransition was called
    // We need to track it, so let's use a variable
    completeTransition(nextTargetFrame);
}


// ===== COMPLETE TRANSITION =====
function completeTransition(targetFrame) {
    console.log(`✨ Completing transition to frame ${targetFrame}`);

    // Hide current frame
    if (productFrames[currentFrame]) {
        productFrames[currentFrame].classList.remove('active');
    }

    // Update current frame
    currentFrame = targetFrame;

    // Show target frame
    if (productFrames[targetFrame]) {
        productFrames[targetFrame].classList.add('active');
    } else {
        console.error(`❌ Target frame ${targetFrame} not found!`);
        // Fallback or retry?
        const frameEl = document.querySelector(`.frame[data-frame="${targetFrame}"]`);
        if (frameEl) {
            frameEl.classList.add('active');
            productFrames[targetFrame] = frameEl; // Update cache
        }
    }

    // Update header visibility
    updateHeaderVisibility();

    // Hide video overlay with a slight delay
    setTimeout(() => {
        // Hide overlay matches CSS transition
        videoOverlay.classList.remove('active');

        // Force hide after transition (0.3s)
        setTimeout(() => {
            if (!videoOverlay.classList.contains('active')) {
                videoOverlay.style.display = 'none';
            }
        }, 300);

        transitionVideo.pause();
        // Don't reset currentTime immediately to avoid flash of black/start if video re-appears
        // transitionVideo.currentTime = 0; 

        isTransitioning = false;

        console.log(`✅ Transition complete. Current frame: ${currentFrame}`);

        // PRELOAD NEXT VIDEO LOGIC
        preloadNextVideo(currentFrame);

        if (transitionCallback) {
            transitionCallback();
            transitionCallback = null;
        }

        // PUSH STATE FOR BACK BUTTON
        pushHistoryState(currentFrame);
        isPoppingState = false; // Reset flag

    }, 100); // Increased delay slightly
}

// ===== HISTORY API HANDLER =====
let isPoppingState = false;

window.addEventListener('popstate', (event) => {
    console.log('🔙 Back button pressed', event.state);

    if (event.state && event.state.frame) {
        const targetFrame = event.state.frame;

        // If we are on a different frame, navigate to it
        if (targetFrame !== currentFrame) {
            isPoppingState = true; // Prevent pushing state again

            // Determine direction
            if (targetFrame < currentFrame) {
                // Going back/up
                // We need to trigger the REVERSE transition logic matching the current frame
                // Example: Frame 2 -> Frame 1. 
                // We need to look at logic in navigateUp()

                // Since navigateUp() is complex with if/else, let's try to call it?
                // But navigateUp only goes up by 1. 
                // Popstate might jump multiple frames? Ideally not with single back click.

                // For now, let's use goToFrame() which handles direct jumping, 
                // BUT goToFrame currently uses "forward" video or no video.
                // We want proper reverse transitions.

                // Let's implement a smart reverse navigator
                smartNavigateBack(targetFrame);

            } else {
                // Going forward (Forward button)
                goToFrame(targetFrame);
            }
        }
    } else {
        // No state (e.g. back to initial load), go to Frame 1
        if (currentFrame !== 1) {
            isPoppingState = true;
            smartNavigateBack(1);
        }
    }
});

function smartNavigateBack(targetFrame) {
    // If adjacent frame, try to use specific video reverse
    if (currentFrame === targetFrame + 1) {
        // We are going 1 step back. 
        // We can re-use the logic from navigateUp() but refactored, 
        // OR just simulate navigateUp if we are sure.

        // Actually, let's just use navigateUp() logic but generalized.
        // It's hard to generalize the specific video paths without a map.
        // Let's rely on navigateUp() for single steps.

        // But wait, navigateUp() doesn't take arguments.
        // We need to force it. 

        if (currentFrame === 2 && targetFrame === 1) { playTransition(VIDEO_PATHS.t1Reverse, 1); }
        else if (currentFrame === 3 && targetFrame === 2) { playTransition(VIDEO_PATHS.t2Reverse, 2); }
        else if (currentFrame === 4 && targetFrame === 3) { playTransition(VIDEO_PATHS.t3Reverse, 3); }
        else if (currentFrame === 5 && targetFrame === 4) { playTransition(VIDEO_PATHS.t4Reverse, 4); }
        else if (currentFrame === 6 && targetFrame === 5) { playTransition(VIDEO_PATHS.t5Reverse, 5); }
        else if (currentFrame === 7 && targetFrame === 6) { playTransition(VIDEO_PATHS.t6Reverse, 6); }
        else if (currentFrame === 8 && targetFrame === 7) { playTransition(VIDEO_PATHS.t7Reverse, 7); }
        else if (currentFrame === 9 && targetFrame === 8) { playTransition(VIDEO_PATHS.t8Reverse, 8); }
        else {
            // Fallback for non-video reverse or non-adjacent
            goToFrame(targetFrame);
        }

    } else {
        // Jump back (no video or standard fade)
        goToFrame(targetFrame);
    }
}

// ===== PRELOAD NEXT VIDEO =====
function preloadNextVideo(frame) {
    let nextVideoPath = null;

    // Determine logical next video based on current frame
    // This predicts the user is likely to go DOWN
    if (frame === 1) nextVideoPath = VIDEO_PATHS.t1;
    else if (frame === 2) nextVideoPath = VIDEO_PATHS.t2;
    else if (frame === 3) nextVideoPath = VIDEO_PATHS.t3;
    else if (frame === 4) nextVideoPath = VIDEO_PATHS.t4;
    else if (frame === 5) nextVideoPath = VIDEO_PATHS.t5;
    else if (frame === 6) nextVideoPath = VIDEO_PATHS.t6;
    else if (frame === 7) nextVideoPath = VIDEO_PATHS.t7;
    else if (frame === 8) nextVideoPath = VIDEO_PATHS.t8;
    // Frame 9 -> 11 is manual fade, no video
    // Frame 10 is skipped

    if (nextVideoPath) {
        console.log(`⏳ Preloading next video: ${nextVideoPath}`);
        // Create a link preload tag if it doesn't exist
        if (!document.querySelector(`link[href="${nextVideoPath}"]`)) {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'video';
            link.href = nextVideoPath;
            link.type = 'video/mp4';
            document.head.appendChild(link);
        }

        // Also try to fetch it to populate disk cache
        fetch(nextVideoPath).then(response => {
            // Just fetching it puts it in cache
        }).catch(err => console.log('Preload fetch ignored', err));
    }
}

// ===== START =====
// ===== GOLD DUST PARTICLES =====
class GoldDust {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.frame11 = document.getElementById('frame11');
        this.particles = [];
        this.resize();

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0'; // Behind content

        if (this.frame11) {
            this.frame11.insertBefore(this.canvas, this.frame11.firstChild);
            window.addEventListener('resize', () => this.resize());
            this.initParticles();
            this.animate();
        }
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    initParticles() {
        for (let i = 0; i < 100; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 3,
                speedX: Math.random() * 0.5 - 0.25,
                speedY: Math.random() * 0.5 - 0.25,
                color: `rgba(201, 169, 97, ${Math.random() * 0.5})`
            });
        }
    }

    animate() {
        if (currentFrame !== 11) {
            requestAnimationFrame(() => this.animate());
            return; // Pause rendering if not active (optional, but good for perf)
            // Actually, checking active frame logic might be better inside. 
            // Let's just run it, impact is low.
        }

        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;

            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;

            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// =========================================
// FRAME 12: ACCOUNT SETUP LOGIC
// =========================================

// API_BASE_URL is defined globally at the top

async function checkMobile() {
    const mobileInput = document.getElementById('mobileNumber');
    const mobileNumber = mobileInput.value.trim();
    const messageEl = document.getElementById('setupMessage');

    if (!mobileNumber || mobileNumber.length < 10) {
        showMessage('Please enter a valid mobile number.', 'error');
        return;
    }

    // Show loading state (optional refinement)
    showMessage('Checking...', 'success');

    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/check-mobile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobileNumber })
        });

        const data = await response.json();

        if (data.exists) {
            showMessage(`Welcome back, ${data.user.name || 'Value Customer'}!`, 'success');

            // Populate Step 2 with existing data (ReadOnly or Editable?)
            // Let's make it editable so they can update profile if needed.
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step1').classList.add('hidden');

            const step2 = document.getElementById('step2');
            step2.classList.remove('hidden');

            // Populate fields
            document.getElementById('firstName').value = data.user.first_name || '';
            document.getElementById('lastName').value = data.user.last_name || '';
            document.getElementById('title').value = data.user.title || 'Mr';
            document.getElementById('gender').value = data.user.gender || 'Male';
            document.getElementById('dob').value = data.user.dob || '';

            // Update button text
            const submitBtn = step2.querySelector('button');
            submitBtn.textContent = "Update Profile & Continue";

            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => step2.classList.add('active'), 50);

        } else {
            // User new -> Show Step 2 (Empty)
            document.getElementById('step1').classList.remove('active');
            document.getElementById('step1').classList.add('hidden');

            const step2 = document.getElementById('step2');
            step2.classList.remove('hidden');

            // Clear fields in case they were populated
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            document.getElementById('dob').value = '';

            // Reset button text
            const submitBtn = step2.querySelector('button');
            submitBtn.textContent = "Complete Setup";

            // Clear message
            showMessage('', 'success');
            document.getElementById('setupMessage').classList.add('hidden');

            // Small delay to allow display:block to apply before opacity transition
            setTimeout(() => step2.classList.add('active'), 50);
        }

    } catch (error) {
        console.error('Error checking mobile:', error);
        showMessage('Server error. Ensure server is running at port 3000.', 'error');
    }
}

async function completeProfile() {
    const mobileNumber = document.getElementById('mobileNumber').value.trim();
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const title = document.getElementById('title').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;

    if (!firstName || !lastName || !dob) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/user/complete-profile`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                mobileNumber,
                firstName,
                lastName,
                title,
                gender,
                dob
            })
        });

        const data = await response.json();

        if (data.success) {
            showMessage('Profile Setup Complete! Welcome.', 'success');
            setTimeout(() => {
                goToFrame(11); // Redirect to Store
            }, 1500);
        } else {
            showMessage(data.message || 'Setup failed.', 'error');
        }

    } catch (error) {
        console.error('Error completing profile:', error);
        showMessage('Server error. Try again.', 'error');
    }
}

function showMessage(msg, type) {
    const el = document.getElementById('setupMessage');
    el.textContent = msg;
    el.className = `setup-message ${type}`;
    if (msg) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

// Initialize things
window.addEventListener('load', () => {
    init();
    new GoldDust();
});

// Expose nextFrame for inline HTML handlers
window.nextFrame = navigateDown;

