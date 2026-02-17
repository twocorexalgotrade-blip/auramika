// ===== PRODUCTION AR WITH MEDIAPIPE FACE MESH =====

// AR State
let arActive = false;
let arStream = null;
let arVideo = null;
let arCanvas = null;
let arContext = null;
let currentProduct = null;
let arScale = 1.0;
let faceMesh = null;
let camera = null;
let hands = null;
let productImage = null;

// Initialize AR elements
function initARElements() {
    arVideo = document.getElementById('arVideo');
    arCanvas = document.getElementById('arCanvas');
    arContext = arCanvas.getContext('2d', {
        alpha: true,
        desynchronized: true
    });
}

// Open AR View
async function openARView() {
    console.log('🎯 Opening AR View');

    const productName = document.getElementById('productName').textContent;
    const productPrice = document.getElementById('productPrice').textContent;
    const productCategory = document.getElementById('productCategory').textContent;
    let productImageSrc = document.getElementById('productMainImage').src;

    // Check for specific AR asset override
    let isPair = false;
    let useScreenBlending = false;
    let sideImageSrc = null;

    if (productName.includes('Diamond Tennis Bracelet')) {
        console.log('✨ Using dedicated AR asset for Bracelet');
        productImageSrc = 'web_asset/AR/1.png';
        isPair = false;
    } else if (productName.includes('Rose Gold Pendant')) {
        console.log('✨ Using dedicated AR asset for Pendant');
        productImageSrc = 'web_asset/AR/2.png';
        isPair = false;
    } else if (productName.includes('Thick Gold Chain')) {
        console.log('✨ Using dedicated AR asset for Thick Gold Chain');
        productImageSrc = 'web_asset/AR/3.png';
        isPair = false;
    } else if (productName.includes('Antique Gold Chandbalis')) {
        console.log('✨ Using multi-perspective AR assets');
        productImageSrc = 'web_asset/products/chandbalis_front.png';
        sideImageSrc = 'web_asset/products/chandbalis_side.png';
        isPair = false;
        useScreenBlending = false;
    } else if (productName.includes('Diamond Solitaire') || productName.includes('Studs')) {
        console.log('💎 Using transparent AR asset for Diamond Studs');
        productImageSrc = 'web_asset/products/diamond_studs_ar.png';
        isPair = true;
        useScreenBlending = true;
    } else if (productCategory.toLowerCase().includes('earrings')) {
        isPair = true;
    }

    currentProduct = {
        name: productName,
        price: productPrice,
        category: productCategory.toLowerCase(),
        imageUrl: productImageSrc,
        sideImageUrl: sideImageSrc,
        isPair: isPair,
        useScreenBlending: useScreenBlending
    };

    // Preload SIDE image if available
    if (sideImageSrc) {
        currentProduct.sideImage = new Image();
        currentProduct.sideImage.crossOrigin = 'anonymous';
        currentProduct.sideImage.src = sideImageSrc;
    }

    // Preload product image (with cache busting and auto-processing)
    const rawImage = new Image();
    rawImage.crossOrigin = 'anonymous';
    rawImage.src = productImageSrc + '?t=' + Date.now();

    rawImage.onload = () => {
        console.log('✅ Product image loaded, processing...');
        processProductImage(rawImage);
    };
    rawImage.onerror = () => console.error('❌ Failed to load product image');


    // Process Product Image (Smart Background Removal via Flood Fill)
    function processProductImage(img) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const width = canvas.width;
        const height = canvas.height;

        // Helper to get index
        const getIdx = (x, y) => (y * width + x) * 4;

        // Check corners to determine background color
        const startIdx = 0;
        const r0 = data[startIdx], g0 = data[startIdx + 1], b0 = data[startIdx + 2], a0 = data[startIdx + 3];

        // If transparent, done
        if (a0 === 0) {
            productImage = img;
            return;
        }

        // Check if White (Removal) or Black (Screen Blend)
        const isWhite = (r0 > 230 && g0 > 230 && b0 > 230);
        const isBlack = (r0 < 30 && g0 < 30 && b0 < 30);

        if (isBlack) {
            console.log('🌑 Detected Black Background - Using Screen Blending');
            currentProduct.useScreenBlending = true;
            productImage = img;
            return;
        }

        if (!isWhite) {
            // Not a standard solid background, leave it
            productImage = img;
            return;
        }

        console.log('✨ Detected White Background - Flood Filling Transparency...');

        const stack = [[0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]]; // Start from corners
        const visited = new Uint8Array(width * height);
        const tolerance = 50; // Tolerance for "White"

        while (stack.length > 0) {
            const [x, y] = stack.pop();

            if (x < 0 || x >= width || y < 0 || y >= height) continue;

            const vIdx = y * width + x;
            if (visited[vIdx]) continue;
            visited[vIdx] = 1;

            const idx = vIdx * 4;
            const r = data[idx], g = data[idx + 1], b = data[idx + 2];

            // Check difference from reference white (255, 255, 255)
            // Or from the corner pixel (r0, g0, b0)
            const diff = Math.abs(r - r0) + Math.abs(g - g0) + Math.abs(b - b0);

            if (diff < tolerance * 3) {
                // It matches background -> Make Transparent
                data[idx + 3] = 0;

                stack.push([x + 1, y]);
                stack.push([x - 1, y]);
                stack.push([x, y + 1]);
                stack.push([x, y - 1]);
            }
        }

        ctx.putImageData(imageData, 0, 0);

        productImage = new Image();
        productImage.src = canvas.toDataURL();
    }


    document.getElementById('arProductName').textContent = productName;
    document.getElementById('arProductPrice').textContent = productPrice;

    const arModal = document.getElementById('arModal');
    arModal.classList.add('active');
    initARElements();
    await startARCamera();
    arActive = true;
}

