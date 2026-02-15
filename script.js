// ===== CONFIGURATION =====
const VIDEO_PATHS = {
    t1: 'web asset/t1.mp4',
    t1Reverse: 'web asset/t1 - REVERSE.mp4',
    t2: 'web asset/t3.mp4',
    t2Reverse: 'web asset/t3 - REVERSE.mp4',
    t3: 'web asset/t4.mp4',
    t3Reverse: 'web asset/t4 - REVERSE .mp4',
    t4: 'web asset/ta1.mp4',
    t4Reverse: 'web asset/ta1 - REVERSE .mp4',
    t5: 'web asset/t6.mp4',
    t5Reverse: 'web asset/t6 - REVERSE .mp4',
    t6: 'web asset/t7.mp4',
    t6Reverse: 'web asset/t7 - REVERSE .mp4',
    t7: 'web asset/bangles to chain.mp4',
    t7Reverse: 'web asset/bangles to chain - REVERSE .mp4',
    t8: 'web asset/chain to necklace.mp4',
    t8Reverse: 'web asset/chain to necklace - REVERSE .mp4',
    // t9 unused now? Keep as is or remove.
    // t9: 'web asset/chain to necklace.mp4', // Was duplicate? No, F9->F10 used t9.
    // If F9 (Statement) -> F10 (Store) uses FADE, then t9 is unused.
    // But original F9 (Chains) -> F10 (Statement) used t9.
    // Original t9 was chain to necklace.
    // My new t8 is Chains -> Statement.
    // So t8 is chain to necklace.
    // t9 is gone.
    // I'll keep t9 commented out or remove it to avoid confusion.
    t10: null // No video for Frame 11 transition
};

const API_BASE_URL = 'http://localhost:3000';


// ===== SHOP PAGE LOGIC =====

const vendorMap = {
    'SAGAR GOLD': 'store1',
    'SHREE HARI': 'store2',
    'STORY OF VARANASI': 'store3',
    'DIAMONDS OF K.P': 'store4',
    "NIZAM'S JEWELS": 'store5',
    'SVARA HERITAGE': 'store6',
    'ANANYA CREATIONS': 'store7',
    'MAHARAJA DIAMONDS': 'store8',
    'VEDA GOLD': 'store9',
    'OPULENT OUDH': 'store10'
};

function setupShopButtons() {
    const shopButtons = document.querySelectorAll('.btn-shop');
    console.log(`🔧 Setting up ${shopButtons.length} shop buttons`);

    shopButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('🖱️ "Go to Shop" clicked');
            e.stopPropagation(); // Prevent card click
            const card = btn.closest('.jeweler-card');
            if (card) {
                const nameElement = card.querySelector('.jeweler-info h3');
                if (nameElement) {
                    const vendorName = nameElement.textContent.trim();
                    console.log(`🏪 Vendor found: ${vendorName}`);
                    const vendorId = vendorMap[vendorName] || 'store1'; // Default to store1 if not found
                    goToShop(vendorId, vendorName);
                } else {
                    console.warn('⚠️ Vendor name element not found');
                }
            } else {
                console.warn('⚠️ Parent card not found');
            }
        });
    });
}

