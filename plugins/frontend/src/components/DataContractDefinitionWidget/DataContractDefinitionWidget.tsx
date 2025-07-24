import { Box } from "@material-ui/core";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialLight } from "react-syntax-highlighter/dist/esm/styles/prism";

export type DataContractDefinitionWidgetProps = {
	definition: string;
};

export const DataContractDefinitionWidget = ({
	definition,
}: DataContractDefinitionWidgetProps) => {
	return (
		<Box data-testid="datacontract-definition">
			<SyntaxHighlighter language="yaml" style={materialLight} wrapLongLines>
				{definition}
			</SyntaxHighlighter>
		</Box>
	);
};