// Close AR View
function closeARView() {
    console.log('🔴 Closing AR View');

    if (camera) {
        camera.stop();
        camera = null;
    }

    if (arStream) {
        arStream.getTracks().forEach(track => track.stop());
        arStream = null;
    }

    const arModal = document.getElementById('arModal');
    arModal.classList.remove('active');
    arActive = false;
    arScale = 1.0;
}

// Request Camera Permission
async function requestCameraPermission() {
    await startARCamera();
}

// Helper: return true if current product needs hand tracking
function productNeedsHands() {
    const cat = currentProduct.category.toLowerCase();
    return cat === 'rings' || cat === 'ring'
        || cat.includes('bracelet') || cat.includes('bangle') || cat.includes('watch');
}

// Start AR Camera — single Camera with dynamic routing to FaceMesh or Hands
async function startARCamera() {
    if (arActive) return;

    try {
        document.getElementById('arLoading').style.display = 'block';
        document.getElementById('arPermission').style.display = 'none';

        arStream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 640 },
                height: { ideal: 480 }
            }
        });

        arVideo.srcObject = arStream;

        await new Promise((resolve) => {
            arVideo.onloadedmetadata = () => {
                arVideo.play();
                resolve();
            };
        });

        // Scale canvas by device pixel ratio for sharp rendering on high-DPI phones
        const dpr = window.devicePixelRatio || 1;
        arCanvas.width = arVideo.videoWidth * dpr;
        arCanvas.height = arVideo.videoHeight * dpr;
        console.log(`📹 Camera: ${arVideo.videoWidth}x${arVideo.videoHeight} @ ${dpr}x DPR → canvas ${arCanvas.width}x${arCanvas.height}`);

        // Lazily init whichever model is needed — each model is created only once
        if (productNeedsHands()) {
            console.log('✋ Product needs hand tracking');
            await ensureHandsReady();
        } else {
            console.log('👤 Product needs face mesh tracking');
            await ensureFaceMeshReady();
        }

        // Single Camera — onFrame routes to the right model based on current product
        if (camera) {
            camera.stop();
        }
        camera = new Camera(arVideo, {
            onFrame: async () => {
                if (!arActive) return;
                if (productNeedsHands()) {
                    if (hands) await hands.send({ image: arVideo });
                } else {
                    if (faceMesh) await faceMesh.send({ image: arVideo });
                }
            },
            width: 640,
            height: 480
        });
        camera.start();

        document.getElementById('arLoading').style.display = 'none';

    } catch (error) {
        console.error('Camera error:', error);
        document.getElementById('arLoading').style.display = 'none';
        document.getElementById('arPermission').style.display = 'flex';
    }
}

