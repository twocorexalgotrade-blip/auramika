const customOrderData = {
    chainType: '',
    thickness: '',
    length: '',
    purity: '',
    weightPreference: '',
    stylePreference: '',
    claspType: '',
    stones: 'No stones',
    usage: '',
    budget: '',
    notes: '',
    referenceImages: []
};

const wizardSteps = [
    { id: 'intro', question: "Let's Design Your Perfect Chain" },
    { id: 'type', question: "Select Chain Type" },
    { id: 'thickness', question: "Select Thickness" },
    { id: 'length', question: "Select Length" },
    { id: 'purity', question: "Choose Gold Purity" },
    { id: 'weight', question: "Weight Expectation" },
    { id: 'style', question: "Design Preference" },
    { id: 'clasp', question: "Clasp Type" },
    { id: 'stones', question: "Stone / Diamond Option" },
    { id: 'usage', question: "Usage Purpose" },
    { id: 'budget', question: "Budget Confirmation" },
    { id: 'notes', question: "Any Special Requests?" },
    { id: 'summary', question: "Review Your Design" }
];

let currentStepIndex = 0;

function initCustomOrderWizard() {
    console.log("Initializing Custom Order Wizard...");

    // Inject HTML if not present
    if (!document.getElementById('customOrderOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'customOrderOverlay';
        overlay.className = 'custom-order-overlay';
        overlay.innerHTML = `
            <div class="wizard-container">
                <button class="wizard-close" onclick="closeCustomOrder()">×</button>
                <div class="wizard-progress-track">
                    <div class="wizard-progress-bar" id="wizardProgressBar"></div>
                </div>
                <div id="wizardContent"></div>
                <div class="wizard-actions">
                    <button class="btn-wizard btn-back" id="btnBack" onclick="prevStep()">← Back</button>
                    <button class="btn-wizard btn-next" id="btnNext" onclick="nextStep()">Next →</button>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    renderStep(0);
}

function openCustomOrder() {
    initCustomOrderWizard();
    setTimeout(() => {
        document.getElementById('customOrderOverlay').classList.add('active');
    }, 10);
}

function closeCustomOrder() {
    document.getElementById('customOrderOverlay').classList.remove('active');
    // Reset after transition
    setTimeout(() => {
        currentStepIndex = 0;
        renderStep(0);
    }, 400);
}

function renderStep(index) {
    const contentDiv = document.getElementById('wizardContent');
    const step = wizardSteps[index];
    const progress = ((index + 1) / wizardSteps.length) * 100;

    document.getElementById('wizardProgressBar').style.width = `${progress}%`;

    // Manage Buttons
    document.getElementById('btnBack').style.visibility = index === 0 ? 'hidden' : 'visible';
    const nextBtn = document.getElementById('btnNext');

    if (index === wizardSteps.length - 1) {
        nextBtn.innerHTML = 'Submit Request ✨';
        nextBtn.onclick = submitCustomOrder;
    } else {
        nextBtn.innerHTML = 'Next →';
        nextBtn.onclick = nextStep;
    }

    // Generate Step HTML
    let stepHTML = `
        <div class="step-content active">
            <h2 class="step-question">${step.question}</h2>
            <div id="stepBody" style="width: 100%;">
                ${getStepBody(step.id)}
            </div>
        </div>
    `;

    contentDiv.innerHTML = stepHTML;

    // Restore selected value if any
    restoreSelection(step.id);
}

function getStepBody(stepId) {
    switch (stepId) {
        case 'intro':
            return `
                <p class="step-subtitle">Create a unique gold chain tailored to your exact specifications. Our AI will even visualize it for you!</p>
                <button class="btn-wizard btn-next" onclick="nextStep()" style="width: auto; margin: 0 auto;">Start Designing</button>
            `;
        case 'type':
            return `
                <div class="options-grid">
                    ${createOptionCard('type', 'Box Chain', 'box_chain.jpg')}
                    ${createOptionCard('type', 'Cable Chain', 'cable_chain.jpg')}
                    ${createOptionCard('type', 'Figaro Chain', 'figaro_chain.jpg')}
                    ${createOptionCard('type', 'Rope Chain', 'rope_chain.jpg')}
                    ${createOptionCard('type', 'Curb Chain', 'curb_chain.jpg')}
                    ${createOptionCard('type', 'Miami Cuban', 'cuban_chain.jpg')}
                </div>
            `;
        case 'thickness':
            return `
                <div class="options-grid">
                    ${createOptionCard('thickness', 'Thin (1-2mm)', '')}
                    ${createOptionCard('thickness', 'Medium (2-4mm)', '')}
                    ${createOptionCard('thickness', 'Thick (4-7mm)', '')}
                    ${createOptionCard('thickness', 'Heavy (8mm+)', '')}
                </div>
            `;
        case 'length':
            return `
                <div class="options-grid">
                    ${createOptionCard('length', '16" (Choker)', '')}
                    ${createOptionCard('length', '18" (Standard Women)', '')}
                    ${createOptionCard('length', '20" (Standard Men)', '')}
                    ${createOptionCard('length', '22-24" (Long)', '')}
                </div>
            `;
        case 'purity':
            return `
                <div class="options-grid">
                    ${createOptionCard('purity', '18KT', '')}
                    ${createOptionCard('purity', '20KT', '')}
                    ${createOptionCard('purity', '22KT', '')}
                </div>
            `;
        case 'weight':
            return `
                <div class="options-grid">
                    ${createOptionCard('weight', 'Lightweight', '')}
                    ${createOptionCard('weight', 'Standard', '')}
                    ${createOptionCard('weight', 'Premium Heavy', '')}
                </div>
            `;
        case 'style':
            return `
                <div class="options-grid">
                    ${createOptionCard('style', 'Simple/Plain', '')}
                    ${createOptionCard('style', 'Bold/Statement', '')}
                    ${createOptionCard('style', 'Daily Wear', '')}
                    ${createOptionCard('style', 'Traditional', '')}
                    ${createOptionCard('style', 'Modern', '')}
                </div>
            `;
        case 'clasp':
            return `
                <div class="options-grid">
                    ${createOptionCard('clasp', 'Lobster Clasp', '')}
                    ${createOptionCard('clasp', 'Spring Ring', '')}
                    ${createOptionCard('clasp', 'Box Clasp', '')}
                </div>
            `;
        case 'stones':
            return `
                <div class="options-grid">
                    ${createOptionCard('stones', 'No Stones', '')}
                    ${createOptionCard('stones', 'Diamonds', '')}
                    ${createOptionCard('stones', 'CZ Stones', '')}
                    ${createOptionCard('stones', 'Rubies/Emeralds', '')}
                </div>
            `;
        case 'usage':
            return `
                <div class="options-grid">
                    ${createOptionCard('usage', 'Daily Wear', '')}
                    ${createOptionCard('usage', 'Party Wear', '')}
                    ${createOptionCard('usage', 'Gifting', '')}
                    ${createOptionCard('usage', 'Bridal', '')}
                </div>
            `;
        case 'budget':
            return `
                <input type="number" id="input-budget" class="custom-number-input" placeholder="Enter Budget (₹)" onchange="saveInput('budget', this.value)">
                <p class="step-subtitle" style="margin-top: 10px">Approximate budget helps us suggest best options.</p>
            `;
        case 'notes':
            return `
                <textarea id="input-notes" class="custom-textarea" placeholder="Any special requests? (e.g., 'Make it very shiny', 'Match with my ring')" onchange="saveInput('notes', this.value)"></textarea>
            `;
        case 'summary':
            return `
                <div class="summary-container">
                    ${generateSummaryHTML()}
                </div>
                <div class="ai-generation-box">
                    <button class="btn-wizard btn-generate" onclick="generateAIImage()">✨ Generate 3D Preview with AI</button>
                    <div id="aiImageContainer" class="generated-image-wrapper" style="display:none;">
                        <div class="loading-spinner"></div>
                    </div>
                </div>
            `;
        default:
            return '';
    }
}

function createOptionCard(param, label, imgPath) {
    const isSelected = customOrderData[param] === label ? 'checked' : '';
    // Placeholder image logic
    const imgHTML = imgPath ? `<img src="web asset/products/${imgPath}" onerror="this.src='web asset/logos/shree_hari.png'" class="option-img">` : '';

    return `
        <label>
            <input type="radio" name="wizard_${param}" value="${label}" class="radio-hidden" onclick="selectOption('${param}', '${label}')" ${isSelected}>
            <div class="option-card-label">
                ${imgHTML}
                <span class="option-text">${label}</span>
            </div>
        </label>
    `;
}

function selectOption(param, value) {
    customOrderData[param] = value;
    // Auto align visual state if needed
}

function saveInput(param, value) {
    customOrderData[param] = value;
}

function restoreSelection(stepId) {
    if (stepId === 'budget' && customOrderData.budget) {
        document.getElementById('input-budget').value = customOrderData.budget;
    }
    if (stepId === 'notes' && customOrderData.notes) {
        document.getElementById('input-notes').value = customOrderData.notes;
    }
}

function nextStep() {
    if (currentStepIndex < wizardSteps.length - 1) {
        currentStepIndex++;
        renderStep(currentStepIndex);
    }
}

function prevStep() {
    if (currentStepIndex > 0) {
        currentStepIndex--;
        renderStep(currentStepIndex);
    }
}

function generateSummaryHTML() {
    return Object.entries(customOrderData)
        .filter(([key, val]) => val && key !== 'referenceImages')
        .map(([key, val]) => `
            <div class="summary-row">
                <span class="summary-key">${formatKey(key)}</span>
                <span class="summary-val">${val}</span>
            </div>
        `).join('');
}

function formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

async function generateAIImage() {
    const container = document.getElementById('aiImageContainer');
    container.style.display = 'flex';
    container.innerHTML = '<div class="loading-pulse"></div><p style="color:#C9A961; margin-left:15px">Designing your chain with AI...</p>';

    // Construct Prompt
    const prompt = `A high-quality, photorealistic 3D render of a gold necklace chain on a black mannequin neck. 
    Type: ${customOrderData.chainType}. 
    Thickness: ${customOrderData.thickness}. 
    Length: ${customOrderData.length}. 
    Style: ${customOrderData.stylePreference}. 
    Metal: ${customOrderData.purity} Gold. 
    Stones: ${customOrderData.stones}. 
    Lighting: Cinematic, studio lighting, 8k resolution, macro detail.`;

    console.log("🎨 Sending Prompt to AI:", prompt);

    // Ensure we have a valid base URL
    const baseUrl = (typeof API_BASE_URL !== 'undefined') ? API_BASE_URL : 'http://localhost:3000';

    try {
        const response = await fetch(`${baseUrl}/api/generate-design`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt })
        });

        if (!response.ok) throw new Error('Generation failed');

        const data = await response.json();
        const imageUrl = data.url;

        container.innerHTML = `<img src="${imageUrl}" class="final-design-img" alt="Generated Design">`;

    } catch (e) {
        console.error("Generation failed:", e);
        container.innerHTML = `
            <div style="text-align:center">
                <p style="color:red; margin-bottom:10px">Generation failed.</p>
                <button class="btn-wizard" onclick="generateAIImage()" style="font-size:0.9rem; padding:8px 16px">Try Again</button>
            </div>`;
    }
}

function submitCustomOrder() {
    alert("Order Submitted! \nWe will contact you shortly with the design and quote.");
    closeCustomOrder();
}
