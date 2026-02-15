/* =========================================
   3D FACE SCANNER V3 - Canvas Brightness Control
   ========================================= */

class FaceScannerV3 {
    constructor() {
        this.step = 0;
        this.capturedPoses = { front: null };
        this.capturedSegments = new Set();
        this.totalSegments = 12;

        this.overlay = document.getElementById('scanOverlay');
        this.instruction = document.getElementById('scanInstruction');
        this.status = document.getElementById('scanStatus');

        this.stableFrames = 0;
        this.modelsLoaded = false;
        this.lastDetection = null;

        // Smoothing properties
        this.smoothX = 0;
        this.smoothY = 0;
        this.smoothSize = 0;
        this.lerpFactor = 0.05; // Lower = smoother, Higher = faster

        // Video & Canvas

        this.video = null;
        this.canvas = null;
        this.ctx = null;
        this.stream = null;
        this.detectionInterval = null;
        this.renderInterval = null;

        // Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.faceMesh = null;
        this.controls = null;
    }

    async loadModels() {
        if (this.modelsLoaded) return;

        console.log('🗿 Loading face-api.js models...');
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        this.modelsLoaded = true;
        console.log('✅ Models loaded');
    }

    async start() {
        console.log('🗿 FaceScannerV3.start()');

        await this.loadModels();

        const modal = document.getElementById('arModal');
        if (modal) modal.classList.add('active');

        // Hide AR elements
        document.querySelector('.ar-product-info')?.classList.add('hidden');
        document.querySelector('.ar-size-control')?.classList.add('hidden');
        document.querySelector('.ar-instructions')?.classList.add('hidden');

        if (this.overlay) this.overlay.classList.remove('hidden');

        // Hide static SVG ring (we're using dynamic canvas ring now)
        const svgRing = document.querySelector('.scan-ring-container');
        if (svgRing) svgRing.style.display = 'none';

        this.initRingSegments(); // Still needed for segment tracking
        await this.startCamera();

        this.step = 1;
        this.updateUI("Position Face", "Center your face in the circle", 0);
        this.startDetection();
    }