// Create FaceMesh model once (no Camera — camera is managed by startARCamera)
async function ensureFaceMeshReady() {
    if (faceMesh) return;
    console.log('👤 Creating FaceMesh model...');
    faceMesh = new FaceMesh({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });
    faceMesh.setOptions({
        maxNumFaces: 1,
        refineLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    faceMesh.onResults(onFaceMeshResults);
    console.log('✅ FaceMesh model ready');
}

// Handle Face Mesh Results
function onFaceMeshResults(results) {
    if (!arActive || !arContext) return;

    arContext.save();
    arContext.clearRect(0, 0, arCanvas.width, arCanvas.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        // Draw triangulated mesh (Hidden)
        // drawTriangulatedMesh(landmarks);

        // Draw jewelry overlay
        drawJewelryOverlay(landmarks);
    }

    arContext.restore();
}

// Draw Triangulated Face Mesh
function drawTriangulatedMesh(landmarks) {
    // MediaPipe FACEMESH_TESSELATION for triangulated mesh
    const FACEMESH_TESSELATION = [
        [127, 34, 139], [11, 0, 37], [232, 231, 120], [72, 37, 39],
        [128, 121, 47], [232, 121, 128], [104, 69, 67], [175, 171, 148],
        [118, 50, 101], [73, 39, 40], [9, 151, 108], [48, 115, 131],
        [194, 204, 211], [74, 40, 185], [80, 42, 183], [40, 92, 186],
        [230, 229, 118], [202, 212, 214], [83, 18, 17], [76, 61, 146],
        [160, 29, 30], [56, 157, 173], [106, 204, 194], [135, 214, 192],
        [203, 165, 98], [21, 71, 68], [51, 45, 4], [144, 24, 23],
        [77, 146, 91], [205, 50, 187], [201, 200, 18], [91, 106, 182],
        [90, 91, 181], [85, 84, 17], [206, 203, 36], [148, 171, 140],
        [92, 40, 39], [193, 189, 244], [159, 158, 28], [247, 246, 161],
        [236, 3, 196], [54, 68, 104], [193, 168, 8], [117, 228, 31],
        [189, 193, 55], [98, 97, 99], [126, 47, 100], [166, 79, 218],
        [155, 154, 26], [209, 49, 131], [135, 136, 150], [47, 126, 217],
        [223, 52, 53], [45, 51, 134], [211, 170, 140], [67, 69, 108],
        [43, 106, 91], [230, 119, 120], [226, 130, 247], [63, 53, 52],
        [238, 20, 242], [46, 70, 156], [78, 62, 96], [46, 53, 63],
        [143, 34, 227], [123, 117, 111], [44, 125, 46], [236, 134, 51],
        [216, 206, 205], [154, 153, 22], [39, 37, 167], [200, 201, 208],
        [36, 142, 100], [57, 212, 202], [20, 60, 99], [28, 158, 157],
        [35, 226, 113], [160, 159, 27], [204, 202, 210], [113, 225, 46],
        [43, 202, 204], [62, 76, 77], [137, 123, 116], [41, 38, 72],
        [203, 129, 142], [64, 98, 240], [49, 102, 64], [41, 73, 74],
        [212, 216, 207], [42, 74, 184], [169, 170, 211], [170, 149, 176],
        [105, 66, 69], [122, 6, 168], [123, 147, 187], [96, 77, 90],
        [65, 55, 107], [89, 90, 180], [101, 100, 120], [63, 105, 104],
        [93, 137, 227], [15, 86, 85], [129, 102, 49], [14, 87, 86],
        [55, 8, 9], [100, 47, 121], [145, 23, 22], [88, 89, 179],
        [6, 122, 196], [88, 95, 96], [138, 172, 136], [215, 58, 172],
        [115, 48, 219], [42, 80, 81], [195, 3, 51], [43, 146, 61],
        [171, 175, 199], [81, 82, 38], [53, 46, 225], [144, 163, 110],
        [52, 65, 66], [229, 228, 117], [34, 127, 234], [107, 108, 69],
        [109, 108, 151], [48, 64, 235], [62, 78, 191], [129, 209, 126],
        [111, 35, 143], [117, 123, 50], [222, 65, 52], [19, 125, 241],
        [20, 19, 238], [240, 98, 99], [126, 100, 142], [119, 230, 118],
        [1, 194, 19], [237, 20, 238], [125, 44, 237], [232, 128, 229]
    ];

    // Draw triangulated mesh
    arContext.fillStyle = 'rgba(0, 255, 0, 0.1)';
    arContext.strokeStyle = 'rgba(0, 255, 0, 0.3)';
    arContext.lineWidth = 0.5;

    for (const triangle of FACEMESH_TESSELATION) {
        const [i1, i2, i3] = triangle;
        const p1 = landmarks[i1];
        const p2 = landmarks[i2];
        const p3 = landmarks[i3];

        arContext.beginPath();
        arContext.moveTo(p1.x * arCanvas.width, p1.y * arCanvas.height);
        arContext.lineTo(p2.x * arCanvas.width, p2.y * arCanvas.height);
        arContext.lineTo(p3.x * arCanvas.width, p3.y * arCanvas.height);
        arContext.closePath();
        arContext.fill();
        arContext.stroke();
    }

    // Draw key landmarks
    arContext.fillStyle = '#00FF00';
    const KEY_POINTS = [234, 454, 1, 33, 263]; // Ears, nose, eyes
    for (const index of KEY_POINTS) {
        const point = landmarks[index];
        arContext.beginPath();
        arContext.arc(point.x * arCanvas.width, point.y * arCanvas.height, 4, 0, 2 * Math.PI);
        arContext.fill();
    }
}

// Draw Jewelry Overlay — routes to ear or neck renderer based on category
function drawJewelryOverlay(landmarks) {
    if (!productImage || !productImage.complete) return;

    const cat = currentProduct.category;
    if (cat.includes('necklace') || cat.includes('pendant') || cat.includes('chain') || cat.includes('choker')) {
        drawNecklaceOverlay(landmarks);
    } else {
        drawEarringOverlay(landmarks);
    }
}

// Draw Earring Overlay (ear landmarks 234 / 454)
function drawEarringOverlay(landmarks) {
    const leftEar = landmarks[234];  // Left ear landmark
    const rightEar = landmarks[454]; // Right ear landmark
    const noseTip = landmarks[1];    // Nose tip landmark for yaw calc

    if (!leftEar || !rightEar || !noseTip) return;

    // Calculate YAW (turn) to switch perspectives
    const faceWidth = rightEar.x - leftEar.x;
    const noseRelX = noseTip.x - leftEar.x;
    const yawRatio = noseRelX / faceWidth;

    // Select image based on Yaw (Front vs Side)
    let renderImage = productImage;
    if (currentProduct.sideImage && currentProduct.sideImage.complete) {
        if (yawRatio < 0.35 || yawRatio > 0.65) {
            renderImage = currentProduct.sideImage;
        }
    }

    // Calculate ear distance for sizing
    const earDistance = Math.sqrt(
        Math.pow((rightEar.x - leftEar.x) * arCanvas.width, 2) +
        Math.pow((rightEar.y - leftEar.y) * arCanvas.height, 2)
    );

    const earringSize = (earDistance * 0.35) * arScale;

    arContext.save();

    if (currentProduct.useScreenBlending) {
        arContext.globalCompositeOperation = 'screen';
    }

    arContext.globalAlpha = 0.95;

    const yOffset = earringSize * 0.1;
    const HIDE_THRESHOLD = 0.22;

    if (currentProduct.isPair) {
        // Draw Left Earring (Left Half of Image)
        if (yawRatio > HIDE_THRESHOLD) {
            arContext.drawImage(
                renderImage,
                0, 0, renderImage.width / 2, renderImage.height,
                (leftEar.x * arCanvas.width) - earringSize / 2,
                (leftEar.y * arCanvas.height) + yOffset,
                earringSize,
                earringSize
            );
        }
        // Draw Right Earring (Right Half of Image)
        if (yawRatio < (1.0 - HIDE_THRESHOLD)) {
            arContext.drawImage(
                renderImage,
                renderImage.width / 2, 0, renderImage.width / 2, renderImage.height,
                (rightEar.x * arCanvas.width) - earringSize / 2,
                (rightEar.y * arCanvas.height) + yOffset,
                earringSize,
                earringSize
            );
        }
    } else {
        // Single image mirrored to both ears
        if (yawRatio > HIDE_THRESHOLD) {
            arContext.drawImage(
                renderImage,
                (leftEar.x * arCanvas.width) - earringSize / 2,
                (leftEar.y * arCanvas.height) + yOffset,
                earringSize,
                earringSize
            );
        }
        if (yawRatio < (1.0 - HIDE_THRESHOLD)) {
            arContext.save();
            arContext.translate(rightEar.x * arCanvas.width, rightEar.y * arCanvas.height);
            arContext.scale(-1, 1);
            arContext.drawImage(
                renderImage,
                -earringSize / 2,
                yOffset,
                earringSize,
                earringSize
            );
            arContext.restore();
        }
    }

    arContext.restore();
}

// Draw Necklace / Pendant / Chain Overlay (centered below chin, landmark 152)
function drawNecklaceOverlay(landmarks) {
    const leftEar = landmarks[234];
    const rightEar = landmarks[454];
    const chin = landmarks[152]; // Chin bottom

    if (!leftEar || !rightEar || !chin) return;

    // Face width in pixels — used for scaling the necklace
    const faceWidthPx = Math.sqrt(
        Math.pow((rightEar.x - leftEar.x) * arCanvas.width, 2) +
        Math.pow((rightEar.y - leftEar.y) * arCanvas.height, 2)
    );

    // Necklace width ≈ face width; pendants slightly narrower
    const cat = currentProduct.category;
    const widthRatio = cat.includes('pendant') ? 0.7 : 1.1;
    const necklaceWidth = faceWidthPx * widthRatio * arScale;
    const aspectRatio = productImage.height / productImage.width;
    const necklaceHeight = necklaceWidth * aspectRatio;

    // Center between ears horizontally, position below chin
    const centerX = ((leftEar.x + rightEar.x) / 2) * arCanvas.width;
    const chinY = chin.y * arCanvas.height;
    // Offset below chin: about 15% of face width
    const neckOffsetY = faceWidthPx * 0.12;

    arContext.save();
    arContext.globalAlpha = 0.92;
    arContext.drawImage(
        productImage,
        centerX - necklaceWidth / 2,
        chinY + neckOffsetY,
        necklaceWidth,
        necklaceHeight
    );
    arContext.restore();
}

// Adjust AR Size
function adjustARSize(delta) {
    arScale = Math.max(0.5, Math.min(2.5, arScale + delta));
    console.log(`📏 Scale: ${arScale.toFixed(2)}`);
}

// Capture AR Photo
function captureARPhoto() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = arCanvas.width;
    tempCanvas.height = arCanvas.height;
    const ctx = tempCanvas.getContext('2d');

    ctx.drawImage(arVideo, 0, 0);
    ctx.drawImage(arCanvas, 0, 0);

    tempCanvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ar-${currentProduct.name.replace(/\s+/g, '-')}-${Date.now()}.png`;
        link.click();
        URL.revokeObjectURL(url);
        showARNotification('Photo saved! 📸');
    });
}

// Show Notification
function showARNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed; top: 100px; left: 50%; transform: translateX(-50%);
        background: rgba(201, 169, 97, 0.95); color: white;
        padding: 15px 30px; border-radius: 8px;
        font-family: 'Montserrat', sans-serif; font-weight: 600;
        z-index: 10001; box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        animation: fadeInOut 2s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
        10%, 90% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;
document.head.appendChild(style);

console.log('✅ MediaPipe AR Engine Loaded');

// ===== HAND TRACKING LOGIC =====

// Create Hands model once (no Camera — camera is managed by startARCamera)
async function ensureHandsReady() {
    if (hands) return;
    console.log('✋ Creating Hands model...');
    hands = new Hands({
        locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
    });
    hands.setOptions({
        maxNumHands: 1,
        modelComplexity: 1,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    hands.onResults(onHandResults);
    console.log('✅ Hands model ready');
}

// Handle Hand Results
function onHandResults(results) {
    if (!arActive || !arContext) return;

    arContext.save();
    arContext.clearRect(0, 0, arCanvas.width, arCanvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0];
        drawBraceletOverlay(landmarks);
    }

    arContext.restore();
}

// Draw Bracelet Overlay
function drawBraceletOverlay(landmarks) {
    if (!productImage || !productImage.complete) return;

    const wrist = landmarks[0];
    const middleFingerMCP = landmarks[9];
    const indexMCP = landmarks[5];
    const pinkyMCP = landmarks[17];

    // Calculate Wrist Width (Index to Pinky)
    const wristWidth = Math.sqrt(
        Math.pow((pinkyMCP.x - indexMCP.x) * arCanvas.width, 2) +
        Math.pow((pinkyMCP.y - indexMCP.y) * arCanvas.height, 2)
    );

    // Scaling
    const braceletWidth = (wristWidth * 1.8) * arScale; // Make it wider than wrist to wrap
    const aspectRatio = productImage.height / productImage.width;
    const braceletHeight = braceletWidth * aspectRatio;

    // Orientation (Wrist to Middle Finger)
    const dx = (middleFingerMCP.x - wrist.x) * arCanvas.width;
    const dy = (middleFingerMCP.y - wrist.y) * arCanvas.height;
    const angle = Math.atan2(dy, dx);

    arContext.save();

    // Position at Wrist
    const x = wrist.x * arCanvas.width;
    const y = wrist.y * arCanvas.height;

    arContext.translate(x, y);
    arContext.rotate(angle + Math.PI / 2); // Perpendicular to arm

    // Masking Back Area: Smart Clip
    // We assume the top 40% of the image is the "back" part of the loop.
    // We only draw the bottom 60% (Front) to simulate it wrapping around the wrist.

    const cropTopPercent = 0.40; // Skip top 40%
    const sourceY = productImage.height * cropTopPercent;
    const sourceHeight = productImage.height * (1 - cropTopPercent);

    // Calculate new destination Y based on crop
    // Original Top (-H/2) + Crop Amount (H * 0.4)
    const destYOffset = (-braceletHeight * 0.5) + (braceletHeight * cropTopPercent);
    const destHeight = braceletHeight * (1 - cropTopPercent);

    arContext.drawImage(
        productImage,
        0, sourceY, productImage.width, sourceHeight,
        -braceletWidth / 2,
        destYOffset,
        braceletWidth,
        destHeight
    );

    arContext.restore();
}
