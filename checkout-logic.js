
// checkout-logic.js

let currentCheckoutOrder = null;
let currentBuyingOption = null;
let cartItems = [];

// Helper to get current user
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('user'));
    } catch (e) {
        return null;
    }
}

// Ensure PDF library is loaded
const { jsPDF } = window.jspdf || { jsPDF: window.jspdf };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCartIcon();
});


// --- CART FUNCTIONS ---

async function addToCart(productId, productDetails = null) {
    const currentUser = getCurrentUser();

    if (!currentUser) {
        alert("Please log in to add items to cart.");
        goToFrame(12); // Go to profile/login
        return;
    }

    try {
        const payload = {
            userId: currentUser.id,
            productId: productId,
            productName: productDetails?.name || 'Unknown Product',
            productImageUrl: productDetails?.imageUrl || '',
            vendorName: productDetails?.vendorName || 'Swarna Setu',
            price: productDetails?.price || 0
        };

        const response = await fetch(`${API_BASE_URL}/api/bag`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            alert("Added to Cart!");
            updateCartIcon();
        } else {
            console.error("Failed to add to cart");
            alert("Failed to add to cart.");
        }
    } catch (e) {
        console.error(e);
        alert("Error adding to cart");
    }
}

async function updateCartIcon() {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    try {
        const response = await fetch(`${API_BASE_URL}/api/bag/${currentUser.id}`);
        if (response.ok) {
            const items = await response.json();
            cartItems = items;
            const count = items.length;
            // Update UI count if exists in app header
            const cartLink = Array.from(document.querySelectorAll('a')).find(el => el.textContent.includes('CART'));
            if (cartLink) cartLink.textContent = `CART (${count})`;
        }
    } catch (e) {
        console.error(e);
    }
}

function openCart() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Please log in to view cart.");
        goToFrame(12);
        return;
    }
    // For simplicity, cart checkout directly opens checkout modal with cart items
    if (cartItems.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    openCheckout(cartItems);
}


// --- CHECKOUT FLOW ---

function openCheckout(items) {
    currentCheckoutOrder = { items: items };
    const total = items.reduce((sum, item) => sum + parseFloat(item.price), 0);
    currentCheckoutOrder.total = total;

    // Reset UI
    document.getElementById('checkoutStep1').classList.remove('hidden');
    document.getElementById('checkoutStep2').classList.add('hidden');
    document.getElementById('checkoutStep3').classList.add('hidden');
    document.getElementById('checkoutSuccess').classList.add('hidden');

    // Clear status
    const statusEl = document.getElementById('paymentStatus');
    if (statusEl) statusEl.textContent = '';

    // Populate Stores
    const storeSelects = [document.getElementById('reserveStoreSelect'), document.getElementById('buyNowStoreSelect')];
    storeSelects.forEach(select => {
        if (!select) return;
        select.innerHTML = '<option value="">Select Pickup Store</option>';
        Object.keys(vendorMap).forEach(name => {
            const opt = document.createElement('option');
            opt.value = name;
            opt.textContent = name;
            select.appendChild(opt);
        });
    });

    document.getElementById('checkoutModal').classList.add('active');
}

function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('active');
}

function selectBuyingOption(option) {
    currentBuyingOption = option;
    document.getElementById('checkoutStep1').classList.add('hidden');
    document.getElementById('checkoutStep2').classList.remove('hidden');

    const reserveDetails = document.getElementById('reserveDetails');
    const buyNowDetails = document.getElementById('buyNowDetails');

    if (option === 'reserve') {
        reserveDetails.classList.remove('hidden');
        buyNowDetails.classList.add('hidden');

        const total = currentCheckoutOrder.total;
        const token = total * 0.10;
        document.getElementById('reserveTotalDisplay').innerText = `Rs. ${total.toLocaleString()}`;
        document.getElementById('reserveTokenDisplay').innerText = `Rs. ${token.toLocaleString()}`;

        currentCheckoutOrder.amountToPay = token;
        currentCheckoutOrder.type = 'Reserve';
    } else {
        reserveDetails.classList.add('hidden');
        buyNowDetails.classList.remove('hidden');

        const total = currentCheckoutOrder.total;
        document.getElementById('buyNowTotalDisplay').innerText = `Rs. ${total.toLocaleString()}`;
        currentCheckoutOrder.amountToPay = total;
        currentCheckoutOrder.type = 'Buy Now';

        // Default to Delivery
        toggleFulfillment('delivery');
    }
}

