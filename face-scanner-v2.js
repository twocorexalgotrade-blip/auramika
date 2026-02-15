/* =========================================
   3D FACE SCANNER - face-api.js Version
   ========================================= */

class FaceScannerV2 {
    constructor() {
        this.step = 0; // 0: Idle, 1: Calibration, 2: Circular Scan, 3: Processing, 4: Viewer
        this.capturedPoses = {
            front: null,
        };
        this.capturedSegments = new Set();
        this.totalSegments = 12;

        this.overlay = document.getElementById('scanOverlay');
        this.instruction = document.getElementById('scanInstruction');
        this.status = document.getElementById('scanStatus');

        this.stableFrames = 0;
        this.modelsLoaded = false;

        // Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.faceMesh = null;
        this.controls = null;

        // Video stream
        this.video = null;
        this.stream = null;
        this.detectionInterval = null;
    }

    async loadModels() {
        if (this.modelsLoaded) return;

        console.log('🗿 [DEBUG] Loading face-api.js models...');
        const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

        try {
            await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
            await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
            this.modelsLoaded = true;
            console.log('✅ face-api.js models loaded');
        } catch (e) {
            console.error('❌ Failed to load face-api.js models:', e);
            throw e;
        }
    }

    async start() {
        console.log('🗿 [DEBUG] FaceScannerV2.start() called');

        try {
            // Load models first
            await this.loadModels();

            // Show modal
            const modal = document.getElementById('arModal');
            if (modal) modal.classList.add('active');

            // Hide AR elements
            const prodInfo = document.querySelector('.ar-product-info');
            if (prodInfo) prodInfo.classList.add('hidden');

            const sizeControl = document.querySelector('.ar-size-control');
            if (sizeControl) sizeControl.classList.add('hidden');

            const instructions = document.querySelector('.ar-instructions');
            if (instructions) instructions.classList.add('hidden');

            // Show scanner overlay
            if (this.overlay) this.overlay.classList.remove('hidden');

            // Init ring segments
            this.initRingSegments();

            // Start camera
            await this.startCamera();

            this.step = 1;
            this.updateUI("Position Face", "Center your face in the circle", 0);

            // Start detection loop
            this.startDetection();

        } catch (e) {
            console.error('❌ Scanner start failed:', e);
            alert('Failed to start scanner: ' + e.message);
        }
    }