    async startCamera() {
        console.log('🗿 Starting camera in NATIVE 1080p...');

        // Get hidden video element
        this.video = document.getElementById('arVideo');
        this.video.style.display = 'none';

        // Get canvas to display video
        this.canvas = document.getElementById('arCanvas');
        this.canvas.style.display = 'block';
        this.canvas.style.zIndex = '1';
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });

        try {
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920, min: 1280 },
                    height: { ideal: 1080, min: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30 }
                }
            });

            this.video.srcObject = this.stream;
            await this.video.play();

            // Set canvas size to match video
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;

            console.log('✅ Camera:', this.video.videoWidth, 'x', this.video.videoHeight);

            // Start rendering video to canvas (NO FILTERS)
            this.startVideoRendering();

        } catch (e) {
            console.error('❌ Camera error:', e);
            alert('Camera failed: ' + e.message);
            throw e;
        }
    }

    startVideoRendering() {
        // Render video to canvas at 60fps - NATIVE QUALITY
        this.renderInterval = setInterval(() => {
            if (!this.video || this.video.paused) return;

            // Mirror the context
            this.ctx.save();
            this.ctx.scale(-1, 1);
            this.ctx.drawImage(this.video, -this.canvas.width, 0, this.canvas.width, this.canvas.height);
            this.ctx.restore();

            // Draw dynamic ring if we have a face detection
            if (this.lastDetection) {
                this.drawDynamicRing(this.lastDetection);
            }

        }, 16); // ~60fps
    }

    drawDynamicRing(detection) {
        const box = detection.detection.box;

        // Target values
        let targetX = box.x + box.width / 2;
        let targetY = box.y + box.height / 2;
        let targetSize = Math.max(box.width, box.height) * 0.7; // Slightly larger than face

        // Initialize smooth values if first frame
        if (this.smoothSize === 0) {
            this.smoothX = targetX;
            this.smoothY = targetY;
            this.smoothSize = targetSize;
        }

        // DEADBAND SMOOTHING (Optimization)
        // If movement is small, ignore it to prevent jitter
        const diffX = targetX - this.smoothX;
        const diffY = targetY - this.smoothY;
        const diffSize = targetSize - this.smoothSize;

        if (Math.abs(diffX) > 2) this.smoothX += diffX * this.lerpFactor;
        if (Math.abs(diffY) > 2) this.smoothY += diffY * this.lerpFactor;
        if (Math.abs(diffSize) > 2) this.smoothSize += diffSize * this.lerpFactor;

        // Use SMOOTH values for drawing
        const ringRadius = this.smoothSize;
        const faceCenterX = this.smoothX;
        const faceCenterY = this.smoothY;

        // Determine ring color based on face position
        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;
        const offsetX = Math.abs(faceCenterX - canvasCenterX) / this.canvas.width;
        const offsetY = Math.abs(faceCenterY - canvasCenterY) / this.canvas.height;
        const isCentered = offsetX < 0.20 && offsetY < 0.20;
        // Use raw box width for distance check (unaffected by mirroring)
        const faceWidth = box.width / this.canvas.width;
        const isGoodDistance = faceWidth >= 0.20 && faceWidth <= 0.80;

        let ringColor;
        if (this.step === 1) {
            // Calibration: green if centered and good distance, red otherwise
            ringColor = (isCentered && isGoodDistance) ? '#4CD964' : '#FF3B30';
        } else if (this.step === 2) {
            // Scanning: show progress with segments
            ringColor = (isCentered && isGoodDistance) ? '#4CD964' : '#FF3B30';
        } else {
            ringColor = 'rgba(255, 255, 255, 0.3)';
        }

        // Draw ring (OVAL SHAPE)
        this.ctx.strokeStyle = ringColor;
        this.ctx.lineWidth = 8;
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = ringColor;

        const radiusX = ringRadius * 0.8;
        const radiusY = ringRadius * 1.05;

        this.ctx.beginPath();
        this.ctx.ellipse(faceCenterX, faceCenterY, radiusX, radiusY, 0, 0, Math.PI * 2);
        this.ctx.stroke();

        // Draw segments for step 2
        if (this.step === 2 && this.totalSegments > 0) {
            this.drawSegments(faceCenterX, faceCenterY, radiusX, radiusY);
        }

        // Reset shadow
        this.ctx.shadowBlur = 0;
    }

    drawSegments(centerX, centerY, radiusX, radiusY) {
        const segmentAngle = (Math.PI * 2) / this.totalSegments;

        for (let i = 0; i < this.totalSegments; i++) {
            const startAngle = i * segmentAngle - Math.PI / 2;
            const endAngle = (i + 1) * segmentAngle - Math.PI / 2;

            // Check if this segment is completed
            const isCompleted = this.capturedSegments.has(i);

            this.ctx.strokeStyle = isCompleted ? '#4CD964' : 'rgba(255, 255, 255, 0.2)';
            this.ctx.lineWidth = isCompleted ? 12 : 6;
            this.ctx.lineCap = 'round';

            this.ctx.beginPath();
            this.ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, startAngle, endAngle);
            this.ctx.stroke();
        }
    }

    startDetection() {
        this.detectionInterval = setInterval(async () => {
            if (this.step === 0 || this.step >= 3) {
                clearInterval(this.detectionInterval);
                return;
            }

            try {
                // Detect on the CANVAS (brightened image)
                const detection = await faceapi
                    .detectSingleFace(this.canvas, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks();

                if (detection) {
                    this.process(detection);
                }
            } catch (e) {
                console.error('Detection error:', e);
            }
        }, 100);
    }

    process(detection) {
        // Store detection for dynamic ring drawing
        this.lastDetection = detection;

        const landmarks = detection.landmarks;
        const box = detection.detection.box;

        // Calculate face center position (RAW COORDS match Visual Canvas)
        const faceCenterX = box.x + box.width / 2;
        const faceCenterY = box.y + box.height / 2;

        const canvasCenterX = this.canvas.width / 2;
        const canvasCenterY = this.canvas.height / 2;

        // Check if face is centered (within 20% of canvas center)
        const offsetX = Math.abs(faceCenterX - canvasCenterX) / this.canvas.width;
        const offsetY = Math.abs(faceCenterY - canvasCenterY) / this.canvas.height;
        const isCentered = offsetX < 0.20 && offsetY < 0.20;

        // STEP 1: Initial Calibration
        if (this.step === 1) {
            const faceWidth = box.width / this.canvas.width;

            // Check centering first
            if (!isCentered) {
                // Directions are straightforward now
                if (faceCenterX < canvasCenterX - this.canvas.width * 0.15) {
                    this.status.innerText = "Move Right ➡️";
                } else if (faceCenterX > canvasCenterX + this.canvas.width * 0.15) {
                    this.status.innerText = "Move Left ⬅️";
                } else if (faceCenterY < canvasCenterY - this.canvas.height * 0.15) {
                    this.status.innerText = "Move Down ⬇️";
                } else if (faceCenterY > canvasCenterY + this.canvas.height * 0.15) {
                    this.status.innerText = "Move Up ⬆️";
                }
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            }
            // Check distance
            else if (faceWidth < 0.20) {
                this.status.innerText = "Move Closer 🔍";
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            } else if (faceWidth > 0.80) {
                this.status.innerText = "Move Back 🔙";
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            }
            // Perfect position!
            else {
                this.status.innerText = "Perfect! Hold Still... ✅";
                this.setRingColor('#4CD964'); // Green
                this.stableFrames++;

                if (this.stableFrames > 5) { // FASTER CALIBRATION (was 10)
                    this.step = 2;
                    this.stableFrames = 0;
                    this.capturePose('front', landmarks);
                    this.updateUI("Rotate Head", "Start rotating gently...");
                    this.setRingColor('rgba(255, 255, 255, 0.2)');
                }
            }
        }

        // STEP 2: Circular Scan with Pause/Resume + Directional Guide
        else if (this.step === 2) {
            const faceWidth = box.width / this.canvas.width;

            // Check if face is still in valid position
            if (!isCentered || faceWidth < 0.2 || faceWidth > 0.8) {
                this.setRingColor('#FF3B30');

                // Only show heavy warning if REALLY off
                if (offsetX > 0.25 || offsetY > 0.25) {
                    this.status.innerText = "⚠️ Center Face to Resume";
                } else {
                    this.status.innerText = "Adjusting...";
                }
                return;
            }

            // Calculate head rotation
            const nose = landmarks.getNose()[3];
            const leftEye = landmarks.getLeftEye()[0];
            const rightEye = landmarks.getRightEye()[3];

            const eyeCenterX = (leftEye.x + rightEye.x) / 2;
            const yaw = (nose.x - eyeCenterX) / 50;
            const pitch = (nose.y - leftEye.y) / 50;

            const angleRad = Math.atan2(pitch, yaw);
            let angleDeg = angleRad * (180 / Math.PI);
            if (angleDeg < 0) angleDeg += 360;

            const magnitude = Math.sqrt(yaw * yaw + pitch * pitch);

            // INTELLIGENT ROTATION GUIDANCE
            if (magnitude < 0.2) {
                // User is looking straight ahead
                this.status.innerText = "Turn Head Left or Right ↔️";
            } else {
                // User is rotating - encourage them
                this.status.innerText = `Scanning... ${Math.floor((this.capturedSegments.size / this.totalSegments) * 100)}%`;
            }

            // Capture segment if head is rotated enough
            if (magnitude > 0.3) {
                const segmentIndex = Math.floor(angleDeg / (360 / this.totalSegments));
                this.fillSegment(segmentIndex);

                // Check if scan is complete
                if (this.capturedSegments.size >= this.totalSegments * 0.75) {
                    this.finishScan();
                }
            }
        }
    }

    initRingSegments() {
        const svg = document.querySelector('.scan-ring-svg');
        if (!svg) return;

        const existingSegments = svg.querySelectorAll('.segment-arc');
        existingSegments.forEach(el => el.remove());

        const radius = 45;
        const center = 50;

        for (let i = 0; i < this.totalSegments; i++) {
            const startAngle = (i * 360) / this.totalSegments;
            const endAngle = ((i + 1) * 360) / this.totalSegments;

            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

            const dLine = [
                "M", x1, y1,
                "A", radius, radius, 0, largeArcFlag, 1, x2, y2
            ].join(" ");

            const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
            path.setAttribute("d", dLine);
            path.setAttribute("fill", "none");
            path.setAttribute("stroke", "rgba(255, 255, 255, 0.2)");
            path.setAttribute("stroke-width", "6");
            path.setAttribute("stroke-linecap", "round");
            path.setAttribute("class", "segment-arc");
            path.setAttribute("id", `segment-${i}`);

            svg.appendChild(path);
        }
    }





    fillSegment(index) {
        if (!this.capturedSegments.has(index)) {
            this.capturedSegments.add(index);
            const seg = document.getElementById(`segment-${index}`);
            if (seg) {
                seg.setAttribute("stroke", "#4CD964");
                seg.setAttribute("stroke-width", "8");
            }
        }
    }

    setRingColor(color) {
        const segs = document.querySelectorAll('.segment-arc');
        segs.forEach(s => {
            // Don't override completed (green) segments
            const currentColor = s.getAttribute("stroke");
            if (currentColor !== "#4CD964" && currentColor !== "#4cd964") {
                s.setAttribute("stroke", color);
            }
        });
    }

    capturePose(poseName, landmarks) {
        // Capture from CANVAS (brightened image)
        const captureCanvas = document.createElement('canvas');
        captureCanvas.width = this.canvas.width;
        captureCanvas.height = this.canvas.height;
        const captureCtx = captureCanvas.getContext('2d');
        captureCtx.drawImage(this.canvas, 0, 0);

        this.capturedPoses[poseName] = {
            image: captureCanvas.toDataURL('image/jpeg', 0.9),
            landmarks: landmarks.positions
        };
    }

    finishScan() {
        this.step = 3;
        console.log('✅ Scan Complete!');
        this.updateUI("Processing...", "Generating 3D Avatar", 100);

        for (let i = 0; i < this.totalSegments; i++) this.fillSegment(i);

        // Stop camera & rendering
        if (this.stream) this.stream.getTracks().forEach(track => track.stop());
        if (this.renderInterval) clearInterval(this.renderInterval);

        setTimeout(() => this.init3DViewer(), 800);
    }

    updateUI(title, status) {
        if (this.instruction) this.instruction.innerText = title;
        if (this.status) this.status.innerText = status;
    }

    init3DViewer() {
        this.step = 4;
        if (this.overlay) this.overlay.classList.add('hidden');

        const container = document.getElementById('threeContainer');
        container.classList.remove('hidden');

        this.canvas.classList.add('hidden');

        if (!this.scene) {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x111111);

            this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.z = 300;

            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.innerHTML = '';
            container.appendChild(this.renderer.domElement);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Lower ambient for contrast
            this.scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 1.0); // Stronger directional
            dirLight.position.set(0, 50, 50);
            this.scene.add(dirLight);

            // Backlight for edge definition
            const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
            backLight.position.set(0, 0, -50);
            this.scene.add(backLight);
        }

        this.generateFaceMesh();
        this.animate();

        const scanBtn = document.querySelector('.ar-scan-btn');
        if (scanBtn) {
            scanBtn.innerText = "❌ Exit";
            scanBtn.onclick = () => location.reload();
        }
    }

    generateFaceMesh() {
        if (!this.capturedPoses.front) return;

        console.log('🗿 Generating High-Fidelity 3D Face...');

        const image = new Image();
        image.src = this.capturedPoses.front.image;
        image.onload = () => {
            const texture = new THREE.Texture(image);
            texture.needsUpdate = true;
            texture.center.set(0.5, 0.5); // Center texture

            // Improved Geometry: Curved Plane with taper
            // We use a PlaneGeometry and bend it to create a face-like surface
            const width = 220;
            const height = 300;
            const segmentsW = 64; // High resolution
            const segmentsH = 64;

            const geometry = new THREE.PlaneGeometry(width, height, segmentsW, segmentsH);
            const positions = geometry.attributes.position;
            const uvs = geometry.attributes.uv;

            const radius = 140; // Curvature radius

            for (let i = 0; i < positions.count; i++) {
                const x = positions.getX(i);
                const y = positions.getY(i);
                let z = positions.getZ(i);

                // 1. Horizontal Curvature (face curve)
                // Normalize X to -1 to 1
                const normX = x / (width / 2);
                const angle = normX * (Math.PI / 4); // +/- 45 degrees

                const newX = radius * Math.sin(angle);
                const curveZ = radius * Math.cos(angle) - radius;

                // 2. Vertical Taper (chin is narrower)
                // Normalize Y to -1 (bottom) to 1 (top)
                const normY = y / (height / 2);
                let scaleX = 1.0;

                if (normY < 0) {
                    // Taper the bottom half (chin)
                    scaleX = 0.7 + (0.3 * (1 + normY)); // Tapers to 70% at bottom
                }

                positions.setXYZ(i, newX * scaleX, y, curveZ);
            }

            geometry.computeVertexNormals();

            // Material Upgrade: MeshStandardMaterial for better lighting interactions
            const material = new THREE.MeshStandardMaterial({
                map: texture,
                side: THREE.DoubleSide,
                roughness: 0.4,  // Skin-like
                metalness: 0.1,
                transparent: true
            });

            this.faceMesh = new THREE.Mesh(geometry, material);
            this.scene.add(this.faceMesh);
        };
    }

    animate() {
        if (this.step !== 4) return;
        requestAnimationFrame(() => this.animate());
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}

const faceScannerV3 = new FaceScannerV3();

function startFaceScanV3() {
    faceScannerV3.start();
}
