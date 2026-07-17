// ===== DOM ELEMENTS =====
const splash = document.getElementById('splash');
const app = document.getElementById('app');
const form = document.getElementById('blueprintForm');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const generateBtn = document.getElementById('generateBtn');
const themeToggle = document.getElementById('themeToggle');
const progressFill = document.getElementById('progressFill');
const successModal = document.getElementById('successModal');
const closeModal = document.getElementById('closeModal');
const summaryContent = document.getElementById('projectSummary');

// ===== STATE =====
let currentStep = 1;
const totalSteps = 8;

// ===== SPLASH SCREEN =====
window.addEventListener('load', () => {
    setTimeout(() => {
        splash.style.display = 'none';
        app.classList.remove('hidden');
    }, 2800);
});

// ===== THEME TOGGLE =====
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const icon = themeToggle.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
});

// ===== NAVIGATION =====
prevBtn.addEventListener('click', () => {
    if (currentStep > 1) {
        updateStep(currentStep - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (currentStep < totalSteps) {
        if (validateStep(currentStep)) {
            updateStep(currentStep + 1);
        }
    }
});

// ===== STEP NAVIGATION =====
document.querySelectorAll('.step').forEach(step => {
    step.addEventListener('click', () => {
        const stepNum = parseInt(step.dataset.step);
        if (stepNum < currentStep || validateStep(currentStep)) {
            updateStep(stepNum);
        }
    });
});

// ===== UPDATE STEP =====
function updateStep(step) {
    currentStep = step;
    
    // Update sections
    document.querySelectorAll('.form-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelector(`[data-section="${step}"]`).classList.add('active');
    
    // Update progress steps
    document.querySelectorAll('.step').forEach((s, index) => {
        s.classList.remove('active', 'completed');
        if (index + 1 === step) {
            s.classList.add('active');
        } else if (index + 1 < step) {
            s.classList.add('completed');
        }
    });
    
    // Update progress bar
    progressFill.style.width = `${(step / totalSteps) * 100}%`;
    
    // Update buttons
    prevBtn.disabled = step === 1;
    
    if (step === totalSteps) {
        nextBtn.style.display = 'none';
        generateBtn.style.display = 'flex';
        updateSummary();
    } else {
        nextBtn.style.display = 'flex';
        generateBtn.style.display = 'none';
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ===== VALIDATE STEP =====
function validateStep(step) {
    const section = document.querySelector(`[data-section="${step}"]`);
    const requiredFields = section.querySelectorAll('[required]');
    
    for (let field of requiredFields) {
        if (!field.value.trim()) {
            field.style.borderColor = 'var(--error)';
            field.focus();
            
            // Shake animation
            field.style.animation = 'none';
            field.offsetHeight; // Trigger reflow
            field.style.animation = 'shake 0.5s ease';
            
            return false;
        }
        field.style.borderColor = '';
    }
    
    // Check radio buttons if required
    if (step === 2) {
        const projectType = document.querySelector('input[name="projectType"]:checked');
        if (!projectType) {
            alert('Please select a project type');
            return false;
        }
    }
    
    if (step === 4) {
        const dbType = document.querySelector('input[name="databaseType"]:checked');
        if (!dbType) {
            alert('Please select a database type');
            return false;
        }
    }
    
    if (step === 7) {
        const hosting = document.querySelector('input[name="hosting"]:checked');
        if (!hosting) {
            alert('Please select a hosting platform');
            return false;
        }
    }
    
    return true;
}

// ===== UPDATE SUMMARY =====
function updateSummary() {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get checked values
    const designStyle = formData.getAll('designStyle').join(', ') || 'Not specified';
    const languages = formData.getAll('languages').join(', ') || 'English';
    const securityFeatures = formData.getAll('securityFeatures').join(', ') || 'None selected';
    const compliance = formData.getAll('compliance').join(', ') || 'None selected';
    const payment = formData.getAll('payment').join(', ') || 'None';
    const cicd = formData.getAll('cicd').join(', ') || 'None';
    
    summaryContent.innerHTML = `
        <div class="summary-item">
            <span class="label"><i class="fas fa-user"></i> Client</span>
            <span class="value">${data.clientName || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-building"></i> Business</span>
            <span class="value">${data.businessName || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-tag"></i> Project</span>
            <span class="value">${data.projectName || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-mobile-alt"></i> App Name</span>
            <span class="value">${data.appName || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-code"></i> Package</span>
            <span class="value">${data.packageName || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-list"></i> Type</span>
            <span class="value">${data.projectType || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-tint"></i> Colors</span>
            <span class="value">${data.primaryColor} / ${data.secondaryColor}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-paint-brush"></i> Design</span>
            <span class="value">${designStyle}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-language"></i> Languages</span>
            <span class="value">${languages}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-server"></i> Database</span>
            <span class="value">${data.databaseType || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-lock"></i> Security</span>
            <span class="value">${securityFeatures}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-cloud"></i> Hosting</span>
            <span class="value">${data.hosting || 'Not specified'}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-money-bill"></i> Payment</span>
            <span class="value">${payment}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-cogs"></i> CI/CD</span>
            <span class="value">${cicd}</span>
        </div>
        <div class="summary-item">
            <span class="label"><i class="fas fa-file-contract"></i> Compliance</span>
            <span class="value">${compliance}</span>
        </div>
    `;
}

// ===== GENERATE BLUEPRINT =====
generateBtn.addEventListener('click', () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get all checked values
    const designStyle = formData.getAll('designStyle');
    const languages = formData.getAll('languages');
    const securityFeatures = formData.getAll('securityFeatures');
    const compliance = formData.getAll('compliance');
    const payment = formData.getAll('payment');
    const cicd = formData.getAll('cicd');
    
    const includeAiPrompt = document.querySelector('input[name="includeAiPrompt"]').checked;
    const includeChecklist = document.querySelector('input[name="includeChecklist"]').checked;
    const includeDeployment = document.querySelector('input[name="includeDeployment"]').checked;
    
    // Generate markdown content
    let blueprint = generateMarkdown(data, {
        designStyle,
        languages,
        securityFeatures,
        compliance,
        payment,
        cicd,
        includeAiPrompt,
        includeChecklist,
        includeDeployment
    });
    
    // Download file
    downloadFile(blueprint, `${data.projectName || 'Project'}_Blueprint.md`);
    
    // Show success modal
    successModal.classList.remove('hidden');
});

// ===== GENERATE MARKDOWN =====
function generateMarkdown(data, options) {
    let md = `# ${data.projectName || 'Project'} Blueprint

---

## 1. CLIENT INFORMATION

| Field | Value |
|-------|-------|
| **Client Name** | ${data.clientName || 'N/A'} |
| **Business Name** | ${data.businessName || 'N/A'} |
| **Contact** | ${data.clientPhone || 'N/A'} |
| **Email** | ${data.clientEmail || 'N/A'} |
| **WhatsApp** | ${data.clientWhatsapp || 'N/A'} |
| **Timezone** | ${data.timezone || 'PKT'} |
| **Industry** | ${data.industry || 'N/A'} |
| **Target Audience** | ${data.targetAudience || 'N/A'} |
| **Budget** | ${data.budget || 'N/A'} |
| **Deadline** | ${data.deadline || 'N/A'} |

---

## 2. PROJECT DETAILS

| Field | Value |
|-------|-------|
| **Project Name** | ${data.projectName || 'N/A'} |
| **App Name** | ${data.appName || 'N/A'} |
| **Package Name** | ${data.packageName || 'N/A'} |
| **Version** | ${data.version || '1.0.0'} |
| **Project Type** | ${data.projectType || 'N/A'} |

### Problem Statement
${data.problemStatement || 'N/A'}

### Solution
${data.solution || 'N/A'}

### Unique Selling Point
${data.usp || 'N/A'}

---

## 3. FEATURES & DESIGN

### Core Features (MVP)
${data.coreFeatures || 'N/A'}

### Secondary Features
${data.secondaryFeatures || 'N/A'}

### Design Configuration
| Setting | Value |
|---------|-------|
| **Primary Color** | ${data.primaryColor || '#6C63FF'} |
| **Secondary Color** | ${data.secondaryColor || '#FF6584'} |
| **Design Style** | ${options.designStyle.join(', ') || 'Material Design'} |
| **Languages** | ${options.languages.join(', ') || 'English'} |

### Design References
${data.designReferences || 'N/A'}

---

## 4. DATABASE DESIGN

| Setting | Value |
|---------|-------|
| **Database Type** | ${data.databaseType || 'Firebase Realtime'} |

### Collections/Tables
\`\`\`
${data.databaseCollections || 'Users - id, name, email, phone, avatar'}
\`\`\`

### Relationships
\`\`\`
${data.relationships || 'Users 1:N Posts'}
\`\`\`

### Security Rules
${data.securityRules || 'Authenticated users can read/write their own data'}

---

## 5. API ENDPOINTS

| Setting | Value |
|---------|-------|
| **Base URL** | ${data.apiBaseUrl || 'N/A'} |
| **Authentication** | ${data.authType || 'JWT'} |
| **Rate Limiting** | ${data.rateLimit || '100/hour'} |

### Endpoints
\`\`\`
${data.apiEndpoints || 'GET /items - Get all items\nPOST /items - Create item'}
\`\`\`

### Third-Party APIs
${data.thirdPartyApis || 'N/A'}

---

## 6. SECURITY

| Setting | Value |
|---------|-------|
| **Session Timeout** | ${data.sessionTimeout || '60'} minutes |
| **Password Policy** | ${data.passwordPolicy || 'Medium'} |

### Security Features
- ${options.securityFeatures.join('\n- ') || 'SSL/TLS'}

### Compliance
- ${options.compliance.join('\n- ') || 'Privacy Policy'}

---

## 7. DEPLOYMENT

| Setting | Value |
|---------|-------|
| **Hosting** | ${data.hosting || 'GitHub Pages'} |
| **Domain** | ${data.domain || 'N/A'} |
| **Min SDK** | API ${data.minSdk || '26'} |
| **Target SDK** | API ${data.targetSdk || '33'} |
| **CI/CD** | ${options.cicd.join(', ') || 'GitHub Actions'} |

### Payment Integration
- ${options.payment.join('\n- ') || 'Cash on Delivery'}

---

`;

    // AI Code Generation Prompt
    if (options.includeAiPrompt) {
        md += `## 8. AI CODE GENERATION PROMPT

Use this prompt with AI to generate your complete codebase:

\`\`\`
I need to build a ${data.projectType || 'project'} called "${data.projectName || 'Project'}".

Tech Stack:
- Frontend: ${data.projectType === 'android-app' ? 'Flutter/Dart' : 'HTML/CSS/JavaScript'}
- Backend: ${data.databaseType || 'Firebase'}
- Authentication: ${data.authType || 'Firebase Auth'}
- Hosting: ${data.hosting || 'GitHub Pages'}

Features Required:
${data.coreFeatures || '- User Registration\n- Dashboard\n- Profile Management'}

Design:
- Primary Color: ${data.primaryColor || '#6C63FF'}
- Secondary Color: ${data.secondaryColor || '#FF6584'}
- Style: ${options.designStyle.join(', ') || 'Material Design'}

Database Collections:
${data.databaseCollections || 'Users, Posts, Comments'}

Please generate complete, production-ready code with:
1. Clean folder structure
2. All necessary files
3. Error handling
4. Responsive design
5. Animations
6. Comments for complex logic
\`\`\`

---

`;
    }

    // Testing Checklist
    if (options.includeChecklist) {
        md += `## 9. TESTING CHECKLIST

### Functionality Tests
- [ ] User registration works
- [ ] User login works
- [ ] Logout works
- [ ] All screens load without crash
- [ ] Form validation works
- [ ] API calls work
- [ ] Data saves correctly
- [ ] Data loads correctly

### UI Tests
- [ ] Colors match design
- [ ] Fonts display correctly
- [ ] Images load properly
- [ ] Responsive on small screens
- [ ] Animations work smoothly
- [ ] No layout issues

### Performance Tests
- [ ] App startup < 3 seconds
- [ ] API response < 2 seconds
- [ ] Memory usage < 100MB
- [ ] Battery consumption minimal
- [ ] App size optimized

### Security Tests
- [ ] Passwords encrypted
- [ ] API calls use HTTPS
- [ ] No data in logs
- [ ] Token expiration works
- [ ] Input validation works

### Device Tests
- [ ] Samsung Galaxy (Android 12+)
- [ ] Pixel (Android 13+)
- [ ] Budget phone (2GB RAM)
- [ ] Tablet (if applicable)

---

`;
    }

    // Deployment Guide
    if (options.includeDeployment) {
        md += `## 10. DEPLOYMENT GUIDE

### Pre-Deployment Checklist
- [ ] Version number updated
- [ ] All tests passed
- [ ] No debug logs in code
- [ ] App size optimized
- [ ] Screenshots ready
- [ ] Store listing complete

### Build Commands
\`\`\`bash
# Android
flutter build apk --release

# Web
npm run build

# GitHub Actions auto-deploy on push to main
\`\`\`

### Post-Deployment
- [ ] Monitor crash reports
- [ ] Check analytics
- [ ] Review user feedback
- [ ] Plan updates

---

## 11. DELIVERY PACKAGE

### Files to Deliver
- [ ] Source code (GitHub repo)
- [ ] APK/IPA file
- [ ] Documentation
- [ ] Login credentials
- [ ] API keys
- [ ] Hosting details
- [ ] Domain details

### Client Handover
| Item | Location |
|------|----------|
| Source Code | GitHub Repository |
| APK File | /delivery/app-release.apk |
| Documentation | /docs/ |
| API Keys | .env file |

---

*Blueprint generated on ${new Date().toLocaleDateString()}*
*Generated by: Blueprint Generator | opencode-ai*
`;
    }

    return md;
}

// ===== DOWNLOAD FILE =====
function downloadFile(content, filename) {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ===== CLOSE MODAL =====
closeModal.addEventListener('click', () => {
    successModal.classList.add('hidden');
});

// ===== COLOR PICKER UPDATE =====
document.querySelectorAll('input[type="color"]').forEach(picker => {
    picker.addEventListener('input', (e) => {
        const valueSpan = e.target.parentElement.querySelector('.color-value');
        valueSpan.textContent = e.target.value;
    });
});

// ===== INPUT ANIMATION =====
document.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('focus', () => {
        field.parentElement.style.transform = 'translateY(-2px)';
    });
    
    field.addEventListener('blur', () => {
        field.parentElement.style.transform = '';
    });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (currentStep < totalSteps) {
            nextBtn.click();
        }
    }
});

// ===== AUTO-SAVE TO LOCAL STORAGE =====
form.addEventListener('input', () => {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    localStorage.setItem('blueprintData', JSON.stringify(data));
});

// ===== LOAD FROM LOCAL STORAGE =====
window.addEventListener('load', () => {
    const saved = localStorage.getItem('blueprintData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.keys(data).forEach(key => {
            const field = form.elements[key];
            if (field) {
                if (field.type === 'radio') {
                    const radio = form.querySelector(`input[name="${key}"][value="${data[key]}"]`);
                    if (radio) radio.checked = true;
                } else {
                    field.value = data[key];
                }
            }
        });
    }
});

// ===== SHAKE ANIMATION =====
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);