    async startCamera() {
        console.log('🗿 [DEBUG] Starting camera with HIGH QUALITY settings...');

        this.video = document.getElementById('arVideo');

        try {
            // Request MAXIMUM quality camera stream
            this.stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    width: { ideal: 1920, min: 1280 },
                    height: { ideal: 1080, min: 720 },
                    facingMode: 'user',
                    frameRate: { ideal: 30 },
                    aspectRatio: { ideal: 16 / 9 }
                }
            });

            this.video.srcObject = this.stream;

            // Wait for video metadata to load
            await new Promise((resolve) => {
                this.video.onloadedmetadata = () => {
                    resolve();
                };
            });

            await this.video.play();

            console.log('✅ Camera started at', this.video.videoWidth, 'x', this.video.videoHeight);
            console.log('📹 Video element size:', this.video.clientWidth, 'x', this.video.clientHeight);
        } catch (e) {
            console.error('❌ Camera error:', e);
            alert('Camera access failed. Please:\n1. Close Photo Booth\n2. Refresh this page\n3. Allow camera access');
            throw e;
        }
    }

    startDetection() {
        console.log('🗿 [DEBUG] Starting face detection loop...');

        // Run detection every 100ms
        this.detectionInterval = setInterval(async () => {
            if (this.step === 0 || this.step >= 3) {
                clearInterval(this.detectionInterval);
                return;
            }

            try {
                const detection = await faceapi
                    .detectSingleFace(this.video, new faceapi.TinyFaceDetectorOptions())
                    .withFaceLandmarks();

                if (detection) {
                    this.process(detection);
                } else {
                    console.log('🗿 [DEBUG] No face detected');
                }
            } catch (e) {
                console.error('Detection error:', e);
            }
        }, 100);
    }

    initRingSegments() {
        console.log('🗿 [DEBUG] Initializing ring segments...');
        const svg = document.querySelector('.scan-ring-svg');
        if (!svg) {
            console.error('🗿 [DEBUG] ERROR: .scan-ring-svg not found!');
            return;
        }
        console.log('🗿 [DEBUG] SVG found, creating', this.totalSegments, 'segments');

        // Clear existing segments
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

    process(detection) {
        const landmarks = detection.landmarks;
        const box = detection.detection.box;

        console.log('🗿 [DEBUG] Face detected! Box width:', box.width);

        // Step 1: Calibration
        if (this.step === 1) {
            // Use face box width as distance metric (larger = closer)
            const faceWidth = box.width / this.video.videoWidth;
            console.log('🗿 [DEBUG] Step 1 - Face Width:', faceWidth.toFixed(3));

            if (faceWidth < 0.3) {
                this.status.innerText = "Move Closer ⬆️";
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            } else if (faceWidth > 0.7) {
                this.status.innerText = "Move Back ⬇️";
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            } else {
                this.status.innerText = "Perfect! Hold Still... ✅";
                this.setRingColor('#4CD964'); // Green
                this.stableFrames++;

                if (this.stableFrames > 15) {
                    this.step = 2;
                    this.stableFrames = 0;
                    this.capturePose('front', landmarks);
                    this.updateUI("Rotate Head", "Move your head in a circle to complete the ring", 0);
                    this.setRingColor('rgba(255, 255, 255, 0.2)');
                }
            }
        }

        // Step 2: Circular Scan
        else if (this.step === 2) {
            const nose = landmarks.getNose()[3]; // Nose tip
            const leftEye = landmarks.getLeftEye()[0];
            const rightEye = landmarks.getRightEye()[3];

            // Calculate head rotation angle
            const eyeCenterX = (leftEye.x + rightEye.x) / 2;
            const yaw = (nose.x - eyeCenterX) / 50; // Normalized
            const pitch = (nose.y - leftEye.y) / 50;

            const angleRad = Math.atan2(pitch, yaw);
            let angleDeg = angleRad * (180 / Math.PI);
            if (angleDeg < 0) angleDeg += 360;

            const magnitude = Math.sqrt(yaw * yaw + pitch * pitch);

            if (magnitude > 0.3) {
                const segmentIndex = Math.floor(angleDeg / (360 / this.totalSegments));
                this.fillSegment(segmentIndex);

                if (this.capturedSegments.size >= this.totalSegments * 0.75) {
                    this.finishScan();
                }
            }
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
        console.log('🗿 [DEBUG] setRingColor called:', color);
        const segs = document.querySelectorAll('.segment-arc');
        segs.forEach(s => {
            if (s.getAttribute("stroke") !== "#4CD964") {
                s.setAttribute("stroke", color);
            }
        });
    }

    capturePose(poseName, landmarks) {
        const canvas = document.createElement('canvas');
        canvas.width = this.video.videoWidth;
        canvas.height = this.video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0);

        this.capturedPoses[poseName] = {
            image: canvas.toDataURL('image/jpeg', 0.9),
            landmarks: landmarks.positions
        };
    }

    finishScan() {
        this.step = 3;
        console.log('✅ Scan Complete!');
        this.updateUI("Processing...", "Generating your 3D Avatar", 100);

        for (let i = 0; i < this.totalSegments; i++) this.fillSegment(i);

        // Stop camera
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        setTimeout(() => {
            this.init3DViewer();
        }, 800);
    }

    updateUI(title, status, progress) {
        if (!this.instruction) return;
        this.instruction.innerText = title;
        this.status.innerText = status;
    }

    init3DViewer() {
        this.step = 4;
        if (this.overlay) this.overlay.classList.add('hidden');

        const container = document.getElementById('threeContainer');
        container.classList.remove('hidden');

        const video = document.querySelector('.ar-camera-container video');
        if (video) video.classList.add('hidden');

        const canvas = document.querySelector('.ar-camera-container canvas');
        if (canvas) canvas.classList.add('hidden');

        if (!this.scene) {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x111111);

            this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.z = 300;

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.innerHTML = '';
            container.appendChild(this.renderer.domElement);

            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;

            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(0, 10, 10);
            this.scene.add(dirLight);
        }

        this.generateFaceMesh();
        this.animate();

        const scanBtn = document.querySelector('.ar-scan-btn');
        if (scanBtn) {
            scanBtn.innerText = "❌ Exit 3D";
            scanBtn.onclick = () => { location.reload(); };
        }
    }

    generateFaceMesh() {
        if (!this.capturedPoses.front) return;

        const landmarks = this.capturedPoses.front.landmarks;
        const geometry = new THREE.BufferGeometry();

        const vertices = [];
        const uvs = [];

        landmarks.forEach(l => {
            const x = (l.x - this.video.videoWidth / 2) * 0.5;
            const y = (l.y - this.video.videoHeight / 2) * -0.5;
            const z = 0;
            vertices.push(x, y, z);
            uvs.push(l.x / this.video.videoWidth, 1 - l.y / this.video.videoHeight);
        });

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));

        const loader = new THREE.TextureLoader();
        const texture = loader.load(this.capturedPoses.front.image);

        const material = new THREE.PointsMaterial({
            map: texture,
            size: 3,
            sizeAttenuation: true
        });

        this.faceMesh = new THREE.Points(geometry, material);
        this.scene.add(this.faceMesh);
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

// Global Instance
const faceScannerV2 = new FaceScannerV2();

function startFaceScanV2() {
    faceScannerV2.start();
}
