import { useEffect, useRef } from "react";
import { renderDataContract } from "../../templates/htmlRenderer";
import { generateIframeHTML } from "./iframe-template";

export type DataContractDefinitionWidgetProps = {
	definition: string;
};

export const DataContractDefinitionWidget = ({
	definition,
}: DataContractDefinitionWidgetProps) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (iframeRef.current) {
			const htmlContent = renderDataContract(definition);
			const fullHtmlContent = generateIframeHTML(htmlContent);

			// Create a data URL to avoid CORS issues
			const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(fullHtmlContent)}`;
			iframeRef.current.src = dataUrl;
		}
	}, [definition]);

	return (
		<div style={{ width: "100%", height: "100vh", border: "none" }}>
			<iframe
				ref={iframeRef}
				style={{
					width: "100%",
					height: "100%",
					border: "none",
					borderRadius: "8px",
					boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
				}}
				title="Data Contract Display"
				sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
			/>
		</div>
	);
};