// ===== SHOP NAVIGATION (Frame 12) =====
async function goToShop(vendorId, vendorName) {
    console.log(`🛍️ Going to shop: ${vendorName} (${vendorId})`);

    try {
        const response = await fetch(`${API_BASE_URL}/api/vendor/products/${vendorId}`);
        let products = [];
        let vendorDetails = {
            name: vendorName,
            location: 'Mumbai, India',
            rating: 4.8,
            logo: `web asset/logos/${vendorName?.toLowerCase().replace(/ /g, '_').replace(/&/g, 'and')}.png`
        };

        if (response.ok) {
            const data = await response.json();
            products = data.products;
            if (data.vendor) {
                // If backend provides vendor details, use them
                vendorDetails = { ...vendorDetails, ...data.vendor };
            }
        } else {
            console.warn('Failed to fetch shop products, using mock fallback if needed');
        }

        const frame12 = document.getElementById('frame12');
        if (!frame12) return;

        // Clear existing content and build new structure
        frame12.innerHTML = '';

        // 1. Container
        const container = document.createElement('div');
        container.className = 'shop-container';

        // 2. Banner & Info Card Section
        const headerContainer = document.createElement('div');
        headerContainer.className = 'shop-header-container';

        // Banner Image
        const banner = document.createElement('div');
        banner.className = 'shop-banner';
        banner.style.backgroundImage = "url('web asset/shop_banner_luxury.png')";

        // Info Card
        const infoCard = document.createElement('div');
        infoCard.className = 'shop-info-card';

        infoCard.innerHTML = `
            <div class="shop-logo-circle">
                <img src="${vendorDetails.logo}" onerror="this.src='web asset/logos/shree_hari.png'" alt="${vendorName}">
            </div>
            <div class="shop-details">
                <h1>${vendorName}</h1>
                <div class="shop-meta">
                    <span>${vendorDetails.location || 'Luxury Location'}</span>
                    <div class="shop-rating">
                        ★★★★☆ <span style="color: #888; font-weight: 400;">(${vendorDetails.rating || '4.8'})</span>
                    </div>
                </div>
            </div>
        `;

        headerContainer.appendChild(banner);
        headerContainer.appendChild(infoCard);
        container.appendChild(headerContainer);

        // 3. Product Grid Section
        const gridSection = document.createElement('div');
        gridSection.className = 'shop-grid-section';

        gridSection.innerHTML = `<h2 class="shop-section-title">Latest Collections</h2>`;

        const grid = document.createElement('div');
        grid.className = 'shop-grid';

        if (products.length === 0) {
            grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px;">No products found in this collection.</p>';
        } else {
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'shop-product-card';
                card.onclick = () => goToProduct(p.id); // Click whole card to view

                // Image Box with Overlay
                const imgBox = document.createElement('div');
                imgBox.className = 'product-img-box';
                imgBox.innerHTML = `
                    <img src="${p.imageUrl || 'assets/images/placeholder.jpg'}" alt="${p.name}">
                    <div class="card-overlay">
                        <button class="overlay-btn btn-quick-view" onclick="event.stopPropagation(); goToProduct('${p.id}')">Quick View</button>
                        <button class="overlay-btn btn-add-cart" onclick="event.stopPropagation(); addToCart('${p.id}', { name: '${p.name.replace(/'/g, "\\'")}', imageUrl: '${p.imageUrl || 'assets/images/placeholder.jpg'}', vendorName: '${vendorName.replace(/'/g, "\\'")}', price: ${p.price} })">Add to Cart</button>
                    </div>
                `;

                // Info Box
                const infoBox = document.createElement('div');
                infoBox.className = 'product-info-box';
                infoBox.innerHTML = `
                    <h4 class="product-title">${p.name}</h4>
                    <div class="product-price">₹${p.price.toLocaleString()}</div>
                    <p class="product-desc-short">${p.description || 'Exquisite craftsmanship meets timeless elegance.'}</p>
                `;

                card.appendChild(imgBox);
                card.appendChild(infoBox);
                grid.appendChild(card);
            });
        }

        gridSection.appendChild(grid);
        container.appendChild(gridSection);

        frame12.appendChild(container);

        // Navigate
        goToFrame(12);

    } catch (error) {
        console.error('Error loading shop:', error);
    }
}

