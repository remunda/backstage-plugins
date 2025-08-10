import { DataContractPage } from "./DataContractPage";
import type { DataContractWrapperProps } from "./DataContractWrapper";

export const DataContractPageWrapper = (props: DataContractWrapperProps) => {
	return <DataContractPage definition={props.definition} />;
};