function backToStep1() {
    document.getElementById('checkoutStep2').classList.add('hidden');
    document.getElementById('checkoutStep1').classList.remove('hidden');
}

function backToStep2() {
    document.getElementById('checkoutStep3').classList.add('hidden');
    document.getElementById('checkoutStep2').classList.remove('hidden');
    const statusEl = document.getElementById('paymentStatus');
    if (statusEl) statusEl.textContent = '';
}

function toggleFulfillment(type) {
    const deliveryBtn = document.getElementById('deliveryBtn');
    const pickupBtn = document.getElementById('pickupBtn');
    const deliveryForm = document.getElementById('deliveryForm');
    const pickupForm = document.getElementById('pickupForm');

    if (type === 'delivery') {
        deliveryBtn.classList.add('active');
        pickupBtn.classList.remove('active');
        deliveryForm.classList.remove('hidden');
        pickupForm.classList.add('hidden');
        currentCheckoutOrder.fulfillment = 'Home Delivery';
    } else {
        pickupBtn.classList.add('active');
        deliveryBtn.classList.remove('active');
        pickupForm.classList.remove('hidden');
        deliveryForm.classList.add('hidden');
        currentCheckoutOrder.fulfillment = 'Store Pickup';
    }
}

// Proceed to Payment Selection
function proceedToPayment() {
    const currentUser = getCurrentUser();
    if (!currentUser) {
        alert("Session expired. Please log in.");
        closeCheckout();
        goToFrame(12);
        return;
    }

    // Validation based on option
    if (currentBuyingOption === 'reserve') {
        const store = document.getElementById('reserveStoreSelect').value;
        if (!store) { alert("Please select a store for pickup."); return; }
        currentCheckoutOrder.pickupStore = store;
        currentCheckoutOrder.fulfillment = 'Store Pickup'; // Explicit
    } else {
        // Buy Now
        if (currentCheckoutOrder.fulfillment === 'Home Delivery') {
            const name = document.getElementById('deliveryName').value;
            const address = document.getElementById('deliveryAddress').value;
            const mobile = document.getElementById('deliveryMobile').value;
            if (!name || !address || !mobile) { alert("Please fill in all delivery details."); return; }
            currentCheckoutOrder.deliveryAddress = `${name}, ${address}, ${mobile}`;
        } else {
            const store = document.getElementById('buyNowStoreSelect').value;
            if (!store) { alert("Please select a pickup store."); return; }
            currentCheckoutOrder.pickupStore = store;
        }
    }

    // Move to Step 3
    document.getElementById('checkoutStep2').classList.add('hidden');
    document.getElementById('checkoutStep3').classList.remove('hidden');
}


// Select Payment Gateway and Connect
async function selectPaymentGateway(gateway) {
    const statusEl = document.getElementById('paymentStatus');
    statusEl.innerHTML = `Contacting ${gateway === 'razorpay' ? 'Razorpay' : 'Cashfree'} Gateway... <span class="spinner">⏳</span>`;

    // Disable clicks on cards temporarily
    const cards = document.querySelectorAll('.payment-card');
    cards.forEach(c => c.style.pointerEvents = 'none');

    // Simulate contacting gateway
    setTimeout(() => {
        statusEl.innerHTML = `Processing payment via secure channel... <span class="spinner">🔒</span>`;

        // Simulate processing time
        setTimeout(() => {
            completeOrder(gateway);
            cards.forEach(c => c.style.pointerEvents = 'all'); // re-enable
        }, 2000);
    }, 1500);
}


// Finalize Order
async function completeOrder(gatewayName) {
    const currentUser = getCurrentUser();

    try {
        const payload = {
            userId: currentUser.id,
            totalAmount: currentCheckoutOrder.amountToPay,
            status: 'Confirmed',
            fulfillmentMethod: currentCheckoutOrder.fulfillment || 'Store Pickup',
            paymentId: `${gatewayName.toUpperCase()}_PAY_${Date.now()}`,
            deliveryAddress: currentCheckoutOrder.deliveryAddress,
            pickupStore: currentCheckoutOrder.pickupStore,
            items: currentCheckoutOrder.items
        };

        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const data = await response.json();
            currentCheckoutOrder.id = data.order.id;
            currentCheckoutOrder.date = new Date().toLocaleDateString();
            currentCheckoutOrder.gateway = gatewayName; // Store for receipt

            // Show Success Step
            document.getElementById('checkoutStep3').classList.add('hidden');
            document.getElementById('checkoutSuccess').classList.remove('hidden');
            document.getElementById('orderSuccessMessage').textContent = `Order #${data.order.id} placed successfully!`;

            // Clear Cart UI
            cartItems = [];
            updateCartIcon();
        } else {
            alert("Payment failed. Please try again.");
            backToStep2();
        }
    } catch (e) {
        console.error(e);
        alert("Error connecting to server.");
        backToStep2(); // Go back on error
    }
}