// ===== PRODUCT DETAIL PAGE LOGIC =====
async function goToProduct(productId) {
    console.log(`🔍 Opening product: ${productId}`);

    try {
        // Fetch product details from API
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`);

        if (!response.ok) {
            throw new Error('Product not found');
        }

        const product = await response.json();

        // Populate product info
        document.getElementById('productName').textContent = product.name || 'Product Name';
        document.getElementById('productPrice').textContent = `₹${(product.price || 0).toLocaleString()}`;
        document.getElementById('productDescription').textContent = product.description || 'No description available.';
        document.getElementById('productWeight').textContent = (product.weight || '-') + 'g';
        document.getElementById('productPurity').textContent = product.purity || '-';
        document.getElementById('productCategory').textContent = product.category || '-';

        // Set main image
        document.getElementById('productMainImage').src = product.image_url || product.imageUrl || 'web asset/products/placeholder.png';
        document.getElementById('productMainImage').alt = product.name;

        // Button Logic
        const addToCartBtn = document.querySelector('#frame14 .btn-add-to-cart');
        if (addToCartBtn) {
            addToCartBtn.onclick = () => addToCart(product.id, {
                name: product.name,
                imageUrl: product.image_url || product.imageUrl,
                vendorName: product.vendorName || 'Swarna Setu',
                price: product.price
            });
        }
        const buyNowBtn = document.querySelector('#frame14 .btn-buy-now');
        if (buyNowBtn) {
            buyNowBtn.onclick = () => openCheckout([{
                productId: product.id,
                productName: product.name,
                productImageUrl: product.image_url || product.imageUrl,
                vendorName: product.vendorName || 'Swarna Setu',
                price: product.price,
                quantity: 1
            }]);
        }

        // Fetch related products (same category, limit 4)
        const relatedResponse = await fetch(`${API_BASE_URL}/api/products?category=${encodeURIComponent(product.category)}&limit=4`);
        let relatedProducts = [];

        if (relatedResponse.ok) {
            relatedProducts = await relatedResponse.json();
            // Filter out current product
            relatedProducts = relatedProducts.filter(p => p.id !== productId);
        }

        renderRelatedProducts(relatedProducts);

        // Navigate to Frame 14
        goToFrame(13);

    } catch (error) {
        console.error('Error loading product:', error);
        alert('Could not load product details. Please try again.');
    }
}

function renderRelatedProducts(products) {
    const grid = document.getElementById('relatedProductsGrid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 50px; color: #888;">No related products found.</p>';
        return;
    }

    products.slice(0, 4).forEach(p => {
        const card = document.createElement('div');
        card.className = 'related-product-card';
        card.onclick = () => goToProduct(p.id);
        card.innerHTML = `
            <img src="${p.image_url || p.imageUrl || 'web asset/products/placeholder.png'}" alt="${p.name}">
            <div class="card-info">
                <h4>${p.name}</h4>
                <div class="price">₹${(p.price || 0).toLocaleString()}</div>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ===== STATE =====
let currentFrame = 1;
let isTransitioning = false;
let nextTargetFrame = 1;
let transitionCallback = null;

// ===== DOM ELEMENTS =====
const splashScreen = document.getElementById('splashScreen');
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

// ===== DIRECT FRAME NAVIGATION =====

// Helper to deactivate current frame cleanly
const deactivateCurrent = () => {
    const currentActive = document.querySelector('.frame.active');
    if (currentActive) {
        currentActive.classList.remove('active');
        // CRITICALLY IMPORTANT: Clear inline styles
        currentActive.style.opacity = '';
        currentActive.style.visibility = '';
        currentActive.style.zIndex = '';

        const content = currentActive.querySelector('.product-showcase');
        if (content) content.style.opacity = '1';
    }
};

function goToFrame(targetFrame) {
    if (isTransitioning) return;

    console.log(`🎯 Navigating from Frame ${currentFrame} to Frame ${targetFrame}`);

    // Define video paths for direct navigation to each category
    const categoryVideos = {
        3: VIDEO_PATHS.t2,        // Earrings (t3.mp4)
        4: VIDEO_PATHS.t3,        // Necklaces (t4.mp4)
        5: VIDEO_PATHS.t4,        // Rings (ta1.mp4)
        6: VIDEO_PATHS.t6,        // Bracelets (t7.mp4)
        7: VIDEO_PATHS.t6,        // Bangles (t7.mp4) Wait, F6->F7 is T6.
        // Actually, let's just stick to the VIDEO_PATH keys I defined.
        // F3->F4 is t3 (t4.mp4).
        // F4->F5 is t4 (ta1.mp4).
        // F5->F6 is t5 (t6.mp4).
        // F6->F7 is t6 (t7.mp4).
        // F7->F8 is t7 (bangles to chain).
        // F8->F9 is t8 (chain to necklace).
        // F9 is Statement (Last one before Store).
        // Connect F9 -> F10 (Store).
    };

    // Better logic: Map TARGET frame to the video that leads TO IT.
    // If going TO 4 (Necklace), use t3.
    // If going TO 5 (Ring), use t4.
    // If going TO 6 (Bracelet), use t5.
    // If going TO 7 (Bangles), use t6.
    // If going TO 8 (Chains), use t7.
    // If going TO 9 (Statement), use t8.

    const targetVideoMap = {
        3: VIDEO_PATHS.t2,
        4: VIDEO_PATHS.t3,
        5: VIDEO_PATHS.t4,
        6: VIDEO_PATHS.t5,
        7: VIDEO_PATHS.t6,
        8: VIDEO_PATHS.t7,
        9: VIDEO_PATHS.t8
    };

    // Special handling for Home (Frame 1)
    if (targetFrame === 1) {
        deactivateCurrent(); // Deactivate whatever is currently active

        // Show Frame 1
        const frame1 = productFrames[1];
        if (frame1) {
            frame1.classList.add('active');
            frame1.style.opacity = '1';
            frame1.style.visibility = 'visible';
        }

        currentFrame = 1;
        updateHeaderVisibility(); // Ensure header is hidden
        return;
    }

    // Special handling for Shop (Frame 12)
    if (targetFrame === 12) {
        deactivateCurrent();
        const frame12 = document.getElementById('frame12');
        if (frame12) {
            frame12.classList.add('active');
            // We can rely on CSS class, or set inline if needed for transition
            // But CSS .frame.active { opacity: 1; visibility: visible; } should suffice
            // If we MUST set inline:
            frame12.style.opacity = '1';
            frame12.style.visibility = 'visible';
        }
        currentFrame = 12;
        updateHeaderVisibility();
        return;
    }

    // Special handling for Store (Frame 10)
    if (targetFrame === 10) {
        deactivateCurrent();
        const frame10 = document.getElementById('frame10');
        if (frame10) {
            frame10.classList.add('active');
            frame10.style.opacity = '1';
            frame10.style.visibility = 'visible';
        }
        currentFrame = 10;
        updateHeaderVisibility();
        return;
    }

    // Special handling for Profile (Frame 11)
    if (targetFrame === 11) {
        deactivateCurrent();
        const frame11 = document.getElementById('frame11');
        if (frame11) {
            frame11.classList.add('active');
            frame11.style.opacity = '1';
            frame11.style.visibility = 'visible';

            // Check if user is logged in
            const user = JSON.parse(localStorage.getItem('user'));
            if (user) {
                // Already logged in -> Show Profile Details (Step 2) pre-filled
                const step1 = document.getElementById('step1');
                const step2 = document.getElementById('step2');

                if (step1) step1.classList.remove('active');
                if (step2) {
                    step2.classList.remove('hidden');
                    step2.classList.add('active');

                    document.getElementById('mobileNumber').value = user.mobile_number || '';
                    document.getElementById('firstName').value = user.first_name || '';
                    document.getElementById('lastName').value = user.last_name || '';
                    if (user.title) document.getElementById('title').value = user.title;
                    if (user.gender) document.getElementById('gender').value = user.gender;
                    document.getElementById('dob').value = user.dob || '';

                    // Change Button to "Update Profile"
                    const submitBtn = step2.querySelector('button');
                    if (submitBtn) {
                        submitBtn.textContent = "Update Profile";
                        submitBtn.onclick = completeProfile;
                    }

                    // Add Logout Button if not exists
                    if (!document.getElementById('logoutBtn')) {
                        const logoutBtn = document.createElement('button');
                        logoutBtn.id = 'logoutBtn';
                        logoutBtn.className = 'btn-secondary btn-full';
                        logoutBtn.style.marginTop = '10px';
                        logoutBtn.textContent = 'Logout';
                        logoutBtn.onclick = logout;
                        step2.appendChild(logoutBtn);
                    }

                    // Add Order History Section if not exists
                    if (!document.getElementById('orderHistorySection')) {
                        const historySection = document.createElement('div');
                        historySection.id = 'orderHistorySection';
                        historySection.style.marginTop = '20px';
                        historySection.style.borderTop = '1px solid rgba(255,255,255,0.2)';
                        historySection.style.paddingTop = '15px';
                        historySection.innerHTML = '<h3>My Orders</h3><div id="ordersList" style="max-height: 200px; overflow-y: auto;">Loading...</div>';
                        step2.appendChild(historySection);

                        // Fetch Orders
                        fetchOrders(user.id);
                    }

                    // Update header text
                    const welcomeTitle = document.querySelector('#frame11 h2');
                    if (welcomeTitle) welcomeTitle.textContent = `Welcome, ${user.first_name || 'User'}`;
                }
            } else {
                // Not logged in -> Show Login (Step 1)
                const step1 = document.getElementById('step1');
                const step2 = document.getElementById('step2');

                if (step1) step1.classList.add('active');
                if (step2) {
                    step2.classList.add('hidden');
                    step2.classList.remove('active');
                }
                const welcomeTitle = document.querySelector('#frame11 h2');
                if (welcomeTitle) welcomeTitle.textContent = "Welcome to Swarna Setu";
            }
        }
        currentFrame = 11;
        updateHeaderVisibility();
        return;
    }

    // Special handling for Product Detail Page (Frame 13)
    if (targetFrame === 13) {
        deactivateCurrent();
        const frame13 = document.getElementById('frame13');
        if (frame13) {
            frame13.classList.add('active');
            frame13.style.opacity = '1';
            frame13.style.visibility = 'visible';
        }
        currentFrame = 13;
        updateHeaderVisibility();
        return;
    }

    // HANDLER FOR ALL OTHER FRAMES (including 2-9, 14, 15)
    // Removed upper bound check to allow future frames
    if (targetFrame >= 2) {
        deactivateCurrent();

        const targetEl = document.getElementById('frame' + targetFrame);
        if (targetEl) {
            targetEl.classList.add('active');
            targetEl.style.opacity = '1';
            targetEl.style.visibility = 'visible';
        }
        currentFrame = targetFrame;
        updateHeaderVisibility();
    }
}
// End of goToFrame

// (Deleted old init function)

// ===== 3D TILT EFFECT =====
function init3DTilt() {
    const heroCard = document.querySelector('.hero-card');
    const gridItems = document.querySelectorAll('.grid-item');
    const jewelerCards = document.querySelectorAll('.jeweler-card');

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

    // Jeweler cards interaction (Slide-Out Drawer)
    jewelerCards.forEach(card => {
        card.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent document click
            toggleJewelerCard(card);
        });
    });

    // Close on click outside
    document.addEventListener('click', () => {
        deactivateAllJewelerCards();
    });
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
                const leftRect = leftCard.getBoundingClientRect();
                const shiftDistance = leftRect.left - cardRect.left;

                // Add shifting class and apply transform
                card.classList.add('shifting');
                card.style.transform = `translateX(${shiftDistance}px)`;

                // Stage 3: Activate and open drawer (after shift completes, 0.8s)
                setTimeout(() => {
                    card.classList.add('active');
                    card.classList.remove('shifting');
                }, 800);
            }, 300);
        } else {
            // Card is already on the left, just activate immediately
            setTimeout(() => {
                card.classList.add('active');
            }, 300);
        }
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
        // Frame 3 → t3 video → Frame 4 (Earrings -> Necklaces)
        playTransition(VIDEO_PATHS.t3, 4);
    } else if (currentFrame === 4) {
        // Frame 4 → Hide Content → t4 video → Frame 5
        const currentContent = document.querySelector('#frame4 .product-showcase');
        if (currentContent) {
            currentContent.style.transition = 'opacity 0.5s ease';
            currentContent.style.opacity = '0';
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t4, 5);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t4, 5);
        }
    } else if (currentFrame === 5) {
        // Frame 5 → H → t5 → Frame 6
        const currentContent = document.querySelector('#frame5 .product-showcase');
        if (currentContent) {
            currentContent.style.transition = 'opacity 0.5s ease';
            currentContent.style.opacity = '0';
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t5, 6);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t5, 6);
        }
    } else if (currentFrame === 6) {
        // Frame 6 → H → t6 → Frame 7
        const currentContent = document.querySelector('#frame6 .product-showcase');
        if (currentContent) {
            currentContent.style.transition = 'opacity 0.5s ease';
            currentContent.style.opacity = '0';
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t6, 7);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t6, 7);
        }
    } else if (currentFrame === 7) {
        // Frame 7 → H → t7 → Frame 8
        const currentContent = document.querySelector('#frame7 .product-showcase');
        if (currentContent) {
            currentContent.style.transition = 'opacity 0.5s ease';
            currentContent.style.opacity = '0';
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t7, 8);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t7, 8);
        }
    } else if (currentFrame === 8) {
        // Frame 8 → H → t8 → Frame 9 (Statement)
        const currentContent = document.querySelector('#frame8 .product-showcase');
        if (currentContent) {
            currentContent.style.transition = 'opacity 0.5s ease';
            currentContent.style.opacity = '0';
            isTransitioning = true;
            setTimeout(() => {
                isTransitioning = false;
                playTransition(VIDEO_PATHS.t8, 9);
            }, 500);
        } else {
            playTransition(VIDEO_PATHS.t8, 9);
        }
    } else if (currentFrame === 9) {
        // Frame 9 (Statement) → Frame 10 (Store) (Fade Transition)
        const frame9 = document.getElementById('frame9');
        const frame10 = document.getElementById('frame10');

        if (frame9 && frame10) {
            isTransitioning = true;
            // Manual transition
            frame9.style.zIndex = '9';
            frame10.style.zIndex = '10';

            frame10.style.opacity = '0';
            frame10.style.display = 'flex';
            frame10.classList.add('active'); // Ensure visibility

            // Fade out 9 content
            const frame9Content = document.querySelector('#frame9 .product-showcase');
            if (frame9Content) frame9Content.style.opacity = '0';

            setTimeout(() => {
                frame10.scrollIntoView({ behavior: 'smooth' });
                frame10.style.opacity = '1';
                currentFrame = 10;
                isTransitioning = false;

                // Cleanup old frame
                frame9.classList.remove('active');
            }, 500);
        }
    } else if (currentFrame === 10) {
        console.log('⚠️ Already at last frame');
    }
}

