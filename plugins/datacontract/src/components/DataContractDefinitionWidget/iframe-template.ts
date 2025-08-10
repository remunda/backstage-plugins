// Import the CSS content as string
import { iframeCSSContent } from "./iframe-styles";

/**
 * Generates the complete HTML document for the iframe
 * @param htmlContent - The rendered data contract HTML content
 * @returns Complete HTML document string
 */
export function generateIframeHTML(htmlContent: string): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Data Contract</title>
	<style>
		${iframeCSSContent}
	</style>
</head>
<body>
	${htmlContent}
</body>
</html>`;
}
