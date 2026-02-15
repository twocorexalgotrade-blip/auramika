/* =========================================
   3D FACE SCANNER & AVATAR ENGINE
   ========================================= */

class FaceScanner {
    constructor() {
        this.step = 0; // 0: Idle, 1: Calibration, 2: Circular Scan, 3: Processing, 4: Viewer
        this.capturedPoses = {
            front: null,
        };
        this.capturedSegments = new Set(); // 0-11 (12 segments)
        this.totalSegments = 12;

        this.overlay = document.getElementById('scanOverlay');
        this.instruction = document.getElementById('scanInstruction');
        this.status = document.getElementById('scanStatus');

        this.stableFrames = 0;

        // Three.js
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.faceMesh = null;
        this.controls = null;
    }

    async start() {
        console.log('🗿 [DEBUG] FaceScanner.start() called');
        console.log('🗿 [DEBUG] arActive:', typeof arActive !== 'undefined' ? arActive : 'undefined');

        // FORCE Reset if already active (because we might be in Hands mode)
        if (typeof arStream !== 'undefined' && arStream) {
            console.log('🗿 [DEBUG] Stopping existing AR stream to switch to Face Scanner...');
            arStream.getTracks().forEach(track => track.stop());
            arStream = null;
            arActive = false;
            // Also stop camera instance if accessible
            if (typeof camera !== 'undefined' && camera) {
                camera.stop();
                camera = null;
            }
        }

        if (!arActive) {
            console.log('🗿 3D Scan requested. Initializing AR Camera...');
            const modal = document.getElementById('arModal');
            if (modal) modal.classList.add('active');

            // ALWAYS FORCE 'face_scan' category for Scanner flow
            // This ensures MediaPipe Face Mesh is started, not Hands
            const pName = document.getElementById('productName')?.textContent || '3D Avatar Scan';
            const pImg = document.getElementById('productMainImage')?.src || '';

            window.currentProduct = {
                category: 'face_scan',
                name: '3D Avatar Scan: ' + pName,
                imageUrl: pImg
            };

            if (pImg) {
                window.productImage = new Image();
                window.productImage.crossOrigin = 'anonymous';
                window.productImage.src = pImg;
            }

            if (typeof initARElements === 'function') initARElements();
            if (typeof startARCamera === 'function') {
                try {
                    await startARCamera();
                    await new Promise(r => setTimeout(r, 1000));
                } catch (e) {
                    alert("Could not start camera: " + e);
                    return;
                }
            } else {
                alert("AR Engine not ready! Please wait.");
                return;
            }
        }

        console.log('🗿 [DEBUG] Starting 3D Face Scan...');
        console.log('🗿 [DEBUG] currentProduct:', currentProduct);

        // Hide AR Elements
        const prodInfo = document.querySelector('.ar-product-info');
        if (prodInfo) prodInfo.classList.add('hidden');

        const sizeControl = document.querySelector('.ar-size-control');
        if (sizeControl) sizeControl.classList.add('hidden');

        const instructions = document.querySelector('.ar-instructions');
        if (instructions) instructions.classList.add('hidden');

        // Show Scanner Overlay
        if (this.overlay) this.overlay.classList.remove('hidden');

        // Init Ring Segments
        this.initRingSegments();

        this.step = 1;
        this.updateUI("Position Face", "Center your face in the circle", 0);
    }

