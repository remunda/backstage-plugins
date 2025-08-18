# Feature: Iframe-Based Data Contract Template Rendering

## Description

Implemented a secure iframe-based rendering system for data contract templates that provides complete CSS isolation and prevents styling conflicts with the parent Backstage application. The solution uses editor-styled templates with TailwindCSS for consistent, professional presentation while maintaining security through sandboxed execution.

## Architecture Overview

### Core Components

1. **DataContractDefinitionWidget** - Main React component that manages iframe rendering
2. **iframe-template.ts** - HTML document generator for iframe content
3. **iframe-styles.ts** - CSS content exported as TypeScript string constant
4. **htmlRenderer.ts** - Template engine for data contract content generation

## Key Features

### Complete CSS Isolation
- ✅ Iframe sandbox prevents style bleeding between parent and child contexts
- ✅ TailwindCSS loaded via CDN within iframe for complete design system
- ✅ Custom CSS overrides for data contract-specific styling
- ✅ Responsive design that works within Backstage's layout system

### Secure Rendering
- ✅ Data URL approach eliminates CORS issues
- ✅ Sandbox attributes restrict script execution and popup behavior
- ✅ No external dependencies in parent application
- ✅ Content Security Policy compliant implementation

### Editor-Style Template System
- ✅ Clean, minimal design focused on content readability
- ✅ TailwindCSS utility classes for consistent spacing and typography
- ✅ Grid-based layout with responsive behavior
- ✅ Professional color scheme and typography hierarchy

### Enhanced User Experience
- ✅ Smooth iframe integration with border radius and shadow
- ✅ Full viewport height utilization for optimal content display
- ✅ Hidden UI elements (Show YAML button, Entity Relationship Diagram) via CSS
- ✅ Print-friendly styling for documentation purposes

## Implementation Details

### Iframe Content Generation
```typescript
// Complete HTML document with embedded CSS and content
export function generateIframeHTML(htmlContent: string): string {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Data Contract</title>
        <style>${iframeCSSContent}</style>
    </head>
    <body>${htmlContent}</body>
    </html>`;
}
```

### CSS Hiding Rules
```css
/* Hide unwanted UI elements */
button[onclick*="showModal"] { display: none !important; }  /* Show YAML button */
#diagram { display: none !important; }                      /* Entity Relationship Diagram */
```

### TypeScript CSS Module
- CSS content exported as string constant for build system compatibility
- TailwindCSS imported via CDN within iframe context
- Custom overrides for data contract specific styling needs
- Maintains type safety while providing runtime CSS injection

## Benefits

### For Developers
- **No CSS Conflicts** - Complete isolation prevents styling issues
- **Easy Maintenance** - Template changes don't affect parent application
- **Type Safety** - TypeScript CSS modules provide intellisense and error checking
- **Build Integration** - Works seamlessly with existing build pipeline

### For Users
- **Consistent Experience** - Professional, editor-like presentation
- **Fast Loading** - Minimal overhead with efficient rendering
- **Responsive Design** - Adapts to different screen sizes and containers
- **Clean Interface** - Hidden unnecessary UI elements for focused content view

## Technical Specifications

- **Framework Integration**: React with TypeScript for type safety
- **CSS Framework**: TailwindCSS 2.2.19 via CDN for complete design system
- **Rendering Method**: Data URLs for CORS-free iframe content delivery
- **Security Model**: Sandboxed iframe with restricted permissions
- **Performance**: Lazy loading with useEffect and useRef hooks

## Validation

The iframe-based implementation successfully provides:
- ✅ Complete visual isolation from Backstage UI
- ✅ Professional, clean presentation of data contract content
- ✅ Hidden unwanted UI elements (Show YAML button, ERD)
- ✅ Responsive layout that works in widget and page contexts
- ✅ Secure rendering without security policy violations
- ✅ Fast, efficient content updates on definition changes

## Future Enhancements

- Consider dark mode support matching Backstage theme
- Potential for custom CSS themes per organization
- Enhanced accessibility features for iframe content
- Performance optimizations for large data contracts
