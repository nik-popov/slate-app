# CSS Style Guide & Documentation

## Overview

This project uses a hybrid approach combining Tailwind CSS utility classes with custom CSS components and utilities built on CSS custom properties (variables). This approach provides the flexibility of Tailwind with the maintainability and consistency of a design system.

## Architecture

### 1. CSS Custom Properties (Variables)
All design tokens are defined as CSS custom properties in `:root` for easy maintenance and consistency:

```css
:root {
  /* Colors */
  --color-primary: #ffffff;
  --color-secondary: #000000;
  --color-neutral-*: /* Full neutral palette */
  
  /* Typography */
  --font-size-*: /* Complete type scale */
  --line-height-*: /* Consistent line heights */
  
  /* Spacing */
  --spacing-*: /* Consistent spacing scale */
  
  /* Other tokens... */
}
```

### 2. Layer Structure
CSS is organized into three main layers:

- **@layer base**: Base styles, resets, and typography
- **@layer components**: Reusable component classes
- **@layer utilities**: Utility classes and helpers

## Design Tokens

### Color System
```css
/* Primary Colors */
--color-primary: #ffffff (white)
--color-secondary: #000000 (black)

/* Neutral Scale (50-950) */
--color-neutral-100: #f5f5f5 (lightest)
--color-neutral-900: #171717 (darkest)

/* Background Colors */
--color-bg-primary: #000000 (main background)
--color-bg-card: rgba(0, 0, 0, 0.6) (card backgrounds)
--color-bg-modal: rgba(0, 0, 0, 0.8) (modal overlays)
```

### Typography Scale
```css
--font-size-xs: 0.75rem    (12px)
--font-size-sm: 0.875rem   (14px)
--font-size-base: 1rem     (16px)
--font-size-lg: 1.125rem   (18px)
--font-size-xl: 1.25rem    (20px)
--font-size-2xl: 1.5rem    (24px)
--font-size-3xl: 1.875rem  (30px)
--font-size-4xl: 2.25rem   (36px)
```

### Spacing Scale
```css
--spacing-xs: 0.25rem   (4px)
--spacing-sm: 0.5rem    (8px)
--spacing-md: 0.75rem   (12px)
--spacing-lg: 1rem      (16px)
--spacing-xl: 1.5rem    (24px)
--spacing-2xl: 2rem     (32px)
--spacing-3xl: 3rem     (48px)
--spacing-4xl: 4rem     (64px)
```

## Component Classes

### Buttons
```css
/* Base button class */
.btn { /* base styles */ }

/* Variants */
.btn-primary    /* White background, black text */
.btn-secondary  /* Dark background, light text */
.btn-ghost      /* Transparent background */

/* Sizes */
.btn-sm   /* Small button */
.btn-lg   /* Large button */
```

**Usage:**
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary btn-sm">Secondary</button>
```

### Form Controls
```css
.form-input     /* Text inputs */
.form-textarea  /* Textarea with resize */
.form-select    /* Select dropdown with custom arrow */
```

**Usage:**
```html
<input type="text" class="form-input" placeholder="Enter text...">
<textarea class="form-input form-textarea"></textarea>
<select class="form-input form-select">...</select>
```

### Cards
```css
.card           /* Base card with backdrop blur */
.card-header    /* Card header section */
.card-title     /* Card title styling */
.card-description /* Card description text */
```

**Usage:**
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
    <p class="card-description">Card description text</p>
  </div>
  <div class="card-body">Content here</div>
</div>
```

### Modals
```css
.modal-overlay  /* Full-screen overlay with backdrop blur */
.modal-content  /* Modal container */
.modal-header   /* Modal header with title and close */
.modal-body     /* Modal content area */
.modal-footer   /* Modal footer with actions */
```

### Badges
```css
.badge          /* Base badge */
.badge-primary  /* Primary colored badge */
.badge-secondary /* Secondary colored badge */
.badge-outline  /* Outlined badge */
```