// ===== NAVIGATION UP =====
function navigateUp() {
    console.log(`⬆️ Navigate up from frame ${currentFrame}`);

    if (currentFrame === 10) {
        // Frame 10 (Store) → Frame 9 (Statement)
        const frame9 = document.getElementById('frame9');
        const frame10 = document.getElementById('frame10');

        if (frame9 && frame10) {
            isTransitioning = true;
            frame10.style.opacity = '0';

            // Restore 9 content
            const frame9Content = document.querySelector('#frame9 .product-showcase');
            if (frame9Content) frame9Content.style.opacity = '1';

            frame9.classList.add('active'); // Ensure 9 is visible

            setTimeout(() => {
                frame9.scrollIntoView({ behavior: 'smooth' });
                currentFrame = 9;
                isTransitioning = false;
                frame10.style.display = 'none';
                frame10.classList.remove('active');
            }, 500);
        }
    } else if (currentFrame === 9) {
        // Frame 9 → t8 reverse → Frame 8
        playTransition(VIDEO_PATHS.t8Reverse, 8, () => {
            const frame8Content = document.querySelector('#frame8 .product-showcase');
            if (frame8Content) {
                frame8Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 8) {
        // Frame 8 → t7 reverse → Frame 7
        playTransition(VIDEO_PATHS.t7Reverse, 7, () => {
            const frame7Content = document.querySelector('#frame7 .product-showcase');
            if (frame7Content) {
                frame7Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 7) {
        // Frame 7 → t6 reverse → Frame 6
        playTransition(VIDEO_PATHS.t6Reverse, 6, () => {
            const frame6Content = document.querySelector('#frame6 .product-showcase');
            if (frame6Content) {
                frame6Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 6) {
        // Frame 6 → t5 reverse → Frame 5
        playTransition(VIDEO_PATHS.t5Reverse, 5, () => {
            const frame5Content = document.querySelector('#frame5 .product-showcase');
            if (frame5Content) {
                frame5Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 5) {
        // Frame 5 → t4 reverse → Frame 4
        playTransition(VIDEO_PATHS.t4Reverse, 4, () => {
            const frame4Content = document.querySelector('#frame4 .product-showcase');
            if (frame4Content) {
                frame4Content.style.opacity = '1';
            }
        });
    } else if (currentFrame === 4) {
        // Frame 4 → t3 reverse → Frame 3
        playTransition(VIDEO_PATHS.t3Reverse, 3, () => {
            // Restore content if needed
        });
    } else if (currentFrame === 3) {
        // Frame 3 → t2 reverse → Frame 2
        playTransition(VIDEO_PATHS.t2Reverse, 2);
    } else if (currentFrame === 2) {
        // Frame 2 → t1 reverse → Frame 1
        playTransition(VIDEO_PATHS.t1Reverse, 1);
    }


}

// ===== SHARED HELPER FUNCTIONS (Moved to global scope) =====

// ===== PLAY TRANSITION VIDEO =====
function playTransition(videoPath, targetFrame, callback) {
    if (isTransitioning && !videoOverlay.classList.contains('active')) return;

    console.log(`🎥 Playing transition: ${videoPath} → Frame ${targetFrame}`);

    isTransitioning = true;
    nextTargetFrame = targetFrame;
    transitionCallback = callback; // Store callback globally

    // Set video source
    transitionVideo.src = videoPath;
    transitionVideo.load();

    // Show video overlay
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
    console.log('🏁 Video ended event fired');
    console.log(`➡️ Requesting transition to frame ${nextTargetFrame}`);

    // Determine target frame based on current state
    completeTransition(nextTargetFrame);
}

// ===== COMPLETE TRANSITION =====
function completeTransition(targetFrame) {
    console.log(`✨ Completing transition to frame ${targetFrame}`);

    // Hide all frames first to be safe - ITERATE ALL
    for (let i = 1; i <= 14; i++) {
        const f = document.getElementById('frame' + i);
        if (f) {
            f.classList.remove('active');
            f.style.opacity = '';
            f.style.visibility = '';

            // Reset content opacity if it was faded out manually
            const content = f.querySelector('.product-showcase');
            if (content) content.style.opacity = '';
        }
    }

    // Update current frame index
    currentFrame = targetFrame;

    // Show target frame
    const targetEl = document.getElementById(`frame${targetFrame}`);
    if (targetEl) {
        targetEl.classList.add('active');
        targetEl.style.opacity = '1';
        targetEl.style.visibility = 'visible';
    } else {
        console.error(`❌ Target frame element frame${targetFrame} not found!`);
        // Fallback to home if target missing
        if (targetFrame !== 1) completeTransition(1);
        return;
    }

    // Update header visibility
    updateHeaderVisibility();

    // Hide video overlay
    setTimeout(() => {
        // Hide overlay
        videoOverlay.classList.remove('active');
        transitionVideo.pause();
        transitionVideo.currentTime = 0;

        isTransitioning = false;

        console.log(`✅ Transition complete. Displaying frame: ${currentFrame}`);

        if (transitionCallback) {
            transitionCallback();
            transitionCallback = null;
        }
    }, 50);
}

// ===== START =====
// ===== GOLD DUST PARTICLES =====
class GoldDust {
    constructor(targetId, frameIndex) {
        this.targetId = targetId || 'frame10';
        this.frameIndex = frameIndex || 10;

        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById(this.targetId);
        this.particles = [];
        this.resize();

        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '-1'; // Behind content

        if (this.container) {
            // Check if existing canvas needs to be removed (if any) or just append
            // For Frame 11/15 structure, we prepend
            if (this.container.firstChild) {
                this.container.insertBefore(this.canvas, this.container.firstChild);
            } else {
                this.container.appendChild(this.canvas);
            }

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
        // Optimize: Only animate if the frame is active
        if (currentFrame !== this.frameIndex) {
            requestAnimationFrame(() => this.animate());
            return;
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
            document.getElementById('setupMessage').classList.add('hidden'); // Hide any previous messages
            document.getElementById('mobileNumber').readOnly = true; // Lock mobile number

            document.getElementById('firstName').value = data.user.first_name || '';
            document.getElementById('lastName').value = data.user.last_name || '';
            document.getElementById('title').value = data.user.title || 'Mr';
            document.getElementById('gender').value = data.user.gender || 'Male';
            document.getElementById('dob').value = data.user.dob || '';

            // Update button text
            const submitBtn = step2.querySelector('button');
            submitBtn.textContent = "Update Profile";

            // Add Close Button if not exists
            if (!document.getElementById('profileCloseBtn')) {
                const closeBtn = document.createElement('button');
                closeBtn.id = 'profileCloseBtn';
                closeBtn.className = 'close-btn'; // Reusing class from checkout
                closeBtn.style.top = '10px';
                closeBtn.style.right = '10px';
                closeBtn.innerHTML = '×';
                closeBtn.onclick = () => goToFrame(12); // Go to Store
                document.querySelector('.setup-card').appendChild(closeBtn);
            }

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
            // Save logic
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user; // Update global state
            console.log('✅ Profile completed:', currentUser);

            showMessage('Profile updated successfully!', 'success');
            setTimeout(() => {
                goToFrame(12); // Redirect to Store
            }, 1000);
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
    new GoldDust('frame10', 10); // Store Page
    new GoldDust('frame14', 14); // See All Page
    populateSeeAllPage();
});

function populateSeeAllPage() {
    const grid = document.getElementById('seeAllGrid');
    if (!grid) return;

    // Theme: Gold & Royal - Using Real Assets
    const products = [
        { name: 'Antique Gold Bangle', img: 'antique_gold_bangle.png' },
        { name: 'Temple Jewelry Set', img: 'temple_jewelry.png' },
        { name: 'Ruby Pendant', img: 'ruby_pendant.png' },
        { name: 'Diamond Solitaire', img: 'diamond_solitaire.png' },
        { name: 'Gold Chandbalis', img: 'gold_chandbalis.png' },
        { name: 'Rose Gold Pendant', img: 'rose_gold_pendant.png' },
        { name: 'Emerald Necklace', img: 'emerald_necklace_hero.png' },
        { name: 'Pearl Drops', img: 'pearl_drops.png' },
        { name: 'Thick Gold Chain', img: 'thick_gold_chain.png' },
        { name: 'Sapphire Ring', img: 'sapphire_ring.png' }
    ];

    grid.innerHTML = products.map((prod, i) => `
        <div class="see-all-item" style="animation-delay: ${i * 0.1}s">
            <div class="see-all-img-wrapper">
                <img src="web asset/products/${prod.img}" onerror="this.src='web asset/products/champagne_gold_hoops.png'" alt="${prod.name}">
            </div>
            <div class="see-all-info">
                <h3>${prod.name}</h3>
                <p>View Details →</p>
            </div>
        </div>
    `).join('');
}


function goToCustomOrder() {
    console.log("✨ Opening Custom Order Wizard");
    if (typeof openCustomOrder === 'function') {
        openCustomOrder();
    } else {
        alert("Custom Order Wizard loading... Please try again in a moment.");
    }
}



// --- LOGOUT FUNCTION ---
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        window.location.reload();
    }
}

// --- ORDER HISTORY FUNCTION ---
async function fetchOrders(userId) {
    const list = document.getElementById('ordersList');
    if (!list) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/orders/user/${userId}`);
        if (response.ok) {
            const orders = await response.json();
            if (orders.length === 0) {
                list.innerHTML = '<p style="color: #888; text-align: center; margin-top: 10px;">No orders found.</p>';
                return;
            }

            list.innerHTML = '';
            orders.reverse().forEach(order => {
                const item = document.createElement('div');
                item.style.background = 'rgba(255,255,255,0.05)';
                item.style.padding = '10px';
                item.style.marginBottom = '8px';
                item.style.borderRadius = '6px';
                item.innerHTML = `
                    <div style="display: flex; justify-content: space-between; font-size: 0.9em; margin-bottom: 4px;">
                        <span style="color: #D4AF37;">#${order.id}</span>
                        <span style="color: #aaa;">${new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style="font-size: 0.85em; color: #eee;">
                        ${order.items_summary || 'Jewelry Items'}
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85em; margin-top: 4px;">
                        <span style="color: ${order.status === 'Confirmed' ? '#4CAF50' : '#FFC107'}">${order.status}</span>
                        <span style="font-weight: bold;">Rs. ${parseFloat(order.total_amount).toLocaleString()}</span>
                    </div>
                `;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Failed to load orders.</p>';
        }
    } catch (e) {
        console.error(e);
        list.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Error loading orders.</p>';
    }
}

function startFaceScan() {
    // 3D Avatar Feature - Coming Soon
    alert('✨ 3D Avatar Creation is Coming Soon! stay tuned for updates.');
}


// --- INIT FUNCTION ---
function init() {
    console.log('🚀 App Initializing...');

    // Ensure Frame 1 is active
    const frames = document.querySelectorAll('.frame');
    frames.forEach(f => {
        f.classList.remove('active');
        f.style.opacity = '0';
        f.style.visibility = 'hidden';
    });

    const frame1 = document.getElementById('frame1');
    if (frame1) {
        frame1.classList.add('active');
        frame1.style.opacity = '1';
        frame1.style.visibility = 'visible';
        currentFrame = 1;
        // Initialize Shop Buttons
        setupShopButtons();

        // --- NEW: Fix Header Store Link ---
        const storeLink = document.getElementById('nav-store-link');
        if (storeLink) {
            storeLink.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('🛒 Store link clicked via listener');
                goToFrame(10);
            });
        }

        // Check for logged in user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            currentUser = JSON.parse(storedUser);
            console.log('👤 User logged in:', currentUser.name);
            updateHeaderVisibility(); // Ensure header shows correct links
        }

        // --- NEW: Add listeners for interactivity ---
        // Keyboard event listener
        document.addEventListener('keydown', handleKeyPress);

        // Video ended event
        if (transitionVideo) {
            transitionVideo.addEventListener('ended', handleVideoEnd);
        }

        // Initialize 3D tilt effects
        if (typeof init3DTilt === 'function') {
            init3DTilt();
        }

        console.log('✅ Initialization complete (v2)');
    }
}
