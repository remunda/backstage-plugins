import { renderDataContractHtml } from "../../utils/htmlRenderer";

export type DataContractDefinitionWidgetProps = {
	definition: string;
};

export const DataContractDefinitionWidget = ({
	definition,
}: DataContractDefinitionWidgetProps) => {
	const htmlContent = renderDataContractHtml(definition);

	return (
		<div
			dangerouslySetInnerHTML={{ __html: htmlContent }}
			style={{
				// Add some basic styling to ensure TailwindCSS-like classes work
				fontFamily: "system-ui, -apple-system, sans-serif",
			}}
		/>
	);
};