## Utility Classes

### Loading States
```css
.loading-spinner  /* Rotating spinner */
.loading-dots     /* Animated dots */
```

### Text Utilities
```css
.text-balance     /* Balanced text wrapping */
.text-pretty      /* Pretty text wrapping */
.truncate-1       /* Single line truncation */
.truncate-2       /* Two line truncation */
.truncate-3       /* Three line truncation */
```

### Animation Utilities
```css
.animate-fade-in   /* Fade in animation */
.animate-slide-up  /* Slide up animation */
.animate-scale-in  /* Scale in animation */
```

### Backdrop Blur
```css
.backdrop-blur-xs  /* 2px blur */
.backdrop-blur-sm  /* 4px blur */
.backdrop-blur-md  /* 8px blur */
.backdrop-blur-lg  /* 16px blur */
.backdrop-blur-xl  /* 24px blur */
```

## Layout System

### Responsive Grid
```css
.grid-responsive  /* Auto-fitting responsive grid */
```

**Usage:**
```html
<div class="grid-responsive">
  <div class="card">Item 1</div>
  <div class="card">Item 2</div>
  <div class="card">Item 3</div>
</div>
```

### Container
```css
.container-custom  /* Responsive container with proper padding */
```

## Best Practices

### 1. Component-First Approach
- Use component classes (`.btn`, `.card`, etc.) for consistent styling
- Combine with Tailwind utilities for specific adjustments
- Avoid inline styles

### 2. Consistent Spacing
- Use spacing variables for margins and padding
- Stick to the spacing scale for consistency
- Use Tailwind's spacing utilities that map to our variables

### 3. Color Usage
- Use semantic color variables (`--color-primary`, `--color-neutral-*`)
- Maintain contrast ratios for accessibility
- Test in both light and dark environments

### 4. Typography
- Use the defined type scale consistently
- Apply appropriate line heights for readability
- Use text wrapping utilities for better layouts

### 5. Responsive Design
- Mobile-first approach
- Use container classes for proper layout
- Test across all breakpoints

## Accessibility Features

### Focus Management
- Clear focus indicators with `focus-ring` class
- Proper focus order in interactive elements
- Skip links for screen readers with `.sr-only`

### Color Contrast
- High contrast mode support
- Sufficient color contrast ratios
- Semantic color usage

### Motion
- Respects `prefers-reduced-motion`
- Smooth animations with appropriate timing
- Optional animation utilities

## Integration with Tailwind

The custom CSS system works seamlessly with Tailwind:

```html
<!-- Combining component classes with Tailwind utilities -->
<button class="btn btn-primary mb-4 w-full md:w-auto">
  Custom Component + Tailwind Utilities
</button>

<!-- Using CSS variables in Tailwind -->
<div class="bg-neutral-900 text-neutral-100 p-lg rounded-lg">
  Content with CSS variable-based utilities
</div>
```

## Performance Considerations

1. **CSS Variables**: Minimal performance impact, excellent for theming
2. **Layer Organization**: Ensures proper cascade and specificity
3. **Utility Classes**: Small, focused classes reduce CSS bundle size
4. **Component Classes**: Reduce HTML bloat from utility-heavy markup

## Maintenance

### Adding New Components
1. Define in the `@layer components` section
2. Use existing CSS variables when possible
3. Follow naming conventions (BEM-inspired)
4. Document usage patterns

### Extending Color Palette
1. Add new variables to `:root`
2. Update Tailwind config if needed
3. Ensure accessibility compliance
4. Update documentation

### Responsive Breakpoints
Current breakpoints follow Tailwind defaults:
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## File Organization

```
src/
├── index.css           # Main CSS file with all layers
├── components/         # React components
└── styles/            # Additional style files (if needed)
```

This CSS system provides a scalable, maintainable foundation for the Slate app while maintaining the flexibility and utility of Tailwind CSS.