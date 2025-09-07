import { render, screen } from "@testing-library/react";
import type { ApiEntity } from "@backstage/catalog-model";
import { DataContractDefinitionWidget } from "./index";
import { DataContractValidationErrors } from "../DataContractValidationErrors";

describe("ValidationErrors Integration Tests", () => {
	const sampleYaml = `
dataContractSpecification: "0.9.0"
id: test-contract
info:
  title: Test Data Contract
  version: "1.0.0"
`;

	it("renders validation error component standalone", () => {
		render(
			<DataContractValidationErrors 
				validationErrors="Test validation error message" 
			/>
		);
		
		expect(screen.getByText("Data Contract Validation Issues:")).toBeInTheDocument();
		expect(screen.getByText("Test validation error message")).toBeInTheDocument();
	});

	it("does not render when no validation errors", () => {
		render(<DataContractValidationErrors />);
		
		expect(screen.queryByText("Data Contract Validation Issues:")).not.toBeInTheDocument();
	});

	it("integrates validation errors with data contract widget", () => {
		const entityWithErrors: ApiEntity = {
			apiVersion: "backstage.io/v1alpha1",
			kind: "API",
			metadata: {
				name: "test-api",
				annotations: {
					'datacontract.io/validation-errors': 'root/info: must have required property "version"; root/servers/prod: must have required property "type"'
				}
			},
			spec: { 
				type: "datacontract", 
				lifecycle: "production",
				owner: "team-a",
				definition: sampleYaml 
			},
		};

		render(
			<DataContractDefinitionWidget 
				definition={sampleYaml} 
				apiEntity={entityWithErrors} 
			/>
		);
		
		// Should show validation errors at the top
		expect(screen.getByText("Data Contract Validation Issues:")).toBeInTheDocument();
		expect(screen.getByText(/must have required property "version"/)).toBeInTheDocument();
		expect(screen.getByText(/must have required property "type"/)).toBeInTheDocument();
		
		// Should still render the iframe for the data contract
		const iframe = screen.getByRole("presentation", { hidden: true });
		expect(iframe).toBeInTheDocument();
	});

	it("shows complex validation error messages properly", () => {
		const complexErrorMessage = 'root/info: must have required property "version"; root/models/orders/fields/customer_id: must be string; root/servers/prod: must have required property "type"';
		
		render(
			<DataContractValidationErrors 
				validationErrors={complexErrorMessage} 
			/>
		);
		
		expect(screen.getByText("Data Contract Validation Issues:")).toBeInTheDocument();
		expect(screen.getByText(complexErrorMessage)).toBeInTheDocument();
	});
});