// --- PDF GENERATION ---
function downloadBill() {
    try {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const currentUser = getCurrentUser();

        // Branding
        doc.setFontSize(22);
        doc.setTextColor(212, 175, 55); // Gold
        doc.text("SwarnaSetu Pvt Ltd", 105, 20, null, null, "center");

        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text("Luxury Jewelry & Custom Designs", 105, 28, null, null, "center");

        // Order Details
        doc.setTextColor(0);
        doc.setFontSize(14);
        doc.text("INVOICE", 14, 45);

        doc.setFontSize(10);
        doc.text(`Order ID: #${currentCheckoutOrder.id}`, 14, 55);
        doc.text(`Date: ${currentCheckoutOrder.date}`, 14, 60);
        doc.text(`Customer: ${currentUser ? currentUser.name : 'Valued Customer'}`, 14, 65);
        doc.text(`Buying Option: ${currentCheckoutOrder.type}`, 14, 70);
        if (currentCheckoutOrder.gateway) {
            doc.text(`Payment Method: ${currentCheckoutOrder.gateway.toUpperCase()}`, 14, 75);
        }

        let yPos = 80;
        if (currentCheckoutOrder.fulfillment) {
            doc.text(`Fulfillment: ${currentCheckoutOrder.fulfillment}`, 14, yPos);
            yPos += 5;
            if (currentCheckoutOrder.pickupStore) {
                doc.text(`Pickup Store: ${currentCheckoutOrder.pickupStore}`, 14, yPos);
            } else if (currentCheckoutOrder.deliveryAddress) {
                const splitAddress = doc.splitTextToSize(`Delivery To: ${currentCheckoutOrder.deliveryAddress}`, 180);
                doc.text(splitAddress, 14, yPos);
                yPos += (splitAddress.length * 5);
            }
        }

        yPos += 10;

        // Items Table Header
        let y = yPos;
        doc.setFillColor(240, 240, 240);
        doc.rect(14, y - 5, 180, 8, 'F');
        doc.setFont("helvetica", "bold");
        doc.text("Item Details", 16, y);
        doc.text("Price", 160, y);

        // Items
        y += 10;
        doc.setFont("helvetica", "normal");

        currentCheckoutOrder.items.forEach(item => {
            let itemName = item.productName || item.product_name || 'Item';
            if (itemName.length > 50) itemName = itemName.substring(0, 47) + "...";
            doc.text(itemName, 16, y);
            const price = parseFloat(item.price).toLocaleString('en-IN');
            doc.text(`Rs. ${price}`, 160, y);
            y += 8;
        });

        // Totals
        y += 10;
        doc.line(14, y, 194, y);
        y += 10;

        doc.setFont("helvetica", "bold");
        doc.text("Total Value:", 120, y);
        doc.text(`Rs. ${currentCheckoutOrder.total.toLocaleString('en-IN')}`, 160, y);
        y += 8;

        doc.text("Amount Paid:", 120, y);
        doc.text(`Rs. ${currentCheckoutOrder.amountToPay.toLocaleString('en-IN')}`, 160, y);
        y += 8;

        if (currentCheckoutOrder.type === 'Reserve') {
            doc.text("Balance Due:", 120, y);
            const balance = currentCheckoutOrder.total - currentCheckoutOrder.amountToPay;
            doc.text(`Rs. ${balance.toLocaleString('en-IN')}`, 160, y);
        }

        // Footer
        doc.setFont("helvetica", "italic");
        doc.setFontSize(9);
        doc.text("Thank you for shopping with SwarnaSetu.", 105, 280, null, null, "center");
        doc.text("Authorized Signature", 160, 260);

        doc.save(`Invoice_${currentCheckoutOrder.id}.pdf`);
    } catch (e) {
        console.error("PDF generation failed:", e);
        alert("Failed to generate PDF. Please try again.");
    }
}
