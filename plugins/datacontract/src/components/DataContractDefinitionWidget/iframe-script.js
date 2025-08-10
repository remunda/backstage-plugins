export const iframeScriptContent = `// Initialize Mermaid if it exists
if (typeof mermaid !== 'undefined') {
	mermaid.initialize({
		startOnLoad: false,
		theme: 'neutral'
	});
	
	// Run mermaid on any .mermaid elements
	const mermaidElements = document.querySelectorAll('.mermaid');
	if (mermaidElements.length > 0) {
		mermaid.run({
			querySelector: '.mermaid',
			postRenderCallback: () => {
				const container = document.getElementById("diagram-container");
				if (container) {
					const svgElement = container.querySelector("svg");
					
					if (svgElement && typeof Panzoom !== 'undefined') {
						// Initialize Panzoom
						const panzoomInstance = Panzoom(svgElement, {
							maxScale: 5,
							minScale: 0.5,
							step: 0.1,
						});
						
						// Mouse wheel zoom
						container.addEventListener("wheel", (event) => {
							event.preventDefault();
							panzoomInstance.zoomWithWheel(event);
						});
					}
				}
			}
		});
	}
}

// Handle Show YAML button
document.addEventListener('click', (event) => {
	if (event.target?.closest('button[onclick*="showModal"]')) {
		event.preventDefault();
		// Note: yamlContent will be injected by the parent component
		const yamlContent = window.dataContractYaml || '';
		
		// Create a new window to show YAML
		const yamlWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
		if (yamlWindow) {
			yamlWindow.document.write(\`
				<html>
					<head>
						<title>Data Contract YAML</title>
						<style>
							body { 
								font-family: monospace; 
								margin: 20px; 
								background: #f5f5f5; 
							}
							pre { 
								background: white; 
								padding: 20px; 
								border-radius: 8px; 
								overflow: auto; 
								white-space: pre-wrap; 
								border: 1px solid #ddd;
							}
						</style>
					</head>
					<body>
						<h1>Data Contract YAML</h1>
						<pre>\${yamlContent}</pre>
					</body>
				</html>
			\`);
			yamlWindow.document.close();
		}
	}
});`;
