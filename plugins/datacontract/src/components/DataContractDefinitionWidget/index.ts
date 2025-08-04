import { CodeSnippet } from '@backstage/core-components';

export type DataContractDefinitionWidgetProps = {
	definition: string;
};

export const DataContractDefinitionWidget = ({
	definition,
}: DataContractDefinitionWidgetProps) => {
	return (
		 <CodeSnippet
            text={definition}
            language="yaml"
            showLineNumbers
            showCopyCodeButton
            />
	);
};