    initRingSegments() {
        console.log('🗿 [DEBUG] Initializing ring segments...');
        const svg = document.querySelector('.scan-ring-svg');
        if (!svg) {
            console.error('🗿 [DEBUG] ERROR: .scan-ring-svg not found!');
            return;
        }
        console.log('🗿 [DEBUG] SVG found, creating', this.totalSegments, 'segments');

        // Clear existing segments (keep bg circle)
        const existingSegments = svg.querySelectorAll('.segment-arc');
        existingSegments.forEach(el => el.remove());

        const radius = 45;
        const center = 50;

        for (let i = 0; i < this.totalSegments; i++) {
            const startAngle = (i * 360) / this.totalSegments;
            const endAngle = ((i + 1) * 360) / this.totalSegments;

            // Convert to radians (subtract 90 deg to start top)
            const startRad = (startAngle - 90) * (Math.PI / 180);
            const endRad = (endAngle - 90) * (Math.PI / 180);

            const x1 = center + radius * Math.cos(startRad);
            const y1 = center + radius * Math.sin(startRad);
            const x2 = center + radius * Math.cos(endRad);
            const y2 = center + radius * Math.sin(endRad);

            const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

            const d = [
                "M", center, center,
                "L", x1, y1,
                "A", radius, radius, 0, largeArcFlag, 1, x2, y2,
                "Z"
            ].join(" ");

            // Create Path (Use stroke-dasharray for line effect or filled path)
            // Let's use thick stroke segments
            // Actually, "M x1 y1 A ... " is just the arc.
            // If I want thick line, I shouldn't go to center.
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

    process(landmarks) {
        console.log('🗿 [DEBUG] process() called, step:', this.step, 'landmarks:', landmarks ? landmarks.length : 'null');
        if (this.step === 0 || this.step >= 3) return;

        // 1. Calibration (Lenient)
        if (this.step === 1) {
            const faceWidth = Math.abs(landmarks[454].x - landmarks[234].x);
            // Relaxed thresholds (0.25 to 0.75)
            console.log('🗿 [DEBUG] Step 1 - Face Width:', faceWidth.toFixed(3));

            if (faceWidth < 0.25) {
                this.status.innerText = "Move Closer ⬆️";
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            } else if (faceWidth > 0.75) {
                this.status.innerText = "Move Back ⬇️";
                this.setRingColor('#FF3B30'); // Red
                this.stableFrames = 0;
            } else {
                this.status.innerText = "Perfect! Hold Still... ✅";
                this.setRingColor('#4CD964'); // Green
                this.stableFrames++;

                if (this.stableFrames > 20) { // 20 frames = ~0.7s
                    this.step = 2; // Circular Scan
                    this.stableFrames = 0;
                    // Capture Front NOW as base texture
                    this.capturePose('front', landmarks);
                    this.updateUI("Rotate Head", "Move your head in a circle to complete the ring", 0);
                    // Reset Ring Color for next step
                    this.setRingColor('rgba(255, 255, 255, 0.2)');
                }
            }
        }

        // 2. Circular Scan
        else if (this.step === 2) {
            const yaw = this.getYaw(landmarks);   // Left-Right
            const pitch = this.getPitch(landmarks); // Up-Down

            // Calculate Angle (0-360)
            // atan2(y, x) -> result in radians -PI to PI
            const angleRad = Math.atan2(pitch, yaw);
            let angleDeg = angleRad * (180 / Math.PI);

            // Normalize to 0-360, starting from Top (Successive segments)
            // atan2(0,1) = 0 (Right). atan2(1,0) = 90 (Down).
            // Need mapping consistent with segments.
            // Segments start at Top (-90 deg in SVG space).
            // Let's just map angle to segment index.

            if (angleDeg < 0) angleDeg += 360;

            // Determine magnitude (how far from center) to avoid triggering when looking straight
            const magnitude = Math.sqrt(yaw * yaw + pitch * pitch);

            // Threshold for "intent"
            if (magnitude > 0.2) {
                // Determine Segment
                // Adjust angle so Top is 0?
                // Currently Right is 0.
                // It doesn't matter as long as user can hit all.

                const segmentIndex = Math.floor(angleDeg / (360 / this.totalSegments));

                this.fillSegment(segmentIndex);

                // Check Completion
                if (this.capturedSegments.size >= this.totalSegments * 0.75) { // 75% coverage enough
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
                seg.setAttribute("stroke", "#4CD964"); // Green on hit
                seg.setAttribute("stroke-width", "8");
            }
        }
    }

    setRingColor(color) {
        console.log('🗿 [DEBUG] setRingColor called:', color);
        const segs = document.querySelectorAll('.segment-arc');
        console.log('🗿 [DEBUG] Found', segs.length, 'segments');
        segs.forEach(s => {
            if (s.getAttribute("stroke") !== "#4CD964") { // Don't override completed (green)
                s.setAttribute("stroke", color);
            }
        });
    }

    getYaw(landmarks) {
        // (x - 0.5) * scale
        return (landmarks[1].x - 0.5) * 5; // Scale up sensitivity
    }

    getPitch(landmarks) {
        // (y - 0.5) * scale
        return (landmarks[1].y - 0.5) * 5;
    }

    capturePose(poseName, landmarks) {
        // Capture Video Frame
        const video = document.getElementById('arVideo');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.scale(-1, 1); // Un-mirror for texture
        ctx.drawImage(video, 0, 0, -canvas.width, canvas.height);

        this.capturedPoses[poseName] = {
            image: canvas.toDataURL('image/jpeg', 0.9),
            landmarks: JSON.parse(JSON.stringify(landmarks))
        };
    }

    finishScan() {
        this.step = 3;
        console.log('✅ Circular Scan Complete!');
        this.updateUI("Processing...", "Generating your 3D Avatar", 100);

        // Fill all segments for visual completeness
        for (let i = 0; i < this.totalSegments; i++) this.fillSegment(i);

        setTimeout(() => {
            this.init3DViewer();
        }, 800);
    }

    updateUI(title, status, progress) {
        if (!this.instruction) return;
        this.instruction.innerText = title;
        this.status.innerText = status;
    }

    // =========================================
    // THREE.JS VIEWER
    // =========================================
    init3DViewer() {
        this.step = 4;
        if (this.overlay) this.overlay.classList.add('hidden');

        // Switch Container
        const container = document.getElementById('threeContainer');
        container.classList.remove('hidden');

        const video = document.querySelector('.ar-camera-container video');
        if (video) video.classList.add('hidden');

        const canvas = document.querySelector('.ar-camera-container canvas');
        if (canvas) canvas.classList.add('hidden');

        // Setup Scene
        if (!this.scene) {
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x111111);

            this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
            this.camera.position.z = 50;

            this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            this.renderer.setSize(container.clientWidth, container.clientHeight);
            container.innerHTML = '';
            container.appendChild(this.renderer.domElement);

            // Controls
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.minDistance = 20;
            this.controls.maxDistance = 100;

            // Lights
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(ambientLight);

            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(0, 10, 10);
            this.scene.add(dirLight);
        } else {
            while (this.scene.children.length > 0) {
                this.scene.remove(this.scene.children[0]);
            }
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
            this.scene.add(ambientLight);
            const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight.position.set(0, 10, 10);
            this.scene.add(dirLight);
        }


        // Generate Mesh
        this.generateFaceMesh();

        // Start Animation Loop
        this.animate();

        // Restore Overlay UI (for Jewelry controls)
        const prodInfo = document.querySelector('.ar-product-info');
        if (prodInfo) prodInfo.classList.remove('hidden');

        const sizeControl = document.querySelector('.ar-size-control');
        if (sizeControl) sizeControl.classList.remove('hidden');

        // Update Action Button to "Exit 3D"
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
        const indices = [];

        // 1. Vertices & UVs from Landmarks
        landmarks.forEach(l => {
            // Scale and center (adjust as needed)
            const x = (l.x - 0.5) * -20;
            const y = (l.y - 0.5) * -20;
            const z = (l.z) * -20;
            vertices.push(x, y, z);
            uvs.push(l.x, 1 - l.y);
        });

        // 2. Indices from MediaPipe Tesselation
        if (typeof FACEMESH_TESSELATION !== 'undefined') {
            FACEMESH_TESSELATION.forEach(tri => {
                indices.push(tri[0], tri[1], tri[2]);
            });
        } else {
            console.warn("⚠️ FACEMESH_TESSELATION not found. Falling back to Point Cloud.");
            const material = new THREE.PointsMaterial({ color: 0x00FF00, size: 0.2 });
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            const points = new THREE.Points(geometry, material);
            this.scene.add(points);
            this.faceMesh = points;
            return;
        }

        geometry.setIndex(indices);
        geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.computeVertexNormals();

        // 3. Texture & Material
        const loader = new THREE.TextureLoader();
        const texture = loader.load(this.capturedPoses.front.image);
        texture.flipY = false;

        const material = new THREE.MeshStandardMaterial({
            map: texture,
            side: THREE.DoubleSide,
            roughness: 0.5,
            metalness: 0,
            wireframe: false
        });

        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(this.faceMesh);
    }

    animate() {
        if (!this.step === 4) return;
        requestAnimationFrame(() => this.animate());
        if (this.controls) this.controls.update();
        if (this.renderer && this.scene && this.camera) {

            // Auto Rotate for effect?
            if (this.faceMesh) {
                // this.faceMesh.rotation.y += 0.005;
            }

            this.renderer.render(this.scene, this.camera);
        }
    }
}

// Global Instance
const faceScanner = new FaceScanner();

function startFaceScan() {
    faceScanner.start();
}
