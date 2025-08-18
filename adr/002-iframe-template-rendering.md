# ADR-002: Iframe-Based Template Rendering

## Status
Accepted

## Context
The plugin needed to render DataContract YAML content in a rich, formatted view within Backstage. The challenge was to provide a clean, professional presentation while avoiding CSS conflicts with the parent Backstage application. Initial attempts with inline rendering caused styling conflicts and inconsistent presentation.

## Decision
We decided to implement an iframe-based rendering system that provides complete CSS isolation while maintaining security and performance.

## Architecture

### Core Components
1. **DataContractDefinitionWidget** - Main React component managing iframe lifecycle
2. **iframe-template.ts** - HTML document generator for iframe content
3. **iframe-styles.ts** - CSS content exported as TypeScript string constant
4. **htmlRenderer.ts** - Template engine for DataContract content generation

### Implementation Approach
```typescript
// Iframe content generation
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

// React component usage
const DataContractDefinitionWidget = () => {
    const iframeHTML = generateIframeHTML(renderedContent);
    const dataURL = `data:text/html;charset=utf-8,${encodeURIComponent(iframeHTML)}`;
    
    return (
        <iframe
            src={dataURL}
            style={{ width: '100%', height: '600px', border: 'none' }}
            sandbox="allow-same-origin"
        />
    );
};
```

## Technical Decisions

### CSS Isolation Strategy
- **Complete Iframe Sandboxing**: Prevents any CSS bleeding between parent and child contexts
- **TailwindCSS via CDN**: Loaded within iframe for complete design system access
- **Custom CSS Overrides**: DataContract-specific styling without affecting parent application
- **Element Hiding**: CSS rules to hide unwanted UI elements (Show YAML button, Entity Relationship Diagram)

### Security Model
- **Data URL Approach**: Eliminates CORS issues while maintaining security
- **Sandbox Attributes**: Restrict script execution and popup behavior
- **No External Dependencies**: All resources loaded within iframe context
- **CSP Compliance**: Implementation respects Content Security Policy requirements

### Styling Approach
- **Editor-Style Templates**: Clean, minimal design focused on content readability
- **Professional Presentation**: Consistent typography and spacing using TailwindCSS utilities
- **Responsive Design**: Grid-based layout adapting to different screen sizes
- **Print-Friendly**: Optimized for both screen and print media

## Consequences

### Positive
- **Complete CSS Isolation**: No styling conflicts with Backstage application
- **Professional Presentation**: Consistent, clean rendering of DataContract content
- **Security**: Sandboxed execution prevents security vulnerabilities
- **Maintainability**: Template changes isolated from parent application
- **Performance**: Efficient rendering with minimal overhead
- **Flexibility**: Easy to customize styling without affecting other components

### Negative
- **Complexity**: Additional abstraction layer for content rendering
- **Memory Usage**: Iframe instances consume more memory than inline rendering
- **Debugging**: Slightly more complex to debug styling issues within iframe
- **Browser Compatibility**: Requires modern browser support for data URLs and sandbox attributes

## Alternatives Considered

1. **Inline Rendering with CSS Modules**
   - Rejected: CSS conflicts with Backstage's Material-UI styling
   - Issue: Global CSS rules affecting DataContract presentation

2. **Shadow DOM**
   - Rejected: Limited browser support and complexity with React integration
   - Issue: Styling encapsulation not as robust as iframe approach

3. **External Service Rendering**
   - Rejected: Added infrastructure complexity and latency
   - Issue: Would require separate deployment and maintenance

4. **CSS-in-JS with Styled Components**
   - Rejected: Still potential for conflicts and harder to achieve complete isolation
   - Issue: Cannot guarantee isolation from all Backstage styling

## Implementation Details

### CSS Management
```typescript
// iframe-styles.ts - Type-safe CSS module
export const iframeCSSContent = `
    @import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');
    
    /* Hide unwanted UI elements */
    button[onclick*="showModal"] { display: none !important; }
    #diagram { display: none !important; }
    
    /* Custom DataContract styling */
    .datacontract-content {
        font-family: 'Inter', sans-serif;
        line-height: 1.6;
    }
`;
```

### Integration Pattern
```typescript
// Widget registration in plugin
export const EntityDataContractDefinitionCard = dataContractPlugin.provide(
    createRoutableExtension({
        name: 'EntityDataContractDefinitionCard',
        component: () => import('./components/DataContractDefinitionWidget').then(m => m.DataContractDefinitionWidget),
        mountPoint: rootRouteRef,
    }),
);
```

## Related
- [ADR-001: Plugin Architecture and Entity Integration](./001-plugin-architecture.md)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [MDN: iframe sandbox attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#attr-sandbox)
