import { useEffect, useRef } from "react";
import type { ApiEntity } from "@backstage/catalog-model";
import { renderDataContract } from "../../templates/htmlRenderer";
import { generateIframeHTML } from "./iframe-template";
import { DataContractValidationErrors } from "../DataContractValidationErrors";

export type DataContractDefinitionWidgetProps = {
	definition: string;
	apiEntity?: ApiEntity;
};

export const DataContractDefinitionWidget = ({
	definition,
	apiEntity,
}: DataContractDefinitionWidgetProps) => {
	const iframeRef = useRef<HTMLIFrameElement>(null);

	useEffect(() => {
		if (iframeRef.current) {
			const htmlContent = renderDataContract(definition);
			const fullHtmlContent = generateIframeHTML(htmlContent);

			// Create a data URL to avoid CORS issues
			const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(
				fullHtmlContent,
			)}`;
			iframeRef.current.src = dataUrl;
		}
	}, [definition]);

	const validationErrors = apiEntity?.metadata?.annotations?.['datacontract.io/validation-errors'];

	return (
		<div style={{ width: "100%", height: "100vh", border: "none" }}>
			<DataContractValidationErrors validationErrors={validationErrors} />
			<iframe
				ref={iframeRef}
				style={{
					width: "100%",
					height: "100%",
					border: "none",
				}}
				title="Data Contract Display"
				sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox"
				role="presentation"
			/>
		</div>
	);
};
