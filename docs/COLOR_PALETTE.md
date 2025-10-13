# Color Palette

## Current Colors (Templated)

### Primary Colors
```css
--color-primary: #19B76A;        /* Generic green */
--color-primary-dark: #16A085;   /* Generic teal */
```

### Background Colors
```css
--bg-main: linear-gradient(180deg, #BFC3C8 0%, #DAD9DA 100%);
--bg-container: #F8F8F8;
--bg-left-top: rgba(245, 245, 245, 0.9);
--bg-left-bottom: rgba(255, 255, 255, 0.9);
--bg-input: rgba(255, 255, 255, 0.95);
```

### Text Colors
```css
--text-primary: #202020;         /* Dark gray */
--text-secondary: #343434;       /* Medium gray */
--text-muted: #6B7280;           /* Light gray */
--text-placeholder: #9CA3AF;      /* Very light gray */
--text-disabled: #D1D5DB;        /* Disabled gray */
```

### Medical Card Colors (Current - Generic)
```css
.summary-card { border-left: 4px solid #19B76A; }      /* Green */
.findings-card { border-left: 4px solid #3B82F6; }     /* Blue */
.impression-card { border-left: 4px solid #8B5CF6; }   /* Purple */
.actions-card { border-left: 4px solid #F59E0B; }      /* Orange */
.references-card { border-left: 4px solid #6B7280; }   /* Gray */
```

## Issues with Current Palette

1. **Generic Colors**: Using standard web colors without brand identity
2. **No Semantic Meaning**: Colors don't convey medical context
3. **Inconsistent Usage**: Random color assignments to card types
4. **No Brand Connection**: Colors don't reflect your brand personality

## Target Design Color Palette

### Based on Reference Design:

#### **Background Colors**
```css
--bg-dark: #1a1a1a;              /* Dark background */
--bg-card: #ffffff;              /* Light card background */
--bg-gradient-start: #14b8a6;     /* Teal/green gradient start */
--bg-gradient-end: #f59e0b;      /* Orange/yellow gradient end */
```

#### **Text Colors**
```css
--text-primary: #1f2937;         /* Dark gray for main content */
--text-secondary: #6b7280;       /* Medium gray for labels */
--text-muted: #9ca3af;           /* Light gray for secondary info */
```

#### **Accent Colors**
```css
--accent-warning: #fbbf24;       /* Yellow for warning icons */
--accent-gradient-start: #14b8a6; /* Teal for gradient */
--accent-gradient-end: #f59e0b;   /* Orange for gradient */
```

#### **Border Colors**
```css
--border-gradient: linear-gradient(90deg, #14b8a6 0%, #f59e0b 100%);
--border-light: #e5e7eb;         /* Light borders */
```

### Design System Structure:
```css
/* Brand Colors */
--brand-primary: #14b8a6;         /* Teal - primary brand color */
--brand-secondary: #f59e0b;        /* Orange - secondary brand color */
--brand-gradient: linear-gradient(90deg, #14b8a6 0%, #f59e0b 100%);

/* Semantic Colors */
--semantic-warning: #fbbf24;      /* Yellow for urgent actions */
--semantic-critical: #ef4444;     /* Red for critical conditions */
--semantic-info: #3b82f6;         /* Blue for informational content */

/* Background System */
--bg-primary: #1a1a1a;            /* Dark background */
--bg-card: #ffffff;              /* Card background */
--bg-overlay: rgba(0, 0, 0, 0.8); /* Dark overlay */

/* Text Hierarchy */
--text-primary: #1f2937;         /* Main content */
--text-secondary: #6b7280;       /* Labels and descriptions */
--text-muted: #9ca3af;           /* Secondary information */
```

## Usage Guidelines

### Do's
*[To be defined based on your brand guidelines]*

### Don'ts
*[To be defined based on your brand guidelines]*

---

*This document will be updated as we define your brand colors and semantic color usage.*
