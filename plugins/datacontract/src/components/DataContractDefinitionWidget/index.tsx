import { CodeSnippet } from "@backstage/core-components";

export type DataContractDefinitionWidgetProps = {
	definition: string;
};

export const DataContractDefinitionWidget = ({
	definition,
}: DataContractDefinitionWidgetProps) => {
	return (
		<>
			<h1>Data Contract Definition</h1>
			<CodeSnippet
				text={definition}
				language="yaml"
				showLineNumbers
				showCopyCodeButton
			/>
		</>
	);
};
