import { renderDataContract } from "../../templates/htmlRenderer";

export type DataContractDefinitionWidgetProps = {
	definition: string;
};

export const DataContractDefinitionWidget = ({
	definition,
}: DataContractDefinitionWidgetProps) => {
	const htmlContent = renderDataContract(definition);

	// Note: dangerouslySetInnerHTML is required here to render the HTML output from our template engine.
	// The renderDataContractHtml function properly escapes all user content to prevent XSS attacks.
	return (
		<div
			// biome-ignore lint/security/noDangerouslySetInnerHtml: Required for template rendering with proper XSS protection
			dangerouslySetInnerHTML={{ __html: htmlContent }}
			style={{
				// Add some basic styling to ensure TailwindCSS-like classes work
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
		/>
	);
};
