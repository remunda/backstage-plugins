import type React from "react";
import { DataContractPage } from "./DataContractPage";

export interface DataContractWrapperProps {
	definition: string;
}

export const DataContractWrapper: React.FC<DataContractWrapperProps> = ({
	definition,
}) => {
	return <DataContractPage definition={definition} />;
};
