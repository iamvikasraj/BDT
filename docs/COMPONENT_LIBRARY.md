# Component Library

## Medical Analysis Cards

### Current Implementation (Templated)
```html
<div class="medical-card summary-card">
    <div class="card-header">
        <div class="card-icon">📋</div>
        <h3 class="card-title">Summary</h3>
    </div>
    <div class="card-content">
        <p class="summary-text">Content here</p>
    </div>
</div>
```

### Issues with Current Design
- Generic emoji icons (📋, 🔍, 🎯, ⚡, 📚)
- Standard color palette (green, blue, purple, orange, gray)
- Common card patterns
- Basic shadows and borders
- Multiple separate cards instead of unified design

### Target Design Requirements

#### **Single Unified Card Structure**
```html
<div class="medical-analysis-card">
    <!-- Main Summary Statement -->
    <div class="summary-statement">
        Based on the lab values presented, elevated troponin is the most concerning finding requiring immediate attention.
    </div>
    
    <!-- Key Findings Section -->
    <div class="key-findings">
        <div class="finding-item">
            <span class="lab-name">Troponin</span>
            <span class="lab-value">2.5 ng/mL</span>
            <span class="lab-description">significantly elevated (normal <0.04)</span>
        </div>
        <div class="finding-item">
            <span class="lab-name">Hemoglobin</span>
            <span class="lab-value">12.5 g/dL</span>
            <span class="lab-description">low-normal range</span>
        </div>
    </div>
    
    <!-- Clinical Impression Container -->
    <div class="clinical-section">
        <div class="section-label">Clinical impression</div>
        <div class="diagnosis-container">
            Acute coronary syndrome is the most likely diagnosis given the troponin elevation
        </div>
    </div>
    
    <!-- Immediate Actions Container -->
    <div class="actions-section">
        <div class="section-label">Immediate actions</div>
        <div class="actions-container">
            <div class="action-item">
                <span class="warning-icon">⚠️</span>
                Urgent cardiology evaluation
            </div>
            <div class="action-item">
                <span class="warning-icon">⚠️</span>
                Serial cardiac monitoring
            </div>
            <div class="action-item">
                <span class="warning-icon">⚠️</span>
                Antiplatelet therapy consideration
            </div>
        </div>
    </div>
</div>
```

#### **Key Design Elements**
- **Single card** with gradient border (teal to orange)
- **Dark background** with light card
- **Typography hierarchy**: Bold values, descriptive text, section labels
- **Nested containers**: Diagnosis and actions in gradient-bordered sub-containers
- **Warning icons**: Yellow exclamation marks (⚠️) for urgent actions
- **Clean separators**: Subtle visual boundaries between sections

---

## Buttons

### Current Implementation
*[To be reviewed and updated]*

### Design Requirements
*[To be defined based on your brand guidelines]*

---

## Forms

### Current Implementation
*[To be reviewed and updated]*

### Design Requirements
*[To be defined based on your brand guidelines]*

---

## Icons

### Current Implementation
- Using emoji icons: 📋, 🔍, 🎯, ⚡, 📚
- Generic and not brand-specific

### Design Requirements
*[To be defined based on your brand guidelines]*

### Options to Consider
1. Custom SVG icons
2. Icon font (Font Awesome, Feather, etc.)
3. Simple geometric shapes
4. No icons (text-only)

---

## Navigation

### Current Implementation
*[To be reviewed and updated]*

### Design Requirements
*[To be defined based on your brand guidelines]*

---

## Status Indicators

### Current Implementation
*[To be reviewed and updated]*

### Design Requirements
*[To be defined based on your brand guidelines]*

---

*This document will be updated as we define the design system.*
