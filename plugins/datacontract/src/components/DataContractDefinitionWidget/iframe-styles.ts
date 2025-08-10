export const iframeCSSContent = `/* Import Tailwind CSS from CDN for iframe */
@import url('https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css');

/* Custom styles for data contract display */
.grid-container {
	display: grid;
	grid-template-columns: 1fr;
	grid-template-rows: auto 1fr;
	height: 100vh;
	max-height: 100vh;
}

main {
	height: 100%;
	overflow-y: auto;
	padding: 0;
	margin: 0;
}

body {
	margin: 0;
	padding: 0;
	font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	line-height: 1.6;
	color: #374151;
	background-color: #ffffff;
}

/* Override any default styles */
* {
	box-sizing: border-box;
}

/* Hide Show YAML button */
button[onclick*="showModal"] {
	display: none !important;
}

/* Hide Entity Relationship Diagram section */
#diagram {
	display: none !important;
}

/* Ensure proper table styling */
.min-w-full {
	min-width: 100%;
}

.divide-y {
	border-top-width: 1px;
}

.divide-gray-300 > * + * {
	border-top-width: 1px;
	border-top-color: #d1d5db;
}

.divide-gray-200 > * + * {
	border-top-width: 1px;
	border-top-color: #e5e7eb;
}

/* Table styles */
table {
	border-collapse: collapse;
	width: 100%;
}

th, td {
	border: 1px solid #e5e7eb;
	padding: 0.5rem;
	text-align: left;
}

th {
	background-color: #f9fafb;
	font-weight: 600;
}

/* Link styles */
a {
	color: #0ea5e9;
	text-decoration: none;
}

a:hover {
	color: #0284c7;
	text-decoration: underline;
}
`;
